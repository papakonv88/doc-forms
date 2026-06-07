import mongoose, {ObjectId} from 'mongoose';

const AutoIncrement = require('mongoose-sequence')(mongoose);

interface AitiaEksetasis {
    radio?: string;
    string?: string;
}

interface DiarkeiaKatagrafis {
    radio?: string;
    string?: string;
}


interface endeiksiHeg {
    radio?: string;
    string?: string;
}
interface Exam extends Document {
    _id: ObjectId;
    imerominia_katagrafis: Date;
    endeiksi_heg: endeiksiHeg;
    typos_katagrafis: string;
    parapombi: string;
    aitia_eksetasis: AitiaEksetasis;
    antispasmodiki_agogi: string;
    alli_agogi: string;
    kraniotomi_plagiosi: string;
    kraniotomi_entopisi: string;
    topothetisi_ilektrodion: string;
    diarkeia_katagrafis: DiarkeiaKatagrafis;
    epipedo_syneidisis: string;
    synergasia: string;
    yperpnoia_xronos: string;
    yperpnoia_prospatheia: string;
    dfe: string;
    patient: mongoose.Schema.Types.ObjectId;
}

const NewExamSchema = new mongoose.Schema({
    imerominia_katagrafis: {type: Date},
    endeiksi_heg: {
        radio: String,
        string: String
    },
    typos_katagrafis: {type: String, default: '-'},
    parapombi: {type: String, default: '-'},
    aitia_eksetasis: {
        radio: String,
        string: String
    },
    antispasmodiki_agogi: {type: String, default: '-'},
    alli_agogi: {type: String, default: '-'},
    kraniotomi_plagiosi: {type: String, default: '-'},
    kraniotomi_entopisi: {type: String, default: '-'},
    topothetisi_ilektrodion: {type: String, default: '-'},
    diarkeia_katagrafis: {
        radio: String,
        string: String
    },
    epipedo_syneidisis: {type: String, default: '-'},
    synergasia: {type: String, default: '-'},
    yperpnoia_xronos: {type: String, default: '-'},
    yperpnoia_prospatheia: {type: String, default: '-'},
    dfe: {type: String, default: '-'},
    patient: {type: mongoose.Schema.Types.ObjectId, ref: 'NewPatient', required: true}
}, {timestamps: true});

if(!mongoose.models.NewExam){
    NewExamSchema.plugin(AutoIncrement,{inc_field:'examId'});
}

export default mongoose.models.NewExam || mongoose.model<Exam>('NewExam', NewExamSchema);
