const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      unique: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    mission:       { type: String, default: "" },
    coding: {
      learned: { type: String, default: "" },
      built:   { type: String, default: "" },
    },
    checks: {
      coded:       { type: Boolean, default: false },
      spoke:       { type: Boolean, default: false },
      money:       { type: Boolean, default: false },
      distraction: { type: Boolean, default: false },
    },
    moneyMoves:    { type: String, default: "" },
    communication: { type: String, default: "" },
    timeWasted:    { type: String, default: "" },
    wins:          { type: String, default: "" },
    improvements:  { type: String, default: "" },
    tomorrowFocus: { type: String, default: "" },
    submitted:     { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", LogSchema);
