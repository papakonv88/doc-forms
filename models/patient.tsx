import mongoose from 'mongoose';

interface Patient extends Document {
    id: Number;
    name: string;
    surname: string;
    patronimo?: string;
    amka: string;
    imerominia_genisis: Date;
}

const NewPatientSchema = new mongoose.Schema({
    id: {type: Number, unique: true},
    name: {type: String, required: true},
    surname: {type: String, required: true},
    patronimo: {type: String},
    amka: {
        type: String, required: true, unique: true, length: 11
    },
    imerominia_genisis: {type: Date, required: true}
}, {timestamps: true});

NewPatientSchema.pre('save', async function (next) {
    const doc = this;

    // Check if this is a new document
    if (doc.isNew) {
        try {
            const highestIdDoc = await mongoose.models.NewPatient.findOne({}, {}, {sort: {id: -1}});

            doc.id = highestIdDoc ? highestIdDoc.id + 1 : 1;

            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

export default mongoose.models.NewPatient || mongoose.model<Patient>('NewPatient', NewPatientSchema);
