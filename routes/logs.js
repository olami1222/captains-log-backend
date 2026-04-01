const express = require("express");
const router  = express.Router();
const Log     = require("../models/Log");

function isValidDate(str) {
  return /^\d{4}-\d{2}-\d{2}$/.test(str);
}

function isComplete(log) {
  return (
    log?.checks?.coded &&
    log?.checks?.spoke &&
    log?.checks?.money &&
    log?.checks?.distraction
  );
}

router.get("/", async (req, res) => {
  try {
    const logs = await Log.find({}).sort({ date: -1 }).limit(90);
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch logs" });
  }
});

router.get("/streak", async (req, res) => {
  try {
    let streak = 0;
    const today = new Date();
    for (let i = 1; i <= 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateKey = d.toISOString().split("T")[0];
      const log = await Log.findOne({ date: dateKey });
      if (log && isComplete(log)) streak++;
      else break;
    }
    res.json({ success: true, streak });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to calculate streak" });
  }
});

router.get("/:date", async (req, res) => {
  const { date } = req.params;
  if (!isValidDate(date)) {
    return res.status(400).json({ success: false, message: "Invalid date format. Use YYYY-MM-DD" });
  }
  try {
    const log = await Log.findOne({ date });
    if (!log) return res.status(404).json({ success: false, message: "No log found for this date" });
    res.json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch log" });
  }
});

router.post("/", async (req, res) => {
  const { date, mission, coding, checks, moneyMoves, communication,
          timeWasted, wins, improvements, tomorrowFocus, submitted } = req.body;
  if (!date || !isValidDate(date)) {
    return res.status(400).json({ success: false, message: "A valid date is required" });
  }
  const exists = await Log.findOne({ date });
  if (exists) {
    return res.status(409).json({ success: false, message: "Log exists. Use PUT to update." });
  }
  try {
    const newLog = await Log.create({ date, mission, coding, checks, moneyMoves,
      communication, timeWasted, wins, improvements, tomorrowFocus, submitted });
    res.status(201).json({ success: true, data: newLog });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create log" });
  }
});

router.put("/:date", async (req, res) => {
  const { date } = req.params;
  if (!isValidDate(date)) {
    return res.status(400).json({ success: false, message: "Invalid date format" });
  }
  try {
    const updated = await Log.findOneAndUpdate(
      { date },
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update log" });
  }
});

module.exports = router;
