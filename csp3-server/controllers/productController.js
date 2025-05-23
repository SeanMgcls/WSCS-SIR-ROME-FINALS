const Product = require("../models/Product");

module.exports.getAll = (req,res) => {
    return Product.find()
    .then(products => res.status(200).send( products ))
    .catch(err => res.status(500).send({ error: "Error in Find", details: err}))
}

module.exports.getAllActive = (req,res) => {
    return Product.find({isActive : true})
    .then(products => res.status(200).send( products ))
    .catch(err => res.status(500).send({ error: "Error in Find", details: err}))
}

// Controller function to get all archived products
module.exports.getAllArchived = (req, res) => {
    return Product.find({ isActive: false }) // Find products where isActive is false
        .then(products => {
            if (products.length > 0) {
                return res.status(200).send(products);
            } else {
                return res.status(404).send({ message: "No archived products found." });
            }
        })
        .catch(err => {
            console.error("Error fetching archived products:", err); // More specific error logging
            return res.status(500).send({ error: "Error fetching archived products.", details: err });
        });
};


module.exports.addProduct = (req,res) => {
    let newProduct = new Product({
        name : req.body.name,
        description : req.body.description,
        price : req.body.price
    });

    return newProduct.save()
    .then((product) => res.status(201).send( product ))
    .catch(err => res.status(500).send({ error: "Error in Save", details: err}))
}

module.exports.getProduct = (req,res) => {
    return Product.findById(req.params.productId)
    .then(product  => res.status(200).send( product ))
    .catch(err => res.status(500).send({ error: "Error in Find", details: err}))
}

module.exports.updateProduct = (req, res) => {
    let updatedProduct = {
        name : req.body.name,
        description : req.body.description,
        price : req.body.price
    }

    return Product.findByIdAndUpdate(req.params.productId, updatedProduct, { new: true }) // Added { new: true } to return the updated document
    .then((product) => {
        if (!product) { // Handle case where product might not be found
            return res.status(404).send({ message: 'Product not found.' });
        }
        return res.status(200).send({ // Added return here for consistency
            message: 'Product updated successfully',
            updatedProduct: product
        });
    })
    .catch(err => res.status(500).send({ error: "Error in Saving", details: err}))
}

module.exports.archiveProduct = (req, res) => {
    let updateActiveField = {
        isActive : false
    }

    return Product.findByIdAndUpdate(req.params.productId, updateActiveField, { new: true })
    .then((archiveProduct) => {
        if (!archiveProduct) {
            return res.status(404).send({ message: 'Product not found.' });
        }
        return res.status(200).send({ // Added return here for consistency
            message: 'Product archived successfully',
            archiveProduct: archiveProduct
        });
    })
    .catch(err => res.status(500).send({ error: "Error in Saving", details: err}))
}

// This function already serves as your "unarchive" functionality
module.exports.activateProduct = (req, res) => {
    let updateActiveField = {
        isActive : true
    }

    return Product.findByIdAndUpdate(req.params.productId, updateActiveField, { new: true })
    .then((activateProduct) => {
        if (!activateProduct) {
            return res.status(404).send({ message: 'Product not found.' });
        }
        return res.status(200).send({ // Added return here for consistency
            message: 'Product activated successfully',
            activateProduct: activateProduct
        });
    })
    .catch(err => res.status(500).send({ error: "Error in Saving", details: err}))
}

module.exports.searchByProductName = (req, res) => {
    const searchName = req.body.name;

    // Use a case-insensitive regex for searching
    const regex = new RegExp(searchName, 'i');

    Product.find({ name: regex })
        .then((products) => res.status(200).send(products))
        .catch((err) => res.status(500).send({ error: 'Error in Find', details: err }));
};

module.exports.searchByProductPrice = (req,res) => {
    return Product.find({
        price: {
          $gte: req.body.minPrice, // Greater than or equal to minPrice
          $lte: req.body.maxPrice, // Less than or equal to maxPrice
        }
      })
    .then((products)  => res.status(200).send(products)) // Changed from {products} to products for consistency
    .catch(err => res.status(500).send({ error: "Error in Find", details: err}))
}