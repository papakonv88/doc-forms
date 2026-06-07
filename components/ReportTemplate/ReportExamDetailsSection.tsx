import {Box, Typography} from "@mui/material";
import {validateAndFormatDate, validateText} from "../../utils";
import {
    reportDetailTextSx,
    reportSectionHeadingSx,
} from "./reportTypography";
export type ReportPatientInfo = {
    fullName: string;
    amka: string;
};

export type ReportExamDetails = {
    patient: {
        name: string;
        surname: string;
        patronimo: string;
        amka: string;
        imerominia_genisis: string | Date;
    };
    imerominia_katagrafis: string | Date;
    endeiksi_heg: string;
    typos_katagrafis: string;
    parapombi: string;
    antispasmodiki_agogi: string;
    alli_agogi: string;
    aitia_eksetasis: string;
    diarkeia_katagrafis: string;
    kraniotomi_plagiosi: string;
    kraniotomi_entopisi: string;
    topothetisi_ilektrodion: string;
    epipedo_syneidisis: string;
    synergasia: string;
    yperpnoia_xronos: string;
    yperpnoia_prospatheia: string;
    dfe: string;
};

const ruleSx = {
    borderBottom: "1px solid #000",
    width: "100%",
    mb: 1,
} as const;

function DetailRow({label, value}: {label: string; value: string}) {
    return (
        <Typography sx={reportDetailTextSx}>
            <Box component="span" sx={{fontWeight: 700}}>
                {label}:
            </Box>{" "}
            {value}
        </Typography>
    );
}

export function ReportSectionHeading({title}: {title: string}) {
    return (
        <>
            <Typography sx={reportSectionHeadingSx}>{title}</Typography>
            <Box sx={ruleSx}/>
        </>
    );
}

export function mapApiExamToReportDetails(data: any): ReportExamDetails | null {
    if (!data?.patient) return null;

    const patient = data.patient;

    return {
        patient: {
            name: patient.name ?? "",
            surname: patient.surname ?? "",
            patronimo: patient.patronimo ?? "",
            amka: patient.amka ?? "",
            imerominia_genisis: patient.imerominia_genisis ?? "",
        },
        imerominia_katagrafis: data.imerominia_katagrafis ?? "",
        endeiksi_heg: data.endeiksi_heg?.string ?? data.endeiksi_heg ?? "",
        typos_katagrafis: data.typos_katagrafis ?? "",
        parapombi: data.parapombi ?? "",
        antispasmodiki_agogi: data.antispasmodiki_agogi ?? "",
        alli_agogi: data.alli_agogi ?? "",
        aitia_eksetasis: data.aitia_eksetasis?.string ?? data.aitia_eksetasis ?? "",
        diarkeia_katagrafis: data.diarkeia_katagrafis?.string ?? data.diarkeia_katagrafis ?? "",
        kraniotomi_plagiosi: data.kraniotomi_plagiosi ?? "",
        kraniotomi_entopisi: data.kraniotomi_entopisi ?? "",
        topothetisi_ilektrodion: data.topothetisi_ilektrodion ?? "",
        epipedo_syneidisis: data.epipedo_syneidisis ?? "",
        synergasia: data.synergasia ?? "",
        yperpnoia_xronos: data.yperpnoia_xronos ?? "",
        yperpnoia_prospatheia: data.yperpnoia_prospatheia ?? "",
        dfe: data.dfe ?? "",
    };
}

export function reportDetailsToPatientInfo(details: ReportExamDetails): ReportPatientInfo {
    const {patient} = details;
    const fullName = [patient.surname, patient.name, patient.patronimo]
        .map((part) => (typeof part === "string" ? part.trim() : ""))
        .filter(Boolean)
        .join(" ");

    return {
        fullName,
        amka: typeof patient.amka === "string" ? patient.amka : "",
    };
}

type ReportExamDetailsSectionProps = {
    exam: ReportExamDetails;
};

export default function ReportExamDetailsSection({exam}: ReportExamDetailsSectionProps) {
    const {patient} = exam;

    return (
        <Box sx={{display: "flex", gap: 3, mt: 2, mb: 2.5, width: "100%"}}>
            <Box sx={{flex: 1, minWidth: 0}}>
                <ReportSectionHeading title="Στοιχεία Ασθενούς"/>
                <DetailRow label="Όνομα" value={validateText(patient.name)}/>
                <DetailRow label="Επώνυμο" value={validateText(patient.surname)}/>
                <DetailRow label="Πατρώνυμο" value={validateText(patient.patronimo)}/>
                <DetailRow label="AMKA" value={validateText(patient.amka)}/>
                <DetailRow
                    label="Ημερομηνία Γέννησης"
                    value={validateAndFormatDate(patient.imerominia_genisis)}
                />
            </Box>

            <Box sx={{flex: 1, minWidth: 0}}>
                <ReportSectionHeading title="Στοιχεία Εξέτασης"/>
                <DetailRow
                    label="Ημερομηνία Εξέτασης"
                    value={validateAndFormatDate(exam.imerominia_katagrafis)}
                />
                <DetailRow label="'Ένδειξη για ΗΕΓ" value={validateText(exam.endeiksi_heg)}/>
                <DetailRow label="Τύπος Καταγραφής" value={validateText(exam.typos_katagrafis)}/>
                <DetailRow label="Παραπομπή" value={validateText(exam.parapombi)}/>
                <DetailRow label="Αντικρισική Αγωγή" value={validateText(exam.antispasmodiki_agogi)}/>
                <DetailRow label="Άλλη Αγωγή" value={validateText(exam.alli_agogi)}/>
                <DetailRow label="Ατία Εξέτασης" value={validateText(exam.aitia_eksetasis)}/>
                <DetailRow label="Διάρκεια Καταγραφής" value={validateText(exam.diarkeia_katagrafis)}/>
                <DetailRow label="Κρανιοτομή - Πλαγίωση" value={validateText(exam.kraniotomi_plagiosi)}/>
                <DetailRow label="Κρανιοτομή - Εντόπιση" value={validateText(exam.kraniotomi_entopisi)}/>
                <DetailRow label="Τοποθέτηση Ηλεκτρόδιων" value={validateText(exam.topothetisi_ilektrodion)}/>
                <DetailRow label="Επίπεδο Συνείδησης Ασθενούς" value={validateText(exam.epipedo_syneidisis)}/>
                <DetailRow label="Συνεργασία Ασθενούς" value={validateText(exam.synergasia)}/>
                <DetailRow label="Υπέρπνοια - Χρόνος" value={validateText(exam.yperpnoia_xronos)}/>
                <DetailRow label="Υπέρπνοια - Προσπάθεια Ασθενούς" value={validateText(exam.yperpnoia_prospatheia)}/>
                <DetailRow label="ΔΦΕ" value={validateText(exam.dfe)}/>
            </Box>
        </Box>
    );
}
