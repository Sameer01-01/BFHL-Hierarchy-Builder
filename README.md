# BFHL Full Stack Application

A production-ready full-stack application built with Node.js (Express) and Next.js, featuring graph hierarchy construction, cycle detection, and recursive visualization.

## Features
- **Validation**: Strict `X->Y` format validation with uppercase letter checks.
- **Duplicate Handling**: Automatically detects and separates duplicate edges.
- **Hierarchy Construction**: Builds nested JSON trees from flat edge data.
- **Cycle Detection**: Detects recursive loops and marks them in the UI.
- **Multi-parent Logic**: Follows strict "first-parent-wins" rule for node connections.
- **Summary Statistics**: Tracks total trees, total cycles, and identifies the largest tree.
- **Premium UI**: Dark-themed, responsive dashboard with recursive tree viewers and micro-animations.

## Tech Stack
- **Backend**: Node.js, Express, CORS, Dotenv.
- **Frontend**: Next.js 14+, TypeScript, Tailwind CSS.
- **Deployment**: Ready for Vercel (Frontend) and Render/Heroku (Backend).

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
The backend will start at `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will start at `http://localhost:3000`.

---

## API Documentation

### POST `/bfhl`
Processes edge data and returns hierarchies.

**Request Body:**
```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

**Response Format:**
```json
{
  "user_id": "yourname_ddmmyyyy",
  "email_id": "your_email",
  "college_roll_number": "your_roll",
  "hierarchies": [...],
  "invalid_entries": [...],
  "duplicate_edges": [...],
  "summary": {
    "total_trees": 1,
    "total_cycles": 0,
    "largest_tree_root": "A"
  }
}
```

---

## Sample Test Cases

1. **Simple Tree**: `A->B, A->C, B->D`
2. **Cycle**: `A->B, B->C, C->A`
3. **Multi-parent**: `A->C, B->C` (C will stay under A)
4. **Duplicates**: `A->B, A->B, B->C`
5. **Invalid**: `A->BC, 1->2, hello`

---

## Deployment Instructions

### Backend (Render)
1. Create a new Web Service on Render.
2. Connect your GitHub repo.
3. Set Build Command: `cd backend && npm install`
4. Set Start Command: `node app.js`
5. Add Environment Variable: `PORT=10000`

### Frontend (Vercel)
1. Import your repo to Vercel.
2. Set Root Directory to `frontend`.
3. Add Environment Variable: `NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com`
4. Deploy!

---

## Logic Explanation
1. **Validation**: Uses regex/split to ensure `X->Y` format and single uppercase letters.
2. **Graph Building**: Uses an adjacency list. The multi-parent rule is enforced during edge processing by checking if a node already has a parent recorded in a Map.
3. **Connected Components**: Uses BFS/DFS on an undirected version of the graph to find isolated groups of nodes.
4. **Cycle Detection**: Uses a standard DFS with a recursion stack to identify cycles within each component.
5. **Tree Building**: A recursive function converts the adjacency list into a nested JSON structure starting from detected roots.
