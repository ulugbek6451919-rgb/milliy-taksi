const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../client")));
app.use("/driver", express.static(path.join(__dirname, "../driver")));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let drivers = {};
let orders = {};
let assigned = {};

function calcDistance(a,b){
  const dx = a.lat - b.lat;
  const dy = a.lng - b.lng;
  return Math.sqrt(dx*dx + dy*dy) * 111;
}

function calcPrice(a,b){
  const km = calcDistance(a,b);
  return Math.round(km * 2000);
}

io.on("connection", (socket)=>{

  socket.on("driverLocation", (loc)=>{
    drivers[socket.id] = loc;
  });

  socket.on("newOrder", (order)=>{
    const id = Date.now().toString();

    const newOrder = {
      id,
      ...order,
      price: calcPrice(order.from, order.to),
      status: "pending"
    };

    orders[id] = newOrder;

    let nearest = null;
    let min = Infinity;

    for(let d in drivers){
      let dist = calcDistance(order.from, drivers[d]);
      if(dist < min){
        min = dist;
        nearest = d;
      }
    }

    if(nearest){
      assigned[id] = nearest;
      io.to(nearest).emit("orderCreated", newOrder);
    }
  });

  socket.on("acceptOrder", (orderId)=>{
    orders[orderId].status = "accepted";
    io.emit("orderAccepted", orders[orderId]);
  });

  socket.on("startRide", (orderId)=>{
    orders[orderId].status = "started";
    io.emit("rideStarted", orders[orderId]);
  });

  socket.on("endRide", (orderId)=>{
    orders[orderId].status = "finished";
    io.emit("rideFinished", orders[orderId]);
  });
});

server.listen(3000, ()=>{
  console.log("http://localhost:3000");
});