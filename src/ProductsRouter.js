import express from "express";
import fs from "fs";

const productsRouter = express.Router();

// Middleware para parsear el body de las solicitudes
productsRouter.use(express.urlencoded({ extended: true }));
productsRouter.use(express.json());

// Ruta raíz GET para listar todos los productos
productsRouter.get("/", (req, res) => {
    // Leer el archivo JSON que contiene la lista actual de productos
    fs.readFile("products.json", "utf8", (err, data) => {
        if (err) {
            console.error("Error al leer el archivo JSON", err);
            return res.status(500).send("Error interno del servidor");
        }

        // Convertir los datos del archivo JSON a un array de productos
        let products = JSON.parse(data);

        // Obtener el valor del query param 'limit'
        const limit = parseInt(req.query.limit);

        // Si se proporciona el query param 'limit', limita el resultado
        if (!isNaN(limit) && limit > 0) {
            products = products.slice(0, limit);
        }

        // Responder con la lista de productos (limitada si se proporcionó 'limit')
        res.json(products);
    });
});

// Ruta raíz POST para agregar un nuevo producto
productsRouter.post("/", (req, res) => {
    // Obtener los datos del cuerpo de la solicitud
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    // Verificar si todos los campos obligatorios están presentes
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    // Leer el archivo JSON que contiene la lista actual de productos
    fs.readFile("products.json", "utf8", (err, data) => {
        if (err) {
            console.error("Error al leer el archivo JSON", err);
            return res.status(500).send("Error interno del servidor");
        }

        // Convertir los datos del archivo JSON a un array de productos
        const products = JSON.parse(data);

        // Generar un nuevo ID para el producto que se va a agregar
        const newId = generateNewId(products);

        // Crear el nuevo producto con los datos proporcionados
        const newProduct = {
            id: newId,
            title,
            description,
            code,
            price: parseFloat(price), // Convertir a número
            status: true, // Por defecto es true
            stock: parseInt(stock), // Convertir a número
            category,
            thumbnails: thumbnails || [] // Si no se proporciona thumbnails, se inicializa como un array vacío
        };

        // Agregar el nuevo producto al array de productos
        products.push(newProduct);

        // Escribir los datos actualizados en el archivo JSON
        fs.writeFile("products.json", JSON.stringify(products, null, 2), (err) => {
            if (err) {
                console.error("Error al escribir en el archivo JSON", err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(201).json({ message: "Producto agregado correctamente", product: newProduct });
        });
    });
});

// Ruta para traer un producto por su ID
productsRouter.get("/:pid", (req, res) => {
    const productId = req.params.pid; // Obtener el product id de req.params

    fs.readFile("products.json", "utf8", (err, data) => {
        if (err) {
            console.error("Error al leer el archivo JSON", err);
            res.status(500).send("Error interno del servidor");
            return;
        }
        
        const products = JSON.parse(data);
        const product = products.find(product => product.id == productId); // Buscar el producto por su id

        if (!product) {
            res.status(404).send("Producto no encontrado");
        } else {
            res.json(product);
        }
    });
});


// Ruta para actualizar un producto por su ID
productsRouter.put("/:pid", (req, res) => {
    const productId = req.params.pid; // Obtener el ID del producto de req.params
    const updatedFields = req.body; // Obtener los campos actualizados del cuerpo de la solicitud

    fs.readFile("products.json", "utf8", (err, data) => {
        if (err) {
            console.error("Error al leer el archivo JSON", err);
            return res.status(500).send("Error interno del servidor");
        }
        
        let products = JSON.parse(data);
        const productIndex = products.findIndex(product => product.id == productId); // Buscar el índice del producto por su id

        if (productIndex === -1) {
            return res.status(404).send("Producto no encontrado");
        }

        // Actualizar el producto con los campos proporcionados
        products[productIndex] = { ...products[productIndex], ...updatedFields };

        // Escribir los datos actualizados en el archivo JSON
        fs.writeFile("products.json", JSON.stringify(products, null, 2), (err) => {
            if (err) {
                console.error("Error al escribir en el archivo JSON", err);
                return res.status(500).send("Error interno del servidor");
            }
            res.json({ message: "Producto actualizado correctamente", product: products[productIndex] });
        });
    });
});

// Ruta para eliminar un producto por su ID
productsRouter.delete("/:pid", (req, res) => {
    const productId = req.params.pid; // Obtener el ID del producto de req.params

    fs.readFile("products.json", "utf8", (err, data) => {
        if (err) {
            console.error("Error al leer el archivo JSON", err);
            return res.status(500).send("Error interno del servidor");
        }
        
        let products = JSON.parse(data);
        const productIndex = products.findIndex(product => product.id == productId); // Buscar el índice del producto por su id

        if (productIndex === -1) {
            return res.status(404).send("Producto no encontrado");
        }

        // Eliminar el producto del array de productos
        products.splice(productIndex, 1);

        // Escribir los datos actualizados en el archivo JSON
        fs.writeFile("products.json", JSON.stringify(products, null, 2), (err) => {
            if (err) {
                console.error("Error al escribir en el archivo JSON", err);
                return res.status(500).send("Error interno del servidor");
            }
            res.json({ message: "Producto eliminado correctamente" });
        });
    });
});



// Ruta para filtrar productos por categoría
productsRouter.get("/categoria/:category", (req, res) => {
    const type = req.params.category.toUpperCase(); // Obtener el tipo de categoría y convertirlo a mayúsculas

    fs.readFile("products.json", "utf8", (err, data) => {
        if (err) {
            console.error("Error al leer el archivo JSON", err);
            res.status(500).send("Error interno del servidor");
            return;
        }
        
        const products = JSON.parse(data);
        const filteredProducts = products.filter(product => product.category.toUpperCase() === type);

        if (filteredProducts.length === 0) {
            res.send("No se encontraron productos para esta categoría.");
        } else {
            res.json(filteredProducts);
        }
    });
});


// Función para generar un nuevo ID para el producto
function generateNewId(products) {
    // Encontrar el ID máximo actual
    const maxId = products.reduce((max, product) => (product.id > max ? product.id : max), 0);
    // Generar un nuevo ID sumando 1 al máximo actual
    return maxId + 1;
}
export { productsRouter };
// Exportar el enrutador para ser utilizado en la aplicación principal
