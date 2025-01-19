import mongoose from 'mongoose';

interface Patient extends Document {
    name: string;
    surname: string;
    patronimo?: string;
    amka: string;
    imerominia_genisis: Date;
}

const NewPatientSchema = new mongoose.Schema({
    name: {type: String, required: true},
    surname: {type: String, required: true},
    patronimo: {type: String},
    amka: {
        type: String, required: true, unique: true, length: 11
    },
    imerominia_genisis: {type: Date, required: true}
}, {timestamps: true});

export default mongoose.models.NewPatient || mongoose.model<Patient>('NewPatient', NewPatientSchema);
