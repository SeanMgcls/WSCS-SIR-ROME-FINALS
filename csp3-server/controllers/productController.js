const Product = require("../models/Product");

module.exports.getAll = (req, res) => {
    return Product.find()
        .then(products => res.status(200).send(products))
        .catch(err => res.status(500).send({ error: "Error in Find", details: err }));
};

module.exports.getAllActive = (req, res) => {
    return Product.find({ isActive: true })
        .then(products => res.status(200).send(products))
        .catch(err => res.status(500).send({ error: "Error in Find", details: err }));
};

// Controller function to get all archived products
module.exports.getAllArchived = (req, res) => {
    return Product.find({ isActive: false })
        .then(products => {
            if (products.length > 0) {
                return res.status(200).send(products);
            } else {
                return res.status(404).send({ message: "No archived products found." });
            }
        })
        .catch(err => {
            console.error("Error fetching archived products:", err);
            return res.status(500).send({ error: "Error fetching archived products.", details: err });
        });
};

module.exports.addProduct = (req, res) => {
    let newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: req.body.image // Assuming image is also part of the request body
    });

    return newProduct.save()
        .then(product => res.status(201).send(product))
        .catch(err => res.status(500).send({ error: "Error in Save", details: err }));
};

module.exports.getProduct = (req, res) => {
    return Product.findById(req.params.productId)
        .then(product => res.status(200).send(product))
        .catch(err => res.status(500).send({ error: "Error in Find", details: err }));
};

module.exports.updateProduct = (req, res) => {
    let updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    };

    return Product.findByIdAndUpdate(req.params.productId, updatedProduct, { new: true })
        .then(product => {
            if (!product) {
                return res.status(404).send({ message: 'Product not found.' });
            }
            return res.status(200).send({
                message: 'Product updated successfully',
                updatedProduct: product
            });
        })
        .catch(err => res.status(500).send({ error: "Error in Saving", details: err }));
};

module.exports.archiveProduct = (req, res) => {
    let updateActiveField = {
        isActive: false
    };

    return Product.findByIdAndUpdate(req.params.productId, updateActiveField, { new: true })
        .then(archiveProduct => {
            if (!archiveProduct) {
                return res.status(404).send({ message: 'Product not found.' });
            }
            return res.status(200).send({
                message: 'Product archived successfully',
                archiveProduct: archiveProduct
            });
        })
        .catch(err => res.status(500).send({ error: "Error in Saving", details: err }));
};

// This function already serves as your "unarchive" functionality
module.exports.activateProduct = (req, res) => {
    let updateActiveField = {
        isActive: true
    };

    return Product.findByIdAndUpdate(req.params.productId, updateActiveField, { new: true })
        .then(activateProduct => {
            if (!activateProduct) {
                return res.status(404).send({ message: 'Product not found.' });
            }
            return res.status(200).send({
                message: 'Product activated successfully',
                activateProduct: activateProduct
            });
        })
        .catch(err => res.status(500).send({ error: "Error in Saving", details: err }));
};

module.exports.searchByProductName = (req, res) => {
    const searchName = req.body.name;
    const regex = new RegExp(searchName, 'i');

    Product.find({ name: regex })
        .then(products => res.status(200).send(products))
        .catch(err => res.status(500).send({ error: 'Error in Find', details: err }));
};

module.exports.searchByProductPrice = (req, res) => {
    return Product.find({
        price: {
            $gte: req.body.minPrice,
            $lte: req.body.maxPrice,
        }
    })
        .then(products => res.status(200).send(products))
        .catch(err => res.status(500).send({ error: "Error in Find", details: err }));
};

module.exports.searchProducts = (req, res) => {
    const { name = "", minPrice = 0, maxPrice = 100000 } = req.body;
    let filter = {
        isActive: true,
        price: { $gte: minPrice, $lte: maxPrice }
    };
    if (name && name.trim() !== "") {
        filter.name = { $regex: name, $options: "i" };
    }
    Product.find(filter)
        .then(products => res.status(200).send(products))
        .catch(err => res.status(500).send({ error: "Error in Find", details: err }));
};

// Changed from getUserById to getProductById and fixed the model reference
module.exports.getProductById = (req, res) => {
    return Product.findById(req.params.productId)
        .then(product => {
            if (product) {
                return res.status(200).send(product);
            } else {
                return res.status(404).send({ message: "Product not found." });
            }
        })
        .catch(err => res.status(500).send({ error: "Error in Find", details: err }));
};

module.exports.deleteProduct = (req, res) => {
    return Product.findByIdAndDelete(req.params.productId)
        .then(deletedProduct => {
            if (!deletedProduct) {
                return res.status(404).send({ message: 'Product not found.' });
            }
            return res.status(200).send({
                message: 'Product deleted successfully',
                deletedProduct: deletedProduct
            });
        })
        .catch(err => res.status(500).send({ error: "Error in Delete", details: err }));
};