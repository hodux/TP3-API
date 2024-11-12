import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/roles.middleware';

const router = Router();

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Récupérer une liste de produits
 *     description: Récupérer tous les produits
 *     parameters:
 *       - name: minPrice
 *         in: query
 *         description: Le prix minimum des produits
 *         required: false
 *         schema:
 *           type: number
 *       - name: maxPrice
 *         in: query
 *         description: Le prix maximum des produits
 *         required: false
 *         schema:
 *           type: number
 *       - name: minStock
 *         in: query
 *         description: La quantité minimum des produits
 *         required: false
 *         schema:
 *           type: number
 *       - name: maxStock
 *         in: query
 *         description: Le quantité maximum des produits
 *         required: false
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Une liste de produits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Requête invalide
 *     tags:
 *       - Produits
 */
router.get('/products', ProductController.getProducts);

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Ajouter un nouveau produit
 *     description: Ajouter un nouveau produit, regex inclu pour vérifier le nom, quantité et prix
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Le nom du produit
 *                 example: "Chandail en Or"
 *               description:
 *                 type: string
 *                 description: La description du produit
 *                 example: "Chandail de Luxe en Or"
 *               category:
 *                 type: string
 *                 description: La catégorie du produit
 *                 example: "Linge"
 *               price:
 *                 type: string
 *                 description: Le prix du produit
 *                 example: "59.99"
 *               quantity:
 *                 type: string
 *                 description: La quantité du produit
 *                 example: "2"
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Produit ajouté avec succès
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Accès non autorisé
 *       403:
 *         description: Accès refusé
 *     tags:
 *       - Produits
 */
router.post('/products', verifyToken, roleMiddleware(["gestionnaire"]), ProductController.addProduct);

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     summary: Modifier un produit existant
 *     description: Modifier les détails d'un produit existant par son identifiant, regex inclu pour vérifier le nom, quantité et prix
 *     parameters:
 *       - name: id
 *         in: path
 *         description: L'identifiant du produit à modifier
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Le nom du produit
 *                 example: "Chandail en Or"
 *               description:
 *                 type: string
 *                 description: La description du produit
 *                 example: "Chandail de Luxe en Or"
 *               category:
 *                 type: string
 *                 description: La catégorie du produit
 *                 example: "Linge"
 *               price:
 *                 type: string
 *                 description: Le prix du produit
 *                 example: "59.99"
 *               quantity:
 *                 type: string
 *                 description: La quantité du produit
 *                 example: "2"
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Produit modifié avec succès
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Accès non autorisé
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Produit non trouvé
 *     tags:
 *       - Produits
 */
router.put('/products/:id', verifyToken, roleMiddleware(["gestionnaire"]), ProductController.modifyProductById);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Supprimer un produit existant
 *     description: Supprimer un produit par son identifiant
 *     parameters:
 *       - name: id
 *         in: path
 *         description: L'identifiant du produit à supprimer
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Produit supprimer avec succès
 *       401:
 *         description: Accès non autorisé
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Produit non trouvé
 *     tags:
 *       - Produits
 */
router.delete('/products/:id', verifyToken, roleMiddleware(["gestionnaire"]), ProductController.deleteProductById);

export default router;
