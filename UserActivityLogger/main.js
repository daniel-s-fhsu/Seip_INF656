const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

let logs = [];
let summary = {};

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/log", (req, res) => {
  const { event, timestamp } = req.body;
  logs.push({ event, timestamp });
  console.log("Incoming log:", event, timestamp);
  res.status(200).send("Logged event: " + event);
});

app.get("/logsummary", (req, res) => {
  res.json(summary);
});

// every 2 minutes, process and write logs to log.txt
setInterval(() => {
  if (logs.length > 0) {
    const counts = {};
    logs.forEach(log => {
      counts[log.event] = (counts[log.event] || 0) + 1;
    });
    summary = {
      total: logs.length,
      details: counts,
      batchTime: new Date().toISOString()
    };

    //format the batch
    const logEntry =
      `[${summary.batchTime}] Total: ${summary.total}\n` +
      Object.entries(summary.details)
        .map(([event, count]) => `  ${event}: ${count}`)
        .join("\n") +
      "\n\n";

    // append to file
    fs.appendFile("log.txt", logEntry, err => {
      if (err) console.error("Error writing to log file:", err);
      else console.log("Batch written to log.txt");
    });

    // clear logs for next batch
    logs = [];
  }
}, 120000);

app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
