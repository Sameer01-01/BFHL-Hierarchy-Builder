/**
 * @fileoverview Validation utilities for BFHL edge data.
 * An edge is valid if and only if it matches the pattern X->Y
 * where X and Y are exactly one uppercase ASCII letter (A-Z)
 * and X !== Y.
 */

/** Regex: exactly "A" through "Z", arrow, exactly "A" through "Z" */
const EDGE_REGEX = /^[A-Z]->[A-Z]$/;

/**
 * Validates a single edge string after trimming whitespace.
 *
 * Valid:   "A->B", "Z->A"
 * Invalid: "A->A", "AB->C", "a->b", "1->2", "A-B", "A->", "", "A->BC"
 *
 * @param {string} entry - Raw input string (will be trimmed internally)
 * @returns {{ valid: boolean, trimmed: string, reason?: string }}
 */
const validateEdge = (entry) => {
    if (typeof entry !== 'string') {
        return { valid: false, trimmed: String(entry), reason: 'not a string' };
    }

    const trimmed = entry.trim();

    if (!trimmed) {
        return { valid: false, trimmed, reason: 'empty string' };
    }

    if (!EDGE_REGEX.test(trimmed)) {
        return { valid: false, trimmed, reason: 'does not match X->Y pattern' };
    }

    const [x, y] = trimmed.split('->');
    if (x === y) {
        return { valid: false, trimmed, reason: 'self-loop (X->X)' };
    }

    return { valid: true, trimmed };
};

module.exports = { validateEdge };
