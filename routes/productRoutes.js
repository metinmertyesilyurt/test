// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Display all products
router.get('/', productController.index);

// Display single product
router.get('/product/:id', productController.show);

// Submit product form
router.post('/product/submit', productController.submitForm);

module.exports = router;
