import mongoose from 'mongoose';
import autoIncrement from "mongoose-auto-increment";

const NewPatientSchema = new mongoose.Schema({
    name: {type: String, required: true},
    surname: {type: String, required: true},
    patronimo: {type: String},
    amka: {type: String, required: true, unique: true, length: 11},
}, {timestamps: true});

NewPatientSchema.plugin(autoIncrement.plugin, {
    model: 'NewPatient',
    field: 'id',
    startAt: 1,
    incrementBy: 1
})

export default mongoose.models.NewPatient || mongoose.model('NewPatient', NewPatientSchema);
