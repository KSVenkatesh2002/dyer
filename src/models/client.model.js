import mongoose from 'mongoose';
const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: false
    },
    notes: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        default: true // Only active clients are shown in dropdown
    },
    createdBy: {
        type: String,
        required: true
    },
    lastOrderedAt: {
        type: Date,
        default: Date.now
    },
});
export default mongoose.models.Client || mongoose.model('Client', clientSchema);