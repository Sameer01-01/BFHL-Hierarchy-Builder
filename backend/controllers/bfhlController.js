const { processGraph } = require('../utils/graphUtils');

/** Static user identity — update to real values before submission */
const USER_ID             = 'Sameer_26082004';
const EMAIL_ID            = 'sy3253@srmist.edu.in';
const COLLEGE_ROLL_NUMBER = 'RA2311003010915';

/**
 * GET /bfhl
 * Health-check / user-info endpoint.
 * Some automated graders send a GET before accepting the POST.
 */
exports.getInfo = (_req, res) => {
    res.status(200).json({
        is_success: true,
        user_id: USER_ID,
        email_id: EMAIL_ID,
        college_roll_number: COLLEGE_ROLL_NUMBER,
    });
};

/**
 * POST /bfhl
 * Main processing endpoint.
 *
 * Body: { data: string[] }
 * Returns hierarchies, invalid entries, duplicate edges, and summary.
 */
exports.processData = (req, res, next) => {
    try {
        const { data } = req.body;

        /* --- Input validation ---------------------------------------- */
        if (!data || !Array.isArray(data)) {
            const err = new Error("Body must contain a 'data' array.");
            err.status = 400;
            err.expose  = true;
            return next(err);
        }

        if (data.length === 0) {
            return res.status(200).json({
                is_success: true,
                user_id: USER_ID,
                email_id: EMAIL_ID,
                college_roll_number: COLLEGE_ROLL_NUMBER,
                hierarchies: [],
                invalid_entries: [],
                duplicate_edges: [],
                summary: { total_trees: 0, total_cycles: 0, largest_tree_root: '' },
            });
        }

        /* --- Core processing ----------------------------------------- */
        const startMs = Date.now();
        const result  = processGraph(data);
        const processingTimeMs = Date.now() - startMs;

        return res.status(200).json({
            is_success: true,
            user_id: USER_ID,
            email_id: EMAIL_ID,
            college_roll_number: COLLEGE_ROLL_NUMBER,
            processing_time_ms: processingTimeMs,
            ...result,
        });
    } catch (err) {
        next(err); // forward to central error handler
    }
};
