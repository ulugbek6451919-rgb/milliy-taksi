const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, "../client")));

// MongoDB
mongoose.connect("SENING_MONGODB_URLING")
.then(() => {
    console.log("MongoDB connected");
})
.catch((err) => {
    console.log("Mongo error:", err);
});

// HOME
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
});

// AUTH
app.get("/auth", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/auth.html"));
});

// DRIVER
app.get("/driver", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/driver.html"));
});

// REGISTER
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

// LOGIN
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
            message: "Xatolik yuz berdi"
        });
    }
});

// SOCKET
io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("newOrder", (order) => {
        console.log("New taxi order:", order);

        io.emit("newOrder", order);
    });

    socket.on("acceptOrder", (data) => {
        io.emit("orderAccepted", {
            price: data.price
        });
    });

    socket.on("rideStarted", () => {
        io.emit("rideStarted");
    });

    socket.on("rideFinished", () => {
        io.emit("rideFinished");
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

// SERVER START
server.listen(PORT, () => {
    console.log(Server running on port ${PORT});
});