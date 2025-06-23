import mongoose from 'mongoose';

const employeeSummarySchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true, unique: true },

    totalFullDays: Number,
    totalHalfDays: Number,
    totalAbsentDays: Number,

    unpaidFullDays: Number,
    unpaidHalfDays: Number,
    unpaidPartialAmount: Number,

    totalPaidAmount: Number,
    totalUnpaidAmount: Number,
    advancePay: Number,

    createdBy: { type: String, required: true },

    lastPaidDay: Date
}, {
    versionKey: false,
    timestamps: false
});


export default mongoose.models.EmployeeSummary || mongoose.model('EmployeeSummary', employeeSummarySchema);
