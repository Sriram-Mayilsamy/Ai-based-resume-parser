const express = require("express");
const fs = require("fs");
const cors = require("cors"); // Add this line

const app = express();
const PORT = 5000;
const DB_FILE = "db.json";

// Enable CORS for all origins
app.use(cors());

app.use(express.json());

const readDB = () => {
    try {
        const data = fs.readFileSync(DB_FILE, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading database:", err);
        return [];
    }
};

app.get("/candidates", (req, res) => {
    const { expected_role, min_relevancy, order } = req.query;
    let candidates = readDB();

    candidates = candidates.map(c => ({ ...c, relevancy_score: Number(c.relevancy_score) }));

    if (expected_role) {
        candidates = candidates.filter(c => c.expected_role.toLowerCase() === expected_role.toLowerCase());
    }

    if (min_relevancy) {
        candidates = candidates.filter(c => c.relevancy_score >= Number(min_relevancy));
    }

    candidates.sort((a, b) => {
        if (a.expected_role.toLowerCase() < b.expected_role.toLowerCase()) return -1;
        if (a.expected_role.toLowerCase() > b.expected_role.toLowerCase()) return 1;
        
        return order === "asc" ? a.relevancy_score - b.relevancy_score : b.relevancy_score - a.relevancy_score;
    });

    res.json({ candidates });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
