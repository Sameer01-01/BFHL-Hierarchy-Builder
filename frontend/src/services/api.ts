const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface BFHLRequest {
    data: string[];
}

export interface Hierarchy {
    root: string;
    tree: any;
    depth?: number;
    has_cycle?: boolean;
}

export interface BFHLResponse {
    user_id: string;
    email_id: string;
    college_roll_number: string;
    hierarchies: Hierarchy[];
    invalid_entries: string[];
    duplicate_edges: string[];
    summary: {
        total_trees: number;
        total_cycles: number;
        largest_tree_root: string;
    };
}

export const postBFHL = async (data: string[]): Promise<BFHLResponse> => {
    const response = await fetch(`${API_URL}/bfhl`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
    }

    return response.json();
};
