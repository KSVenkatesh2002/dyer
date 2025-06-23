import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'half', 'holiday'],
        required: true,
    },
    paid: {
        type: Boolean,
        default: false,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    partialPay: {
        type: Number,
        default: 0,
    },
    createdBy: {
        type: String,
        required: true
    },
}, { timestamps: true });

attendanceSchema.index({ 
    createdBy: 1,
    employeeId: 1, 
    date: 1 
}, { unique: true });

export default  mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);

