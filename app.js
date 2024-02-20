import express from "express";
import {productsRouter} from "./src/ProductsRouter.js";
import cartRouter from "./src/CartRouter.js";

const app = express();
const port = 8080;

// Middleware para parsear el body de las solicitudes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Monta el enrutador de productos en la ruta /api/products
app.use("/api/products", productsRouter);

// Monta el enrutador del carrito en la ruta /api/carts
app.use("/api/carts", cartRouter);


app.listen(port, () => console.log("Servidor corriendo en ", port));