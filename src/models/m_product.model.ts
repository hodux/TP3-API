import mongoose from 'mongoose'

const product = new mongoose.Schema({
    id: Number,
    name: String,
    description: String,
    category: String,
    quantity: Number,
    price: Number
});