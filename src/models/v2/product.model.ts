import mongoose from "mongoose";
import { IProduct } from "../../interfaces/v2/product.interface.ts";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
})

export const Product = mongoose.model<IProduct>('Product', productSchema);