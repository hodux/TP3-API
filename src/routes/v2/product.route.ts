import {Router} from "express";
import {ProductController} from "../../controllers/v2/product.controller.ts";


const router = Router();

router.get("/products", ProductController.getProducts);
router.post("/products", ProductController.addProduct);
router.put("/products/:id", ProductController.modifyProductById);
router.delete("/products/:id", ProductController.deleteProductById);

export default router;