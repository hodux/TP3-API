import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { verifyRegex } from '../utils/regex'
import { logger } from '../utils/logger'

export class ProductController {

    public static async getProducts(req: Request, res: Response) {
        try {
            let products = await ProductService.getAllProducts();

            if (req.query.minPrice) {
                const minPrice = parseFloat(req.query.minPrice as string);
                products = products.filter((product: any) => product.price >= minPrice);
            }
            if (req.query.maxPrice) {
                const maxPrice = parseFloat(req.query.maxPrice as string);
                products = products.filter((product: any) => product.price <= maxPrice);
            }
            if (req.query.minStock) {
                const minStock = parseInt(req.query.minStock as string);
                products = products.filter((product: any) => product.quantity >= minStock);
            }
            if (req.query.maxStock) {
                const maxStock = parseInt(req.query.maxStock as string);
                products = products.filter((product: any) => product.quantity <= maxStock);
            }

            logger.info("GET Produits: Succès")
            res.status(200).json(products); 
        } catch (error) {
            logger.warn("GET Produits: Requête invalide", error)
            return res.status(400).json({ message: "Requête invalide", error})
        }
    }

    public static async addProduct(req: Request, res: Response) {
        try {
            const newProduct = req.body;

            // regex
            const nameRegex : RegExp = /^[A-Za-z\s]{3,50}$/;
            const priceRegex : RegExp = /^\d+(\.\d+)?$/;
            const quantityRegex : RegExp = /^\d+$/;

            if (verifyRegex(newProduct.name, nameRegex)) {
                logger.warn("POST Produits: Requête invalide")
                return res.status(400).send("Le nom des produits doit contenir entre 3 et 50 caractères, uniquement des lettres et des espaces");
            } else if (verifyRegex(newProduct.price, priceRegex)) {
                logger.warn("POST Produits: Requête invalide")
                return res.status(400).send("Le prix doit être un nombre positif");
            } else if (verifyRegex(newProduct.quantity, quantityRegex)) {
                logger.warn("POST Produits: Requête invalide")
                return res.status(400).send("La quantité doit être un entier positif");
            }
            
            await ProductService.addProduct(newProduct); 
            logger.info("POST Produit: Succès")
            res.status(201).json({ message: 'Produit ajouté avec succès' }); 
        } catch (error) {
            logger.warn("POST Produits: Requête invalide", error)
            return res.status(400).json({ message: 'Requête invalide', error });
        }
    }

    public static async modifyProductById(req: Request, res: Response) {
        try {
            const requestedId = req.params.id;
            const newProduct = req.body;

            // regex
            const nameRegex : RegExp = /^[A-Za-z\s]{3,50}$/;
            const priceRegex : RegExp = /^\d+(\.\d+)?$/;
            const quantityRegex : RegExp = /^\d+$/;

            if (verifyRegex(newProduct.name, nameRegex)) {
                logger.warn("PUT Produits: Requête invalide")
                return res.status(400).send("Le nom des produits doit contenir entre 3 et 50 caractères, uniquement des lettres et des espaces");
            } else if (verifyRegex(newProduct.price, priceRegex)) {
                logger.warn("PUT Produits: Requête invalide")
                return res.status(400).send("Le prix doit être un nombre positif");
            } else if (verifyRegex(newProduct.quantity, quantityRegex)) {
                logger.warn("PUT Produits: Requête invalide")
                return res.status(400).send("La quantité doit être un entier positif");
            }

            await ProductService.modifyProductFromId(requestedId, newProduct);
            logger.info("PUT Produit: Succès")
            res.status(200).json({ message: 'Produit modifié avec succès' }); 
        } catch (error : any) {
            logger.warn("PUT Produits: Produit non trouvé", error)
            return res.status(404).json({ message: 'Produit non trouvé', error: error.message });
        }
    }

    public static async deleteProductById(req: Request, res: Response) {
        try {
            const requestedId = req.params.id;
            await ProductService.deleteProductFromId(requestedId);
            logger.info("DELETE Produit: Succès")
            res.status(200).json({ message: 'Produit supprimer avec succès' }); 
        } catch (error) {
            logger.warn("DELETE Produits: Produit non trouvé", error)
            return res.status(404).json({ message: 'Produit non trouvé', error });
        }
    }


}
