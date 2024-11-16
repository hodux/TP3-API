import {IProduct} from "../../interfaces/v2/product.interface";
import {Product} from "../../models/v2/product.model.ts";
import mongoose from "mongoose";

export class ProductService {

    public static async getAllProducts(): Promise<IProduct[]> {
        try {
            return Product.find();
        } catch (error) {
            throw error;
        }
    }

    public static async addProduct(newProduct: IProduct): Promise<void> {
        try {

            const product = new Product({
                name: newProduct.name,
                description: newProduct.description,
                category: newProduct.category,
                price: newProduct.price,
                quantity: newProduct.quantity
            });

            console.log("Mongoose connection:", mongoose.connection.readyState);

            await product.save();

        } catch (error) {
            throw error;
        }

    }

    public static async modifyProductFromId(requestedId : any, newProduct: IProduct): Promise<void> {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(
                requestedId,
                {
                    $set: {
                        name: newProduct.name,
                        description: newProduct.description,
                        category: newProduct.category,
                        quantity: newProduct.quantity,
                        price: newProduct.price,
                    },
                },
                { new: true }
            );

        } catch (error) {
            throw error;
        }

    }

    public static async deleteProductFromId(requestedId : any): Promise<void> {
        try {
            const deletedProduct = await Product.findByIdAndDelete(requestedId);
        } catch (error) {
            throw error;
        }
    }
    
}
