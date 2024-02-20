import express from "express";

const cartRouter = express.Router();

// Variable para almacenar los carritos
let carts = [];

// Ruta para el carrito
cartRouter.get("/", (req, res) => {
    // Tu lógica para el carrito
    res.json(carts);
});

// Ruta para crear un nuevo carrito
cartRouter.post("/", (req, res) => {
    // Generar un nuevo ID para el carrito
    const newCartId = generateNewId(carts);

    // Crear un nuevo carrito con el ID generado y sin productos
    const newCart = {
        id: newCartId,
        products: []
    };

    // Agregar el nuevo carrito al array de carritos
    carts.push(newCart);

    // Responder con el carrito recién creado
    res.status(201).json(newCart);
});

// Ruta para obtener un carrito por su ID
cartRouter.get("/:cid", (req, res) => {
    const cartId = req.params.cid; // Obtener el ID del carrito de req.params

    // Buscar el carrito por su ID
    const cart = carts.find(cart => cart.id == cartId);

    if (!cart) {
        return res.status(404).send("Carrito no encontrado");
    }

    // Responder con el carrito encontrado
    res.json(cart);
});

// Ruta para agregar un producto al carrito
cartRouter.post("/:cid/product/:pid", (req, res) => {
    const cartId = req.params.cid; // Obtener el ID del carrito de req.params
    const productId = req.params.pid; // Obtener el ID del producto de req.params
    const { quantity } = req.body; // Obtener la cantidad del producto del cuerpo de la solicitud

    // Buscar el carrito por su ID
    const cart = carts.find(cart => cart.id == cartId);

    if (!cart) {
        return res.status(404).send("Carrito no encontrado");
    }

    // Verificar si el producto ya está en el carrito
    const existingProduct = cart.products.find(product => product.id == productId);

    if (existingProduct) {
        // Si el producto ya está en el carrito, incrementar la cantidad
        existingProduct.quantity += quantity || 1;
    } else {
        // Si el producto no está en el carrito, agregarlo al carrito con la cantidad proporcionada
        cart.products.push({ id: productId, quantity: quantity || 1 });
    }

    // Responder con el carrito actualizado
    res.json(cart);
});

// Función para generar un nuevo ID para el carrito
function generateNewId(carts) {
    // Encontrar el ID máximo actual
    const maxId = carts.reduce((max, cart) => (cart.id > max ? cart.id : max), 0);
    // Generar un nuevo ID sumando 1 al máximo actual
    return maxId + 1;
}

export default cartRouter;
