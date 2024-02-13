export class ProductManager {
    constructor(path) {
        this.path = path;
        this.load_data();
    }

    load_data() {
        if (fs.existsSync(this.path)) {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
        } else {
            this.products = [];
        }
    }

    save_data() {
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 4));
    }

    addProduct(productData) {
        productData.id = this.products.length + 1;
        this.products.push(productData);
        this.save_data();
    }

    getProducts() {
        return this.products;
    }

    getProductById(productId) {
        return this.products.find(product => product.id === productId);
    }

    updateProduct(productId, updatedData) {
        const productIndex = this.products.findIndex(product => product.id === productId);
        if (productIndex !== -1) {
            this.products[productIndex] = { ...this.products[productIndex], ...updatedData };
            this.save_data();
            return true;
        }
        return false;
    }

    deleteProduct(productId) {
        const initialLength = this.products.length;
        this.products = this.products.filter(product => product.id !== productId);
        if (this.products.length !== initialLength) {
            this.save_data();
            return true;
        }
        return false;
    }
}

// Ejemplo de uso
// Crear una instancia de ProductManager
const manager = new ProductManager("products.json");

// Agregar los productos predeterminados
const productsToAdd = [
    { id: 1, name: 'Naranjas', type: 'Fruta', cantidad: 10 },
    { id: 2, name: 'Peras', type: 'Fruta', cantidad: 15 },
    { id: 3, name: 'Manzanas', type: 'Fruta', cantidad: 20 },
    { id: 4, name: 'Bananas', type: 'Fruta', cantidad: 25 },
    { id: 5, name: 'Televisor', type: 'Electronicos', cantidad: 10 },
    { id: 6, name: 'Parlantes', type: 'Electronicos', cantidad: 15 },
    { id: 7, name: 'Auriculares', type: 'Electronicos', cantidad: 20 },
    { id: 8, name: 'Mouse', type: 'Electronicos', cantidad: 25 }
];

// Agregar cada producto al ProductManager
productsToAdd.forEach(product => {
    manager.addProduct(product);
});

// Obtener todos los productos
console.log("All Products:");
console.log(manager.getProducts());

// Obtener un producto por su ID
const productId = 1;
console.log(`\nProduct with ID ${productId}:`);
console.log(manager.getProductById(productId));

// Actualizar un producto
const updatedData = {
    title: "Modified Product 1",
    price: 15.99
};
manager.updateProduct(productId, updatedData);
console.log("\nProducts after update:");
console.log(manager.getProducts());

// Eliminar un producto
const productIdToDelete = 2;
manager.deleteProduct(productIdToDelete);
console.log("\nProducts after deletion:");
console.log(manager.getProducts());
