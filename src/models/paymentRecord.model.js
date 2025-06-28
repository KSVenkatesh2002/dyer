import mongoose from 'mongoose';

const paymentRecordSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    amountPaid: {
        type: Number,
        required: true
    },
    beforeAmountPaid: {
        type: Number,  // How much due BEFORE this payment
        required: true
    },

    paidDates: [{
        type: String // Example: "2025-03-02"
    }],
    note: {
        type: String
    },
    paidAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    paidFor: {
        type: String,
        enum: ['bonus', 'salary', 'advance',],
        required: true
    },
    method: {
        type: String,
        enum: ['cash', 'upi', 'bank_transfer', 'other'],
        required: true
    },
    createdBy: {
        type: String,
        required: true // for multi-user support
    },
});

export default mongoose.models.PaymentRecord || mongoose.model('PaymentRecord', paymentRecordSchema);
