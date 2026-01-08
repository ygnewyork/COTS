const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());

// Allow Next dev server(s)
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  })
);

// In-memory data store using your dummy profiles
let profiles = {
  jordan: {
    name: "Jordan",
    creditScore: 682,
    scoreChange: +12,
    scoreRange: "Fair",
    memberSince: "2024",
    initialStats: {
      utilization: 42,
      paymentsOnTime: 47,
      paymentsTotal: 49,
      creditAge: 2.3,
      accountCount: 2,
      inquiries: 1
    },
    history: [
      { month: 'Aug', score: 620 },
      { month: 'Sep', score: 645 },
      { month: 'Oct', score: 658 },
      { month: 'Nov', score: 670 },
      { month: 'Dec', score: 675 },
      { month: 'Jan', score: 682 },
    ]
  },
  casey: {
    name: "Casey",
    creditScore: 785,
    scoreChange: +5,
    scoreRange: "Excellent",
    memberSince: "2021",
    initialStats: {
      utilization: 8,
      paymentsOnTime: 120,
      paymentsTotal: 120, // Perfect history
      creditAge: 5.4,
      accountCount: 8,
      inquiries: 0
    },
    history: [
      { month: 'Aug', score: 760 },
      { month: 'Sep', score: 765 },
      { month: 'Oct', score: 770 },
      { month: 'Nov', score: 775 },
      { month: 'Dec', score: 780 },
      { month: 'Jan', score: 785 },
    ]
  },
  alex: {
    name: "Alex",
    creditScore: 540,
    scoreChange: -15,
    scoreRange: "Needs Work",
    memberSince: "2025",
    initialStats: {
      utilization: 85,
      paymentsOnTime: 12,
      paymentsTotal: 20, // Missed payments
      creditAge: 0.8,
      accountCount: 3,
      inquiries: 4
    },
    history: [
      { month: 'Aug', score: 580 },
      { month: 'Sep', score: 575 },
      { month: 'Oct', score: 560 },
      { month: 'Nov', score: 550 },
      { month: 'Dec', score: 555 },
      { month: 'Jan', score: 540 },
    ]
  }
};

// --- API ROUTES ---

app.get("/health", (_req, res) => res.json({ ok: true }));

// Get all profiles (for picking a user)
app.get("/api/profiles", (req, res) => {
  res.json(profiles);
});

// Get specific user
app.get("/api/profiles/:id", (req, res) => {
  const id = req.params.id;
  if (!profiles[id]) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(profiles[id]);
});

// Update specific user (e.g., when they change their score in the simulator)
app.post("/api/profiles/:id", (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  if (!profiles[id]) {
    return res.status(404).json({ error: "User not found" });
  }

  // Merge updates
  profiles[id] = { ...profiles[id], ...updates };
  
  // Basic logic to sync history if score changed
  if (updates.creditScore) {
      const history = profiles[id].history;
      if (history && history.length > 0) {
          history[history.length - 1].score = updates.creditScore;
          // Recalc change
          if (history.length >= 2) {
             const prev = history[history.length - 2].score;
             profiles[id].scoreChange = updates.creditScore - prev;
          }
      }
  }

  console.log(`Updated user ${id}:`, updates);
  res.json({ success: true, user: profiles[id] });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Storage Server running on http://localhost:${PORT}`));
