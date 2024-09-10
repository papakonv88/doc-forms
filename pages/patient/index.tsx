import {useMemo, useState} from "react";
import Settings from './../../settings.json';
import SectionContainer from "../../components/SectionContainer/SectionContainer";
import AddPatient from "../../components/AddPatient/AddPatient";
import Separator from "../../components/Separator/Separator";
import AddExam from "../../components/AddExam/AddExam";
import {InputProps} from "../../types/types";
import {Box, Button} from "@mui/material";

type ValueType = InputProps['value'];

function Patient() {

    const [formValues, setFormValues] = useState({
        name: '',
        surname: '',
        patronimo: '',
        amka: '',
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
        surname: '',
        patronimo: false,
        amka: false,
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

    const handleSubmit = () => {
        let newObj: any = {};
        for (const [key, value] of Object.entries(formValues)) {
            if (!value && typeof value !== 'object') {
                newObj[key] = true
            } else if (typeof value === 'object' && value !== null) {
                if (!value?.string) {
                    newObj[key] = true
                }
            }
        }
        setErrors({
            ...errors,
            ...newObj
        })
    }

    return (
        <Box display={'flex'} flexDirection={'column'} maxWidth={'xl'} sx={{margin: 'auto'}} px={10} justifyContent={'center'}>
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