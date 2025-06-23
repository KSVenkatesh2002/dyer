// models/markingTask.model.js
import mongoose from 'mongoose';

const markingTaskSchema = new mongoose.Schema({
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.markingTask || mongoose.model('markingTask', markingTaskSchema);
