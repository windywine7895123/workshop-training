const express = require('express');
const router = express.Router();
const Order = require('../models/orderSchema');
const Product = require('../models/productSchema'); // Assuming you have a Product model
// Get all orders 
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().populate('productId');
        res.status(200).json({
            status:200,
            message:"success",
            data:{orders}
        })
    } catch (error) {
        res.status(500).json({ 
            status:200,
            message: error.message });
    }
});

// Delete order
router.delete('/:id', async (req, res) => {
    const id = req.params.id

     try{   
            const order = await Order.findById(id)
            if(order){
                const productId = order.productId
                console.log(`productid:${productId}`)
                await returnProductStock(productId,order.amount);
                await Product.updateMany(
                    { _id: { $in: productId } },
                    { $pull: { orders:order._id } }
                );

                await Order.deleteOne({ _id: id })
                res.status(201).json({ 
                    status: 201, 
                    message: 'Order delete successfully', 
                    data: { order } });
            }
    } catch (error) {
        res.status(400).json({ 
            status: 400, 
            message: error.message });
        }    
    
});

// Helper function to update product stock based on the order
async function returnProductStock(productId,amount) {

    try {
      const product = await Product.findById(productId);
      if (product) {
          product.stock += amount;
          await product.save();
      } else {
        throw new Error(`Product not found with ID: ${productId}`);
      }
    } catch (error) {
      throw new Error(`Failed to update stock: ${error.message}`);
    }
  
}

module.exports = router;
