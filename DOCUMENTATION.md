# Technical Documentation: BFHL Hierarchy Visualizer

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Data Processing Pipeline](#data-processing-pipeline)
3. [API Reference](#api-reference)
4. [Frontend Component Architecture](#frontend-component-architecture)
5. [Algorithms & Logic](#algorithms--logic)

---

## System Architecture
The application follows a standard **Full-Stack Client-Server architecture**:
- **Client**: Next.js 14+ (App Router) with Tailwind CSS for styling.
- **Server**: Node.js with Express, acting as a stateless processing engine.
- **Communication**: RESTful API using JSON payloads.

---

## Data Processing Pipeline
The core value of the project lies in how it transforms raw data. When a list of edges is sent to the backend, it undergoes the following 5-step transformation:

1.  **Validation & Classification**: Each entry is checked against the `X->Y` regex. Invalid entries are collected, and duplicates are flagged.
2.  **Parent-Child Mapping**: The system enforces a **strict single-parent rule**. If node `C` already has a parent `A`, any subsequent edge `B->C` is ignored to maintain a tree structure.
3.  **Component Identification**: Using **BFS on an undirected projection** of the graph, the system identifies isolated clusters of nodes (Weakly Connected Components).
4.  **Hierarchy Analysis**: For each component:
    - A **root node** is identified (node with no parent).
    - **Cycle Detection** is performed using DFS with a recursion stack.
    - If no cycle exists, a **recursive JSON tree** is built.
5.  **Summary Generation**: Final statistics (total trees, total cycles, largest tree) are calculated and bundled with the user identity.

---

## API Reference

### GET `/bfhl`
Returns a health-check status along with the static developer identity.
- **Response**: `200 OK`
- **Body**:
  ```json
  {
    "is_success": true,
    "user_id": "Sameer_26082004",
    "email_id": "sy3253@srmist.edu.in",
    "college_roll_number": "RA2311003010915"
  }
  ```

### POST `/bfhl`
Processes the edge data and returns analyzed hierarchies.
- **Body**: `{ "data": ["A->B", "B->C"] }`
- **Response**: `200 OK`
- **Body**:
  ```json
  {
    "is_success": true,
    "user_id": "...",
    "email_id": "...",
    "college_roll_number": "...",
    "hierarchies": [
      {
        "root": "A",
        "tree": { "B": { "C": {} } },
        "depth": 3,
        "has_cycle": false
      }
    ],
    "invalid_entries": [],
    "duplicate_edges": [],
    "summary": { ... }
  }
  ```

---

## Frontend Component Architecture

### 1. `Home (page.tsx)`
The main orchestrator. It manages the global state (input, API response, loading states) and coordinates between the control panel and the result view.

### 2. `TreeViewer`
A recursive UI component. It takes a node name and its nested children object, rendering them as a collapsible/expandable list. It uses Tailwind's transition utilities for smooth animations.

### 3. `JsonViewer`
Uses a structured approach to render the raw API response, allowing developers to see the underlying data structure returned by the backend.

### 4. `StatCard`
A reusable display component used for showing high-level metrics (Success Ratio, Processing Time, etc.) with dynamic color themes.

---

## Algorithms & Logic

### Cycle Detection (DFS)
We use a standard DFS with a `visited` set and a `recStack` (recursion stack). 
- `visited`: Tracks nodes already processed in the current search.
- `recStack`: Tracks nodes in the *current* recursion path. If we hit a node already in `recStack`, a cycle is confirmed.

### Multi-Parent Resolution
To ensure a valid tree, we use a Map of `child -> first_parent`. 
```javascript
if (nodeParent.has(v)) {
    // child v already has a parent, ignore this edge
    continue;
}
```
This ensures that the visualization never breaks due to multiple incoming edges to a single node.
