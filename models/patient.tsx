import mongoose from 'mongoose';

const NewPatientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    patronimo: { type: String },
    amka: { type: Number, required: true, unique: true, length: 11},
}, { timestamps: true });

export default mongoose.models.NewPatient || mongoose.model('NewPatient', NewPatientSchema);
