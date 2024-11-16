import {IProduct} from "../../interfaces/v2/product.interface";
import {Product} from "../../models/v2/product.model.ts";

export class ProductService {

    public static async getAllProducts(): Promise<IProduct[]> {
        const data = await Product.find()
        return data;
    }

    public static async addProduct(newProduct: IProduct): Promise<void> {

        try {
            // Ajout automatique de id
            // newProduct.id = 1;

            console.log("product to add : ", typeof(newProduct.name));

            const product = new Product({
                name: newProduct.name,
                description: newProduct.description,
                category: newProduct.category,
                price: newProduct.price,
                quantity: newProduct.quantity
            });

            await product.save();

        } catch (error) {
            throw new Error();
        }

    }

    public static async modifyProductFromId(requestedId : any, newProduct: IProduct): Promise<void> {
        // const data = await fs.readFile("json/products.json", "utf-8");
        // const result = JSON.parse(data);
        //
        // try {
        //     const product = result.find((b : any) => b.id === parseInt(requestedId));
        //
        //     product.name = newProduct.name || product.name;
        //     product.description = newProduct.description || product.description;
        //     product.category = newProduct.category || product.category
        //     product.quantity = newProduct.quantity || product.quantity
        //     product.price = newProduct.price || product.price
        //
        //     await fs.writeFile("json/products.json", JSON.stringify(result, null, 2));
        // } catch (error) {
        //     throw new Error();
        // }

    }

    public static async deleteProductFromId(requestedId : any): Promise<void> {
        // const data = await fs.readFile("json/products.json", "utf-8");
        // const result = JSON.parse(data);
        //
        // const productIndex = result.findIndex((b: any) => b.id === parseInt(requestedId));
        //
        // if (productIndex !== -1) {
        //     result.splice(productIndex, 1);
        //     await fs.writeFile("json/products.json", JSON.stringify(result, null, 2));
        // } else {
        //     throw new Error();
        // }
    }
    
}
