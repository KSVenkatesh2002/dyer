// models/Winding.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    // productId: {
    //     type: String,
    //     ref: 'Product',
    //     required: true,
    //     unique: true
    // },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },

    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    pays: {
        type: Number,
        required: true
    },
    taskAssignedAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    createdBy: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.Task || mongoose.model('Task', taskSchema);
