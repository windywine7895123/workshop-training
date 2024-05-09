const express = require('express');
const router = express.Router();
const Product = require('../models/productSchema');
const Order = require('../models/orderSchema');

// GET all Product
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate('orders');
        res.status(200).json({
            status:200,
            message:"success",
            data:{products}
        })
        console.log('All Product:');
    } catch (error) {
        res.status(500).json({ 
            status:200,
            message: error.message });
    }
});

// GET one Product by ID
router.get('/:id', getProduct, (req, res) => {
    product = res.product
    res.status(200).json({ 
        status:200,
        message:"success",
        data:{product}
    })
});

// CREATE a new Product
router.post('/', async (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock,
        order: []
    });

    try {
        const newProduct = await product.save();
        res.status(201).json({
            status:201,
            message:"success",
            data:{newProduct}
        });
    } catch (error) {
        res.status(400).json({ 
            status:400,
            message: error.message });
    }
});

// DELETE a Pokemon by ID
router.delete('/:id', getProduct, async (req, res) => {
    const id = req.params.id
    
    try {
        await Product.deleteOne({ _id: id });
        res.json({
            status:200,
            message:"success to delete product",
            data:{id:`${id}`}
        });
    } catch (error) {
        res.status(500).json({ 
            status:500,
            message: error.message });
    }
});

// EDIT/UPDATE a Product by ID
router.put('/:id', async (req, res) => {
    const { name, price, stock } = req.body; //require name,price,stock to edit
    const id = req.params.id;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ 
                status:404,
                message: 'Product not found' });
        }
        if (name !== undefined) {
            product.name = name;
        }
        if (price !== undefined) {
            product.price = price;
        }if (name !== undefined) {
            product.stock = stock;
        }
        const updatedProduct = await product.save();
        res.json({
            status:201,
            message:"Edit product successfully",
            data:{updatedProduct}
        });
    } catch (error) {
        console.error('Error updating Product:', error);
        res.status(500).json({ 
            status:500,
            message: 'Failed to update Product' });
    }
});

// Create a new Order
router.post('/:id/orders', async (req, res) => {
    const order = new Order({
        productId: req.params.id,
        amount: req.body.amount,
        orderedBy: req.body.orderedBy,
    });
     try {
            const newOrder = order;
            await updateProductStock(newOrder.productId,newOrder.amount);
            const savedOrder = await newOrder.save();
            await Product.updateMany(
                { _id: { $in: savedOrder.productId } },
                { $push: { orders: savedOrder._id } }
            );
            res.status(201).json({ 
                status: 201,
                message: 'Order created successfully', 
                data: { order: savedOrder } });
    } catch (error) {
        res.status(400).json({ 
            status: 400, 
            message: error.message });
        }    
});

// GET all orders for a specific Product by productId
router.get('/:id/orders', async (req, res) => {
    const id = req.params.id;

    try {
        // Find all orders where the productId appears in the products array
        const orders = await Order.find({ productId: id });

        res.status(200).json({
            status: 200,
            message: 'Orders retrieved successfully for the product',
            data: { orders }
        });
    } catch (error) {
        res.status(500).json({ 
            status: 500, 
            message: error.message });
    }
});

// Helper function to update product stock based on the order
async function updateProductStock(productId,amount) {

    try {
      // Find the product by ID
      const product = await Product.findById(productId);

      // If product exists, update the stock
      if (product) {
        // Check if sufficient stock is available
        if (product.stock >= amount) {
          // Decrease the stock by the ordered quantity
          product.stock -= amount;
          // Save the updated product
          await product.save();
        } else {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }
      } else {
        throw new Error(`Product not found with ID: ${productId}`);
      }
    } catch (error) {
      throw new Error(`Failed to update stock: ${error.message}`);
    }
  
}


// function to fetch single Product by ID
async function getProduct(req, res, next) {
    try {
        const product = await Product.findById(req.params.id);
        if (product == null) {
            return res.status(404).json({ 
                status:404,
                message: 'Product not found' });
        }
        res.product = product;
        next();
    } catch (error) {
        return res.status(500).json({ 
            status:500,
            message: error.message });
    }
}

module.exports = router;
