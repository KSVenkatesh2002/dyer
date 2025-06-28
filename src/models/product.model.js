// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    sariSection: {
        type: String,
        enum: ['body', 'pallu'],
        required: true
    },

    // measurements
    nailsCount: {
        type: Number,
    },
    conesUsed: {
        type: Number,
    },
    kolukkulu: {
        type: Number,
    },
    varasalu: {
        type: Number,
    },
    repeat: {
        type: Number,
    },
    sareesCount: {
        type: Number,
    },

    // design info
    designName: {
        type: String
    },
    repeatType: {
        type: String,
        enum: ['Airplane', 'Raan Boone'],
    },
    borderInches: {
        type: Number,
    },

    // work assignment status
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
