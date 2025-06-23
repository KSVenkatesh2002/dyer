import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true, // e.g., `mani-pallu`, `mani-body`
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

export default mongoose.models.Counter || mongoose.model('Counter', counterSchema);
