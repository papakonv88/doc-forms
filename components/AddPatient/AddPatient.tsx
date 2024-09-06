import {Stack, Typography, Box, IconButton, Tooltip} from "@mui/material";
import FreeText from "../FreeText/FreeText";
import {FormValuesPatient, InputProps} from "../../types/types";
import DropDown from "../DropDown/DropDown";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

type ValueType = InputProps['value'];


interface AddPatientInterface {
    patient: any;
    handleValuesChange: (value: ValueType, propertyName: string) => void;
    formValues: any; // TODO: Specify exact props
    errors: any;
    handleError: (value: boolean, propertyName: string) => void;
}

function AddPatient({patient, handleValuesChange, formValues, errors, handleError}: AddPatientInterface) {
    return (
        <Box width={'100%'}>
            <Box display={'flex'} flexDirection={'row'} columnGap={5} alignItems={'center'}>
                <Typography variant={'h5'}>Εισαγωγή Ασθενούς</Typography>
                <Tooltip title={'Ανάκτηση στοιχείων ασθενούς'} placement={'right'} >
                    <IconButton aria-label="patch" color="primary" onClick={() => alert('Icon Button Clicked')}>
                        <CloudDownloadIcon fontSize={'large'}/>
                    </IconButton>
                </Tooltip>
            </Box>
            <Stack rowGap={5} mt={5} direction={'column'} sx={{width: '100%'}}>
                {patient.map((element: any, idx: number) => {
                    if (element.type === 'free') {
                        return <FreeText key={`${element.alternateName}_${idx}`} property={element.propertyName}
                                         handleChange={handleValuesChange}
                                         value={formValues[element.propertyName as keyof FormValuesPatient]}
                                         label={element.label}
                                         errorMsg={element.errorMsg} validator={element.validator}
                                         error={errors[element.propertyName as keyof FormValuesPatient]}
                                         handleError={handleError}
                        />
                    }
                    if (element.type === 'dropdown') {
                        return <DropDown key={`${element.alternateName}_${idx}`} options={element.values}
                                         property={element.propertyName} handleChange={handleValuesChange}
                                         value={formValues[element.propertyName as keyof FormValuesPatient]}
                                         label={element.label} errorMsg={element.errorMsg}
                                         error={errors[element.propertyName as keyof FormValuesPatient]}
                                         handleError={handleError}/>
                    }
                })}
            </Stack>
        </Box>
    )
}

export default AddPatient