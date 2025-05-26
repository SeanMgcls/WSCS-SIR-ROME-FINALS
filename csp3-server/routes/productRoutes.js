const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { verify, verifyAdmin } = require("../auth"); // Correctly destructuring verify and verifyAdmin

// Route to get all products (admin only)
router.get("/all", verify, verifyAdmin, productController.getAll);

// Route to get all active products (publicly accessible, or if you want, add verify for logged-in users)
router.get("/active", productController.getAllActive);

// NEW: Route to get all archived products (admin only)
router.get("/archived", verify, verifyAdmin, productController.getAllArchived);

// Route to add a new product (admin only)
router.post("/", verify, verifyAdmin, productController.addProduct);

// Routes for searching products
router.post("/searchByName", productController.searchByProductName);
router.post("/searchByPrice", productController.searchByProductPrice);

// Route to get a single product by ID (publicly accessible, or add verify for logged-in users)
router.get("/:productId", productController.getProduct);

router.post('/search', productController.searchProducts);

router.get('/products/:productId', productController.getProduct);

// Route to update a product (admin only)
router.patch("/:productId", verify, verifyAdmin, productController.updateProduct);

// Route to archive a product (admin only)
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

// Route to activate (unarchive) a product (admin only)
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

router.delete('/:productId', verify, verifyAdmin, productController.deleteProduct);

module.exports = router;