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

type ValueType = InputProps['value'];

function Patient() {
    const { handleOpenSnackbar, handleLoader } = useAppContext();
    const [formValues, setFormValues] = useState({
        name: '',
        surname: '',
        patronimo: '',
        amka: '',
        imerominia_katagrafis: '',
        test: '',
        methodoi_energopoiisis: {
            radio: '',
            string: ''
        },
        xronos_eksetasis: {
            radio: '',
            string: ''
        }
    });

    const [errors, setErrors] = useState({
        name: false,
        surname: false,
        patronimo: false,
        amka: false,
        imerominia_katagrafis: false,
        test: false,
        methodoi_energopoiisis: false,
        xronos_eksetasis: false
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
            params: { q: query },
        });
        return res.data;
    }

    const retrievePatient = (info) => {
        console.log(info, 'info');
    }

    const patient = useMemo(() => {
        return Settings.technician.patient
    }, [])

    const exam = useMemo(() => {
        return Settings.technician.exam
    }, [])


    const handleValuesChange = (value: ValueType, propertyName: string) => {
        setFormValues({
            ...formValues,
            [propertyName]: value
        });
    }

    const handleSubmit = async () => {
        let newObj: any = {};
        for (const [key, value] of Object.entries(formValues)) {
            if (!value && typeof value !== 'object') {
                newObj[key] = true
            } else if (typeof value === 'object' && value !== null) {
                if (value instanceof Date) {
                    newObj[key] = true
                    return;
                }
                if (!value?.string) {
                    newObj[key] = true
                }
            }
        }
        setErrors({
            ...errors,
            ...newObj
        })

        try {
            handleLoader(true);
            const exists = await axios.get(`/api/insertPatient?amka=${formValues.amka}`);
            if (exists.data?.isAmka) {
                handleLoader(false)
                handleOpenSnackbar('Hello World', MessageVariants.ERROR)
            } else {
                const result = await axios.post('/api/insertPatient', {
                    name: 'Bill', surname: 'Papakonstantinou', patronimo: 'Konstantinos', amka: '12345648911'
                })
                console.log('new row', result)
            }
            handleLoader(false)
        } catch (e) {
            handleLoader(false)
            handleOpenSnackbar('Hello World', MessageVariants.ERROR)
        }

    }

    return (
        <>
            <PageContainer>
                <SectionContainer>
                    <AddPatient patient={patient} handleValuesChange={handleValuesChange} formValues={formValues}
                                errors={errors} handleError={handleError} openDialog={openDialog} handleDialog={handleDialog} getPatients={getPatients} retrievePatient={retrievePatient}/>
                </SectionContainer>
                <Separator/>
                <SectionContainer>
                    <AddExam exam={exam} handleValuesChange={handleValuesChange} formValues={formValues} errors={errors}
                             handleError={handleError}/>
                </SectionContainer>
                <Box display={'flex'} justifyContent={'end'} pb={10}>
                    <Button onClick={handleSubmit} sx={{width: '350px'}} variant="contained"
                            size={'large'}>Υποβολη</Button>
                </Box>
            </PageContainer>

        </>
    )
}

export default Patient
