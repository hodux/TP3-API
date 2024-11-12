import { IProduct } from '../interfaces/product.interface';

export class Product implements IProduct {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public category: string,
        public quantity: number,
        public price: number
    ) {}
}