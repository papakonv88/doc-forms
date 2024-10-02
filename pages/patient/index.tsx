import {useMemo, useState} from "react";
import Settings from './../../settings.json';
import SectionContainer from "../../components/Containers/SectionContainer/SectionContainer";
import AddPatient from "../../components/AddPatient/AddPatient";
import Separator from "../../components/Separator/Separator";
import AddExam from "../../components/AddExam/AddExam";
import {InputProps} from "../../types/types";
import {Box, Button} from "@mui/material";
import axios from "axios";
import MessageVariants from "../../enums/MessageVariants";
import PageContainer from "../../components/Containers/PageContainer";
import {useAppContext} from "../../context";
import ConfirmationDialog from "../../components/ConfirmationDialog/ConfirmationDialog";
import {useErrorPayload} from "../../hooks";

type ValueType = InputProps['value'];

function Patient() {
    const {handleOpenSnackbar, handleLoader} = useAppContext();
    const [dialog, setDialog] = useState({open: false, title: '', message: '', patientId: '', result: true});
    const [formValues, setFormValues] = useState({
        name: '',
        surname: '',
        patronimo: '',
        amka: '',
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
        imerominia_katagrafis: false,
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

    const [openDialog, setOpenDialog] = useState(false);

    const handleDialog = (bool: boolean) => {
        setOpenDialog(bool);
    };

    const handleError = (value: boolean, propertyName: string) => {
        setErrors({
            ...errors,
            [propertyName]: value
        });
    }

    const getPatients = async (query: string) => {
        const res = await axios.get('/api/searchPatient', {
            params: {q: query},
        });
        return res.data;
    }

    const retrievePatient = (info) => {
        let newFormValues: any = {}
        let newErrorValues: any = {}
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

    const hasValuesCHanged = (source, target) => {
        for (let key in source) {
            if (target.hasOwnProperty(key)) {
                if (source[key] !== target[key]) {
                    return true;
                }
            }
        }
        return false;
    }


    const handleValuesChange = (value: ValueType, propertyName: string) => {
        setFormValues({
            ...formValues,
            [propertyName]: value
        });
    }

    const handlePatchPatient = async (id: string | number) => {
        try {
            const {name, surname, patronimo} = formValues;
            await axios.patch(`/api/insertPatient?id=${id}`, {name, surname, patronimo});
            handleOpenSnackbar('Πραγματοποιήθηκε η ενημέρωση των στοιχείων του ασθενούς', MessageVariants.SUCCESS)
            handleCloseConfirmDialog();
        } catch (e) {
            handleOpenSnackbar('Σφάλμα κατά την επικαιροποίηση των στοιχείων ασθενούς', MessageVariants.ERROR)
        }
    }

    const handleCloseConfirmDialog = (type: null | string = null) => {
        setDialog((prev) => ({...prev, open: false, result: type !== 'cancel'}));
    }

    const handleOpenConfirmDialog = (payload: {
        open: boolean;
        title: string;
        message: string;
        patientId: string;
        result: boolean;
    }) => {
        setDialog(payload)
    }

    const handleSubmit = async () => {

        const [patientErrors, isPatientError] = validatePatient();
        const [examErrors, isExamError] = validateExam();

        setErrors({
            ...errors,
            ...patientErrors,
            ...examErrors
        })

        try {
            if (isPatientError || isExamError) {
                return;
            }

            handleLoader(true);
            const result = await axios.get(`/api/insertPatient?amka=${formValues.amka}`);
            const {patient} = result.data
            if (patient?.id && hasValuesCHanged(formValues, patient)) {
                handleOpenConfirmDialog({
                    open: true,
                    message: 'Φαίνεται ότι κάποια στοιχεία του επιλεγμένου ασθενούς έχουν αλλάξει. Είστε σίγουροι ότι θέλετε να προχωρήσετε στην επικαιροποίηση των στοιχείων του ασθενούς;',
                    title: 'Ενημέρωση Στοιχείων Ασθενούς',
                    patientId: patient._id,
                    result: true
                })
                handleLoader(false)
                if (!dialog.result) return;
            } else if (patient?.id && !hasValuesCHanged(formValues, patient)) {
                alert('Only save exam')
            } else {
                const result = await axios.post('/api/insertPatient', {
                    name: 'Bill', surname: 'Papakonstantinou', patronimo: 'Konstantinos', amka: '12345648911'
                })
                console.log('new row', result)
            }
            handleLoader(false)
        } catch (e) {
            handleLoader(false)
            handleOpenSnackbar('Σφάλμα κατά την αποθήκευση', MessageVariants.ERROR)
        } finally {
            handleLoader(false)
        }
    }

    return (
        <>
            <PageContainer>
                <SectionContainer>
                    <AddPatient patient={patient} handleValuesChange={handleValuesChange} formValues={formValues}
                                errors={errors} handleError={handleError} openDialog={openDialog}
                                handleDialog={handleDialog} getPatients={getPatients}
                                retrievePatient={retrievePatient}/>
                </SectionContainer>
                <Separator/>
                <SectionContainer>
                    <AddExam exam={exam} handleValuesChange={handleValuesChange} formValues={formValues} errors={errors}
                             handleError={handleError}/>
                    <Box display={'flex'} justifyContent={'end'} mb={4} mt={7}>
                        <Button onClick={handleSubmit} sx={{width: '350px'}} variant="contained"
                                size={'large'}>Υποβολη</Button>
                    </Box>
                </SectionContainer>
                <ConfirmationDialog patientId={dialog.patientId} openDialog={dialog.open} message={dialog.message}
                                    action={handlePatchPatient}
                                    title={dialog.title} handleClose={handleCloseConfirmDialog}/>
            </PageContainer>

        </>
    )
}

export default Patient
