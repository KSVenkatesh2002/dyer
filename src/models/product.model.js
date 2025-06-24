// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
    },
    sariSection: {
        type: String,
        enum: ['body', 'pallu'],
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    nailsCount: {
        type: Number,
        required: true
    },
    conesUsed: {
        type: Number,
        required: true
    },
    kolukkulu: {
        type: Number,
        required: true
    },
    varasalu: {
        type: Number,
        required: true
    },
    repeat: {
        type: Number,
        required: true
    },
    numberOfSarees: {
        type: Number,
        required: true
    },
    designName: {
        type: String
    },
    windingAssigned: {
        type: Boolean,
        default: false
    },
    markingAssigned: {
        type: Boolean,
        default: false
    },
    chittamAssigned: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

productSchema.index({ 
    createdBy: 1, 
    productId: 1 
}, { unique: true });

export default mongoose.models.Product || mongoose.model('Product', productSchema);
