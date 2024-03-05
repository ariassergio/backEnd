import fs from 'fs';
import { sendProductListViaSocket } from './ProductsWebSocket';

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

        // Enviar la lista de productos actualizada a través de WebSockets
        sendProductListViaSocket(this.products);
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

            // Enviar la lista de productos actualizada a través de WebSockets
            sendProductListViaSocket(this.products);
            return true;
        }
        return false;
    }
}

