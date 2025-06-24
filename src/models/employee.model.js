import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        unique: true,
        required: true,
    },
    joinDate: {
        type: Date,
        required: true,
    },
    address: {
        type: String,
        // required: true,
    },
    job: {
        type: String,
        required: true,
        enum: ['tying', 'dyeing', 'asu-marking', 'asu-winding', 'chittam'],
    },
    salaryPerDay: {
        type: Number,
    },
    workExperience: {
        type: String,
        default: '',
    },
    previousWorkPlace: {
        type: String,
        default: '',
    },
    createdBy: {
        type: String,
        required: true
    },
});

export default mongoose.models.Employee || mongoose.model('Employee', employeeSchema);
