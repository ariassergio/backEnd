import express from "express";

const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: true }));

app.listen(port, () => console.log("Servidor corriendo en ", port));

// Endpoint para obtener todos los productos
app.get("/products", (req, res) => {
    const limit =parseInt(req.query.limit); // Obtener el valor del query param 'limit'

    let result = [...products]; // Copia los productos para no modificar el original

    // Si se proporciona el query param 'limit', limita el resultado
    if (limit) {
        result = result.slice(0, parseInt(limit));
    }

    res.json(result);
});

// Endpoint para obtener un producto por su id
app.get("/products/:pId", (req, res) => {
    let pId = req.params.pId; // Obtener el product id de req.params

    let product = products.find(product => product.id == pId); // Buscar el producto por su id

    if (!product) {
        res.status(404).send("Producto no encontrado");
    } else {
        res.json(product);
    }
});

// Endpoint para filtrar productos por categoría

app.get("/categoria", (req, res) => {
    let type = req.query.type; // Obtener el valor del query param 'type'

    // Verificar si 'type' está definido
    if (type) {
        type = type.toUpperCase(); // Convertir a mayúsculas si 'type' está definido
    } else {
        return res.status(400).send("Debe proporcionar un tipo de categoría válido."); // Si 'type' no está definido, enviar una respuesta de error
    }

    let data = products.filter((product) => product.type.toUpperCase() === type);
    if (data.length === 0) {
        return res.send("No se encontraron productos para esta categoría.");
    }

    res.json(data);
});



let products = [
    { id: 1, name: 'Naranjas', type: 'Fruta', cantidad: 10 },
    { id: 2, name: 'Peras', type: 'Fruta', cantidad: 15 },
    { id: 3, name: 'Manzanas', type: 'Fruta', cantidad: 20 },
    { id: 4, name: 'Bananas', type: 'Fruta', cantidad: 25 },
    { id: 5, name: 'Televisor', type: 'Electronicos', cantidad: 10 },
    { id: 6, name: 'Parlantes', type: 'Electronicos', cantidad: 15 },
    { id: 7, name: 'Auriculares', type: 'Electronicos', cantidad: 20 },
    { id: 8, name: 'Mouse', type: 'Electronicos', cantidad: 25 }
];
