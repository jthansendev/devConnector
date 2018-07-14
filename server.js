const express = require("express");
const mongoose = require("mongoose");

const auth = require("./routes/api/auth.js");
const posts = require("./routes/api/posts.js");
const profile = require("./routes/api/profile.js");

// Initialize App
const app = express();

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, {
      useNewUrlParser: true
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch(err => console.log(err));

// Index Route
app.get("/", (req, res) => {
  res.send("Hello");
});

// Use Routes
app.use("/api/auth", auth);
app.use("/api/posts", posts);
app.use("/api/profile", profile);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
