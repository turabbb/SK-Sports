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
    image: [String],
    rating: {
        type: Number, default: 0
    },
    color: String
})

const Products = mongoose.model('Product', ProductSchema);
module.exports = Products;