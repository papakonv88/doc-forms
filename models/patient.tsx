import mongoose from 'mongoose';

const NewPatientSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    name: {type: String, required: true},
    surname: {type: String, required: true},
    patronimo: {type: String},
    amka: {type: String, required: true, unique: true, length: 11},
}, {timestamps: true});


// Pre-save hook to auto-increment the `id` before saving the document
NewPatientSchema.pre('save', async function (next) {
    const doc = this;

    // Check if this is a new document
    if (doc.isNew) {
        try {
            // Find the highest `id` in the current collection
            const highestIdDoc = await mongoose.models.NewPatient.findOne({}, {}, { sort: { id: -1 } });

            // If a document exists, increment the ID by 1, otherwise start at 1
            doc.id = highestIdDoc ? highestIdDoc.id + 1 : 1;

            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();  // Proceed for updates, no increment needed
    }
});

export default mongoose.models.NewPatient || mongoose.model('NewPatient', NewPatientSchema);
