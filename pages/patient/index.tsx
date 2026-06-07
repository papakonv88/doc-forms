import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import Settings from './../../settings.json';
import SectionContainer from "../../components/Containers/SectionContainer/SectionContainer";
import AddPatient from "../../components/AddPatient/AddPatient";
import AddExam from "../../components/AddExam/AddExam";
import {InputProps} from "../../types/types";
import {Box, Button, Step, StepLabel, Stepper} from "@mui/material";
import axios from "axios";
import MessageVariants from "../../enums/MessageVariants";
import PageContainer from "../../components/Containers/PageContainer";
import {useAppContext} from "../../context";
import ConfirmationDialog from "../../components/ConfirmationDialog/ConfirmationDialog";
import {useErrorPayload} from "../../hooks";
import {deletePatient, saveExam, savePatient} from "../../utils";
import DeleteIcon from '@mui/icons-material/Delete';
import {useRouter} from "next/router";

type ValueType = InputProps['value'];
const steps = ['Εισαγωγή Ασθενή', 'Στοιχεία Εξέτασης'];

function Patient() {
    const [activeStep, setActiveStep] = useState(0);
    const [patientUId, setPatientUId] = useState('');
    const {handleOpenSnackbar, handleLoader, isLoading} = useAppContext();
    const [dialog, setDialog] = useState({mode: '', open: false, title: '', message: '', result: true});
    const [formValues, setFormValues] = useState({
        name: '',
        surname: '',
        patronimo: '',
        amka: '',
        imerominia_genisis: '',
        endeiksi_heg: {
            radio: '',
            string: ''
        },
        imerominia_katagrafis: '',
        typos_katagrafis: '',
        parapombi: '',
        aitia_eksetasis: {
            radio: '',
            string: ''
        },
        antispasmodiki_agogi: '',
        alli_agogi: '',
        kraniotomi_plagiosi: '',
        kraniotomi_entopisi: '',
        topothetisi_ilektrodion: '',
        diarkeia_katagrafis: {
            radio: '',
            string: ''
        },
        epipedo_syneidisis: '',
        synergasia: '',
        yperpnoia_xronos: '',
        yperpnoia_prospatheia: '',
        dfe: ''
    });

    const [errors, setErrors] = useState({
        name: false,
        surname: false,
        patronimo: false,
        amka: false,
        imerominia_genisis: false,
        imerominia_katagrafis: false,
        endeiksi_heg: false,
        typos_katagrafis: false,
        parapombi: false,
        aitia_eksetasis: false,
        antispasmodiki_agogi: false,
        alli_agogi: false,
        kraniotomi_plagiosi: false,
        kraniotomi_entopisi: false,
        topothetisi_ilektrodion: false,
        diarkeia_katagrafis: false,
        epipedo_syneidisis: false,
        synergasia: false,
        yperpnoia_xronos: false,
        yperpnoia_prospatheia: false,
        dfe: false
    });

    const router = useRouter();
    const [openDialog, setOpenDialog] = useState(false);
    const isDialogActionRunningRef = useRef(false);
    const isSavingExamRef = useRef(false);

    const resetForm = () => {
        setFormValues({
            name: '',
            surname: '',
            patronimo: '',
            amka: '',
            imerominia_genisis: '',
            imerominia_katagrafis: '',
            endeiksi_heg: {
                radio: '',
                string: ''
            },
            typos_katagrafis: '',
            parapombi: '',
            aitia_eksetasis: {
                radio: '',
                string: ''
            },
            antispasmodiki_agogi: '',
            alli_agogi: '',
            kraniotomi_plagiosi: '',
            kraniotomi_entopisi: '',
            topothetisi_ilektrodion: '',
            diarkeia_katagrafis: {
                radio: '',
                string: ''
            },
            epipedo_syneidisis: '',
            synergasia: '',
            yperpnoia_xronos: '',
            yperpnoia_prospatheia: '',
            dfe: ''
        });

        setErrors({
            name: false,
            surname: false,
            patronimo: false,
            amka: false,
            imerominia_genisis: false,
            imerominia_katagrafis: false,
            endeiksi_heg: false,
            typos_katagrafis: false,
            parapombi: false,
            aitia_eksetasis: false,
            antispasmodiki_agogi: false,
            alli_agogi: false,
            kraniotomi_plagiosi: false,
            kraniotomi_entopisi: false,
            topothetisi_ilektrodion: false,
            diarkeia_katagrafis: false,
            epipedo_syneidisis: false,
            synergasia: false,
            yperpnoia_xronos: false,
            yperpnoia_prospatheia: false,
            dfe: false
        });
    };

    const handleDialog = useCallback((bool: boolean) => {
        setOpenDialog(bool);
    }, []);

    const handleError = useCallback((value: boolean, propertyName: string) => {
        setErrors((prev) => ({
            ...prev,
            [propertyName]: value
        }));
    }, []);

    const getPatients = useCallback(async (query: string) => {
        const res = await axios.get('/api/searchPatient', {
            params: {q: query},
        });
        return res.data;
    }, []);

    const retrievePatient = (info: any) => {
        let newFormValues: any = {}
        let newErrorValues: any = {}
        if (info?._id) {
            setPatientUId(info._id)
        }
        for (const [key, value] of Object.entries(info)) {
            if (Object.keys(formValues).includes(key)) {
                newFormValues[key] = value
            }
        }
        for (const key of Object.keys(newFormValues)) {
            newErrorValues[key] = false
        }
        setFormValues((prev) => ({...prev, ...newFormValues}))
        setErrors((prev) => ({...prev, ...newErrorValues}))
    }


    const patient = useMemo(() => {
        return Settings.technician.patient
    }, [])

    const exam = useMemo(() => {
        return Settings.technician.exam
    }, [])


    const {validate: validatePatient} = useErrorPayload(formValues, patient);
    const {validate: validateExam} = useErrorPayload(formValues, exam);


    const handleValuesChange = useCallback((value: ValueType, propertyName: string) => {
        setFormValues((prev) => {
            // Αποφυγή περιττών updates αν η τιμή δεν αλλάζει
            // @ts-ignore
            if (prev[propertyName] === value) {
                return prev;
            }
            return {
                ...prev,
                [propertyName]: value
            };
        });
    }, []);

    const handlePatchPatient = async (id: string) => {
        try {
            handleLoader(true);
            const {name, surname, patronimo, imerominia_genisis} = formValues;
            await axios.patch(`/api/insertPatient?_id=${id}`, {name, surname, patronimo, imerominia_genisis});
            handleOpenSnackbar('Πραγματοποιήθηκε η ενημέρωση των στοιχείων του ασθενούς', MessageVariants.SUCCESS)
            setActiveStep(1)
            handleCloseConfirmDialog();
        } catch (e) {
            handleOpenSnackbar('Σφάλμα κατά την επικαιροποίηση των στοιχείων ασθενούς', MessageVariants.ERROR)
        } finally {
            handleLoader(false);
        }
    }

    const handleInsertPatient = async () => {
        try {
            handleLoader(true);
            const {name, surname, patronimo, amka, imerominia_genisis, ...rest} = formValues;
            const result = await savePatient({
                name, surname, patronimo, amka, imerominia_genisis
            })
            if (result.data?.newRow?._id) {
                setPatientUId(result.data?.newRow?._id);
            }
            handleOpenSnackbar('Πραγματοποιήθηκε η εισαγωγή του νέου ασθενούς', MessageVariants.SUCCESS)
            setActiveStep(1)
            handleCloseConfirmDialog();
        } catch (e) {
            handleOpenSnackbar('Σφάλμα κατά την εισαγωγή του νέου ασθενούς', MessageVariants.ERROR)
        } finally {
            handleLoader(false);
        }
    }

    const handleInsertExam = async () => {
        if (isSavingExamRef.current) return;

        isSavingExamRef.current = true;
        try {
            handleLoader(true);
            const {name, surname, patronimo, amka, imerominia_genisis, ...rest} = formValues;
            await saveExam({
                ...rest,
                patient: patientUId,
            });
            handleOpenSnackbar("Πραγματοποιήθηκε η εισαγωγή της νέας εξέτασης", MessageVariants.SUCCESS);
            await router.push("/");
        } catch (e) {
            handleOpenSnackbar("Σφάλμα κατά την εισαγωγή της νέας εξέτασης", MessageVariants.ERROR);
        } finally {
            handleLoader(false);
            isSavingExamRef.current = false;
        }
    };

    const handleDeletePatient = async () => {
        try {
            handleLoader(true);
            await deletePatient(patientUId)
            handleOpenSnackbar('Επιτυχής Διαγραφή Ασθενούς', MessageVariants.SUCCESS)
            setPatientUId('');
            resetForm();
            handleCloseConfirmDialog();
        } catch (e) {
            handleOpenSnackbar('Σφάλμα κατά την Διαγραφή Ασθενούς', MessageVariants.ERROR)
        } finally {
            handleLoader(false);
        }
    }

    const handleCloseConfirmDialog = (type: null | string = null) => {
        setDialog((prev) => ({...prev, open: false, mode: '', result: type !== 'cancel'}));
    }

    const handleOpenConfirmDialog = (payload: {
        mode: string;
        open: boolean;
        title: string;
        message: string;
        result: boolean;
    }) => {
        setDialog(payload)
    }

    const handlePatientSubmit = async () => {
        const [patientErrors, isPatientError] = validatePatient();
        setErrors({
            ...errors,
            ...patientErrors,
        })

        try {
            if (isPatientError) {
                return;
            }

            handleLoader(true);
            const result = await axios.get(`/api/insertPatient?amka=${formValues.amka}`);
            const {patient} = result.data

            if (patient?._id) {
                setPatientUId(patient?._id)
                handleOpenConfirmDialog({
                    mode: "edit",
                    open: true,
                    message: "Το ΑΜΚΑ του εν λόγω ασθενούς υπάρχει ήδη στη βάση δεδομένων. Εάν έχετε τροποποιήσει κάποια στοιχεία του ασθενούς, αυτή η αλλαγή θα αποθηκευτεί στη βάση δεδομένων, είστε σίγουροι ότι θέλετε να προχωρήσετε;",
                    title: "Ενημέρωση Στοιχείων Ασθενούς",
                    result: true,
                });
            } else {
                handleOpenConfirmDialog({
                    mode: "create",
                    open: true,
                    message: "Είστε σίγουροι ότι θέλετε να προχωρήσετε στην εισαγωγή του νέου ασθενούς στην βάση δεδομένων;",
                    title: "Εισαγωγή Στοιχείων Ασθενούς",
                    result: true,
                });
            }
        } catch (e) {
            handleOpenSnackbar("Σφάλμα κατά την αποθήκευση", MessageVariants.ERROR);
        } finally {
            handleLoader(false);
        }
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleDialogAction = async (mode: string) => {
        if (isDialogActionRunningRef.current) return;

        isDialogActionRunningRef.current = true;
        handleCloseConfirmDialog();

        try {
            if (mode === "edit") {
                await handlePatchPatient(patientUId);
            } else if (mode === "exam") {
                await handleInsertExam();
            } else if (mode === "delete") {
                await handleDeletePatient();
            } else {
                await handleInsertPatient();
            }
        } finally {
            isDialogActionRunningRef.current = false;
        }
    };

    const handleDelete = () => {
        handleLoader(true)
        handleOpenConfirmDialog({
            mode: 'delete',
            open: true,
            message: 'Eίστε σίγουροι ότι θέλετε να προχωρήσετε στην διαγραφή του ασθενούς;',
            title: 'Διαγραφή',
            result: true
        })
        handleLoader(false)
    }

    const handleExamSubmit = async () => {
        const [examErrors, isExamError] = validateExam();
        setErrors({
            ...errors,
            ...examErrors
        })
        try {
            if (isExamError) {
                return;
            }
            handleLoader(true)
            handleOpenConfirmDialog({
                mode: "exam",
                open: true,
                message: "Eίστε σίγουροι ότι θέλετε να προχωρήσετε στην αποθήκευση της εξέτασης;",
                title: "Νέα Εξέταση",
                result: true,
            });
        } catch (e) {
            handleOpenSnackbar("Σφάλμα κατά την αποθήκευση της εξέτασης", MessageVariants.ERROR);
        } finally {
            handleLoader(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        scrollToTop();
    }, [activeStep]);

    return (
        <>
            <PageContainer>
                <SectionContainer py={7}>
                    <Stepper activeStep={activeStep} className="mb-8">
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </SectionContainer>
                {activeStep === 0 ?
                    <SectionContainer>
                        <AddPatient key={patientUId} patient={patient} handleValuesChange={handleValuesChange} formValues={formValues}
                                    errors={errors} handleError={handleError} openDialog={openDialog}
                                    handleDialog={handleDialog} getPatients={getPatients}
                                    retrievePatient={retrievePatient}/>
                        <Box display={'flex'} columnGap={2} justifyContent={'end'} mb={4} mt={7}>
                            <Button
                                onClick={handleDelete}
                                variant="contained"
                                color="error"
                                disabled={!Boolean(patientUId) || isLoading}
                                startIcon={<DeleteIcon/>}
                            >
                                Διαγραφη Ασθενη
                            </Button>
                            <Button 
                                variant="contained" 
                                onClick={handlePatientSubmit}
                                disabled={isLoading}
                            >
                                Συνεχεια σε Εξεταση
                            </Button>
                        </Box>
                    </SectionContainer> :
                    <SectionContainer>
                        <AddExam exam={exam} handleValuesChange={handleValuesChange} formValues={formValues}
                                 errors={errors}
                                 handleError={handleError}/>
                        <Box display={'flex'} justifyContent={'end'} mb={4} mt={7} columnGap={2}>
                            <Button
                                variant="contained"
                                disabled={activeStep === 0 || isLoading}
                                onClick={handleBack}
                            >
                                Πισω
                            </Button>
                            <Button
                                type="button"
                                onClick={handleExamSubmit}
                                variant="contained"
                                disabled={isLoading}
                            >
                                Υποβολη
                            </Button>
                        </Box>
                    </SectionContainer>
                }
                <ConfirmationDialog mode={dialog.mode} openDialog={dialog.open} message={dialog.message}
                                    action={handleDialogAction}
                                    title={dialog.title} handleClose={handleCloseConfirmDialog}/>
            </PageContainer>

        </>
    )
}

export default Patient
