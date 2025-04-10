const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String, required: true
    },

    category: String,
    description: String,
    price: {
        type: Number, required: true
    },
    image: String,
    color: String
})

const Products = mongoose.model('Product', ProductSchema);
module.exports = Products;