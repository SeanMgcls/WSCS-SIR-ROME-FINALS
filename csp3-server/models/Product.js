//[Section] Activity
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Course Name is Required']
    },
    description: {
        type: String,
        required: [true, 'Course Description is Required']
    },
    price: {
        type: Number,
        required: [true, 'Course Price is Required']
    },
    image: {
        type: String,
        required: [true, 'Course Image is Required']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);
