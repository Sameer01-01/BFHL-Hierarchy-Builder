/**
 * @fileoverview Core graph processing logic for BFHL.
 *
 * Pipeline:
 *  1. Validate & classify edges (valid / invalid / duplicate)
 *  2. Enforce multi-parent rule (first-parent-wins)
 *  3. Find connected components via BFS on undirected graph
 *  4. Per component: detect root, check for cycles, build tree / depth
 *  5. Assemble summary
 */

const { validateEdge } = require('./validator');

/* ------------------------------------------------------------------ */
/* Public entry point                                                   */
/* ------------------------------------------------------------------ */

/**
 * Process a raw array of edge strings into hierarchies + metadata.
 *
 * @param {Array<*>} data - Raw input array (items may not be strings)
 * @returns {{
 *   hierarchies: Array<object>,
 *   invalid_entries: string[],
 *   duplicate_edges: string[],
 *   summary: { total_trees: number, total_cycles: number, largest_tree_root: string }
 * }}
 */
const processGraph = (data) => {
    /* ---- Phase 1: Classify edges ----------------------------------- */
    const invalid_entries = [];
    const duplicate_edges = [];
    const seenEdges      = new Set();   // first-seen raw edge strings
    const nodeParent     = new Map();   // child → first parent
    const adjList        = {};          // directed adjacency list
    const allNodes       = new Set();   // every node (including orphaned after multi-parent)

    for (const entry of data) {
        const { valid, trimmed, reason } = validateEdge(entry);

        if (!valid) {
            // Push the cleaned-up version (or String coercion) for clarity
            invalid_entries.push(trimmed);
            continue;
        }

        /* Duplicate detection (after first occurrence) */
        if (seenEdges.has(trimmed)) {
            if (!duplicate_edges.includes(trimmed)) {
                duplicate_edges.push(trimmed);
            }
            continue; // discard – first occurrence already recorded
        }
        seenEdges.add(trimmed);

        const [u, v] = trimmed.split('->');

        // Track all encountered nodes, even those silently dropped below
        allNodes.add(u);
        allNodes.add(v);

        /* ---- Phase 2: Multi-parent rule ---------------------------- */
        if (nodeParent.has(v)) {
            // v already has a parent — silently ignore this edge
            continue;
        }

        nodeParent.set(v, u);

        if (!adjList[u]) adjList[u] = [];
        adjList[u].push(v);
        if (!adjList[v]) adjList[v] = []; // ensure v exists in adjList
    }

    // Guarantee every node has an entry (including ones with no outgoing edges)
    for (const node of allNodes) {
        if (!adjList[node]) adjList[node] = [];
    }

    /* ---- Phase 3: Connected components (undirected BFS) ----------- */
    const components = _findComponents(Array.from(allNodes), adjList);

    /* ---- Phase 4: Per-component processing ------------------------ */
    const hierarchies = [];
    let total_trees = 0;
    let total_cycles = 0;
    let maxDepth = -1;
    let largest_tree_root = '';

    for (const component of components) {
        // Root = node in this component that has no recorded parent
        const possibleRoots = component.filter(n => !nodeParent.has(n)).sort();
        const root = possibleRoots.length > 0
            ? possibleRoots[0]                     // lexicographically smallest true root
            : [...component].sort()[0];            // cycle: pick lex-smallest node

        /* Cycle detection: DFS across the entire component */
        const cycleFound = _hasCycleInComponent(component, adjList);

        const nodeCount = component.length;
        // Count directed edges within this component
        const edgeCount = component.reduce((acc, n) => acc + (adjList[n]?.length ?? 0), 0);

        if (cycleFound) {
            total_cycles++;
            hierarchies.push({
                root,
                tree: {},
                has_cycle: true,
                node_count: nodeCount,
                edge_count: edgeCount,
            });
        } else {
            total_trees++;
            const tree  = _buildTree(root, adjList);
            const depth = _calcDepth(tree);

            hierarchies.push({
                root,
                tree,
                depth,
                has_cycle: false,
                node_count: nodeCount,
                edge_count: edgeCount,
            });

            if (depth > maxDepth || (depth === maxDepth && root < largest_tree_root)) {
                maxDepth = depth;
                largest_tree_root = root;
            }
        }
    }

    return {
        hierarchies,
        invalid_entries,
        duplicate_edges,
        summary: {
            total_trees,
            total_cycles,
            largest_tree_root,
        },
    };
};

/* ------------------------------------------------------------------ */
/* Private helpers                                                      */
/* ------------------------------------------------------------------ */

/**
 * Find all weakly-connected components of the directed graph using
 * BFS on the undirected projection (ignores edge direction).
 *
 * @param {string[]} nodes
 * @param {Record<string, string[]>} adj - directed adjacency list
 * @returns {string[][]} Array of components, each an array of node names
 */
const _findComponents = (nodes, adj) => {
    // Build undirected adjacency on the fly
    const undirected = {};
    for (const u of nodes) {
        if (!undirected[u]) undirected[u] = new Set();
        for (const v of (adj[u] ?? [])) {
            undirected[u].add(v);
            if (!undirected[v]) undirected[v] = new Set();
            undirected[v].add(u);
        }
    }

    const visited    = new Set();
    const components = [];

    for (const start of nodes) {
        if (visited.has(start)) continue;

        const component = [];
        const queue     = [start];
        visited.add(start);

        while (queue.length) {
            const curr = queue.shift();
            component.push(curr);
            for (const nb of (undirected[curr] ?? [])) {
                if (!visited.has(nb)) {
                    visited.add(nb);
                    queue.push(nb);
                }
            }
        }
        components.push(component);
    }
    return components;
};

/**
 * Detect a cycle in the given component using iterative DFS with
 * an explicit recursion stack. Works on the directed adjacency list.
 * Starting from every node in the component ensures we don't miss
 * cycles that aren't reachable from the detected root.
 *
 * @param {string[]} component
 * @param {Record<string, string[]>} adj
 * @returns {boolean}
 */
const _hasCycleInComponent = (component, adj) => {
    const visited  = new Set();
    const recStack = new Set();

    const dfs = (node) => {
        visited.add(node);
        recStack.add(node);
        for (const nb of (adj[node] ?? [])) {
            if (!visited.has(nb)) {
                if (dfs(nb)) return true;
            } else if (recStack.has(nb)) {
                return true;
            }
        }
        recStack.delete(node);
        return false;
    };

    for (const node of component) {
        if (!visited.has(node)) {
            if (dfs(node)) return true;
        }
    }
    return false;
};

/**
 * Recursively build a nested JSON tree from the adjacency list.
 * Children are sorted lexicographically for deterministic output.
 *
 * @param {string} node
 * @param {Record<string, string[]>} adj
 * @param {Set<string>} [seen] - guard against infinite recursion in broken input
 * @returns {Record<string, any>}
 */
const _buildTree = (node, adj, seen = new Set()) => {
    if (seen.has(node)) return {}; // safety guard
    seen.add(node);
    const tree = {};
    const children = [...(adj[node] ?? [])].sort();
    for (const child of children) {
        tree[child] = _buildTree(child, adj, new Set(seen));
    }
    return tree;
};

/**
 * Calculate the depth of a nested tree object.
 * Depth = number of nodes on the longest root-to-leaf path.
 * A single leaf returns depth 1.
 *
 * @param {Record<string, any>} tree
 * @returns {number}
 */
const _calcDepth = (tree) => {
    const keys = Object.keys(tree);
    if (keys.length === 0) return 1;
    return 1 + Math.max(...keys.map(k => _calcDepth(tree[k])));
};

module.exports = { processGraph };
