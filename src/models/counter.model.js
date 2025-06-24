import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
    key: {
        type: String, // e.g., `mani-pallu`, `mani-body`
        required: true, 
    },
    seq: {
        type: Number,
        default: 0,
    },
    createdBy: {
        type: String,
        required: true
    },
});

counterSchema.index({ 
    key: 1, 
    createdBy: 1,
}, { unique: true });

export default mongoose.models.Counter || mongoose.model('Counter', counterSchema);
