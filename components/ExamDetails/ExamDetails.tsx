import React from "react";
import {Container, Divider, Grid, Stack, Typography} from "@mui/material";
import {validateAndFormatDate, validateText} from "../../utils";

function ExamDetails(exam: any) {
    return (
        <Container maxWidth="lg" sx={{padding: 3, marginTop: 3}}>
            <Grid container spacing={4}>
                <Grid item xs={12} sx={{marginBottom: 4}}>
                    <Stack spacing={2}>
                        <Typography variant="h6">Στοιχεία Ασθενούς</Typography>
                        <Divider/>
                        <Typography>
                            <strong>Όνομα:</strong> {validateText(exam.patient.name)}
                        </Typography>
                        <Typography>
                            <strong>Επώνυμο:</strong> {validateText(exam.patient.surname)}
                        </Typography>
                        <Typography>
                            <strong>Πατρώνυμο:</strong> {validateText(exam.patient.patronimo)}
                        </Typography>
                        <Typography>
                            <strong>AMKA:</strong> {validateText(exam.patient.amka)}
                        </Typography>
                        <Typography>
                            <strong>Ημερομηνία Γέννησης:</strong>{" "}
                            {validateAndFormatDate(exam.patient.imerominia_genisis)}
                        </Typography>
                    </Stack>
                </Grid>

                <Grid item xs={12}>
                    <Stack spacing={2}>
                        <Typography variant="h6">Στοιχεία Εξέτασης</Typography>
                        <Divider/>
                        <Typography>
                            <strong>Ημερομηνία Εξέτασης:</strong>{" "}
                            {validateAndFormatDate(exam.imerominia_katagrafis)}
                        </Typography>
                        <Typography>
                            <strong>'Ενδειξη για ΗΕΓ:</strong> {validateText(exam.endeiksi_heg?.string)}
                        </Typography>
                        <Typography>
                            <strong>Τύπος Καταγραφής:</strong> {validateText(exam.typos_katagrafis)}
                        </Typography>
                        <Typography>
                            <strong>Παραπομπή:</strong> {validateText(exam.parapombi)}
                        </Typography>
                        <Typography>
                            <strong>Αντισπασμωδική Αγωγή:</strong>{" "}
                            {validateText(exam.antispasmodiki_agogi)}
                        </Typography>
                        <Typography>
                            <strong>Άλλη Αγωγή:</strong> {validateText(exam.alli_agogi)}
                        </Typography>
                        <Typography>
                            <strong>Ατία Εξέτασης:</strong> {validateText(exam.aitia_eksetasis.string)}
                        </Typography>
                        <Typography>
                            <strong>Διάρκεια Καταγραφής:</strong> {validateText(exam.diarkeia_katagrafis.string)}
                        </Typography>
                        <Typography>
                            <strong>Κρανιοτομή - Πλαγίωση:</strong> {validateText(exam.kraniotomi_plagiosi)}
                        </Typography>
                        <Typography>
                            <strong>Κρανιοτομή - Εντόπιση:</strong> {validateText(exam.kraniotomi_entopisi)}
                        </Typography>
                        <Typography>
                            <strong>Τοποθέτηση Ηλεκτρόδιων:</strong> {validateText(exam.topothetisi_ilektrodion)}
                        </Typography>
                        <Typography>
                            <strong>Επίπεδο Συνείδησης Ασθενούς:</strong> {validateText(exam.epipedo_syneidisis)}
                        </Typography>
                        <Typography>
                            <strong>Συνεργασία Ασθενούς:</strong> {validateText(exam.synergasia)}
                        </Typography>
                        <Typography>
                            <strong>Υπέρπνοια - Χρόνος:</strong> {validateText(exam.yperpnoia_xronos)}
                        </Typography>
                        <Typography>
                            <strong>Υπέρπνοια - Προσπάθεια Ασθενούς:</strong> {validateText(exam.yperpnoia_prospatheia)}
                        </Typography>
                        <Typography>
                            <strong>ΔΦΕ:</strong> {validateText(exam.dfe)}
                        </Typography>
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    );
}

export default ExamDetails;
