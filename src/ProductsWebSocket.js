// productsWebSocket.js

import { Server } from "socket.io";
import fs from "fs";

const io = new Server();

io.on("connection", (socket) => {
  console.log("Un cliente se ha conectado a ProductsRouter");
});

function sendProductListViaSocket(products) {
  io.emit("productList", products);
}

export { io, sendProductListViaSocket };
