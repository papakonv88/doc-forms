import mongoose from 'mongoose';

interface Exam extends Document {
    id: Number;
    name: string;
    surname: string;
    patronimo?: string;
    amka: string;
    imerominia_genisis: Date;
}

const NewExamSchema = new mongoose.Schema({
    id: {type: Number, unique: true},
    patientId: {type: Number, required: true},
    imerominia_katagrafis: {type: Date, required: true},
    typos_katagrafis: {type: String, required: true},
    parapombi: {type: String, required: true},
    aitia_eksetasis: {
        radio: String,
        string: String
    },
    antispasmodiki_agogi: {type: String, required: true},
    alli_agogi: {type: String, default: '-'},
    kraniotomi_plagiosi: {type: String, required: true},
    kraniotomi_entopisi: {type: String, required: true},
    topothetisi_ilektrodion: {type: String, required: true},
    diarkeia_katagrafis: {
        radio: String,
        string: String
    },
    epipedo_syneidisis: {type: String, required: true},
    synergasia: {type: String, required: true},
    yperpnoia_xronos: {type: String, required: true},
    yperpnoia_prospatheia: {type: String, default: '-'},
    dfe: {type: String, required: true}
}, {timestamps: true});

NewExamSchema.pre('save', async function (next) {
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

export default mongoose.models.NewExam || mongoose.model<Exam>('NewExam', NewExamSchema);
