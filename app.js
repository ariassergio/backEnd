import express from "express";
import exphbs  from "express-handlebars";
import handlebars from "express-handlebars";
import {engine} from "express-handlebars"; // Importa la función engine
import http from "http"; // Importa el módulo http de Node.js
import { Server } from "socket.io"; // Importa el servidor de Socket.IO
import { productsRouter } from "./src/ProductsRouter.js";
import cartRouter from "./src/CartRouter.js";
import fs from "fs";

const app = express();
const port = 8080;


app.set('view engine', 'handlebars');
// Middleware para parsear el body de las solicitudes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurar Handlebars como motor de plantillas
app.engine('handlebars', handlebars.engine());


// Monta el enrutador de productos en la ruta /api/products
app.use("/api/products", productsRouter);

// Monta el enrutador del carrito en la ruta /api/carts
app.use("/api/carts", cartRouter);

// Crear un servidor HTTP utilizando Express
const server = http.createServer(app);

// Crear un servidor de Socket.IO y adjuntarlo al servidor HTTP
const io = new Server(server);

// Manejar conexiones de clientes Socket.IO
io.on("connection", (socket) => {
    console.log("Un cliente se ha conectado");
    // Aquí puedes manejar la lógica de Socket.IO
    // Por ejemplo, recibir y procesar eventos
    socket.on("addProduct", (productData) => {
       
        console.log("Nuevo producto recibido:", productData);
        // Emitir un evento para actualizar la lista de productos en tiempo real
        io.emit("productAdded", productData);
    });
});

// Ruta para renderizar la vista "home.handlebars"
app.get("/", (req, res) => {
    // Implementa la lógica para obtener la lista de productos
    const products = obtenerProductos(); // Por ejemplo, leerla desde un archivo JSON
    res.render("home", { products });
});

// Función para obtener los productos desde un archivo JSON 
function obtenerProductos() {
    const data = fs.readFileSync("products.json", "utf8");
    return JSON.parse(data);
}

// Iniciar el servidor HTTP
server.listen(port, () => console.log("Servidor corriendo en ", port));
