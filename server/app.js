const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// client papkani static qilish
app.use(express.static(path.join(__dirname, "../client")));

// MongoDB connection
mongoose.connect(
  "mongodb://ulugbek6451919_db_user:taxi12345@ac-jtisv72-shard-00-00.uxvy0hx.mongodb.net:27017,ac-jtisv72-shard-00-01.uxvy0hx.mongodb.net:27017,ac-jtisv72-shard-00-02.uxvy0hx.mongodb.net:27017/?ssl=true&replicaSet=atlas-gg5liu-shard-0&authSource=admin&appName=Cluster0"
)
.then(() => {
  console.log("MongoDB connected");
})
.catch((err) => {
  console.log("Mongo error:", err);
});

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// Auth page
app.get("/auth", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/auth.html"));
});

// Register
app.post("/register", async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    console.log("REGISTER:", name, phone, password);

    res.json({
      message: "Ro‘yxatdan o‘tish muvaffaqiyatli!"
    });

  } catch (err) {
    console.log(err);

    res.json({
      message: "Xatolik yuz berdi"
    });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    console.log("LOGIN:", phone, password);

    res.json({
      message: "Login muvaffaqiyatli!"
    });

  } catch (err) {
    console.log(err);

    res.json({
      message: "Login xato"
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});