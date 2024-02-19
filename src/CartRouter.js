// cartRouter.js
import express from "express";

const cartRouter = express.Router();

// Ruta para el carrito
cartRouter.get("/", (req, res) => {
    // Tu lógica para el carrito
    res.json("Aca esta el carrito");
});

export default cartRouter;
