import {useMemo, useState} from "react";
import Settings from './../../settings.json';
import SectionContainer from "../../components/SectionContainer/SectionContainer";
import AddPatient from "../../components/AddPatient/AddPatient";
import Separator from "../../components/Separator/Separator";
import AddExam from "../../components/AddExam/AddExam";
import {InputProps} from "../../types/types";
import {Box, Button} from "@mui/material";
import axios from "axios";

type ValueType = InputProps['value'];

function Patient() {

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

    const handleError = (value: boolean, propertyName: string) => {
        setErrors({
            ...errors,
            [propertyName]: value
        });
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
            const result = await axios.post('/api/insertPatient', {
                name: 'Bill', surname: 'Papakonstantinou', patronimo: 'Konstantinos', amka: '12345678909'
            })
            console.log(result, 'upload succeed');
        } catch (e) {
            console.log(e, 'error inserting patient');
        }
    }

    return (
        <Box display={'flex'} flexDirection={'column'} maxWidth={'md'} sx={{margin: 'auto'}} px={10}
             justifyContent={'center'}>
            <SectionContainer>
                <AddPatient patient={patient} handleValuesChange={handleValuesChange} formValues={formValues}
                            errors={errors} handleError={handleError}/>
            </SectionContainer>
            <Separator/>
            <SectionContainer>
                <AddExam exam={exam} handleValuesChange={handleValuesChange} formValues={formValues} errors={errors}
                         handleError={handleError}/>
            </SectionContainer>
            <Box display={'flex'} justifyContent={'end'} pb={10}>
                <Button onClick={handleSubmit} sx={{width: '350px'}} variant="contained" size={'large'}>Υποβολη</Button>
            </Box>
        </Box>
    )
}

export default Patient
