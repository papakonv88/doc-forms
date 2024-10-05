import {Stack, Typography, Box, IconButton, Tooltip} from "@mui/material";
import FreeText from "../FreeText/FreeText";
import {FormValuesPatient, InputProps} from "../../types/types";
import DropDown from "../DropDown/DropDown";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import InputType from "../../enums/InputTypes";
import SearchPatient from "../SearchPatient/SearchPatient";
import * as React from "react";
import DatePickerWrapper from "../DatePickerWrapper/DatePickerWrapper";

type ValueType = InputProps['value'];


interface AddPatientInterface {
    patient: any;
    handleValuesChange: (value: ValueType, propertyName: string) => void;
    formValues: any; // TODO: Specify exact props
    errors: any;
    handleError: (value: boolean, propertyName: string) => void;
    openDialog: boolean;
    handleDialog: (value: boolean) => void;
    getPatients: (value: string) => Promise<any>;
    retrievePatient: (value: any) => void;
}

function AddPatient({patient, handleValuesChange, formValues, errors, handleError, openDialog, handleDialog, getPatients, retrievePatient}: AddPatientInterface) {
    return (
        <>
        <SearchPatient openDialog={openDialog} handleDialog={handleDialog} getPatients={getPatients} retrievePatient={retrievePatient} />
        <Box width={'100%'} mt={5}>
            <Box display={'flex'} flexDirection={'row'} columnGap={5} alignItems={'center'}>
                <Typography variant={'h5'}>Εισαγωγή Ασθενούς</Typography>
                <Tooltip title={'Ανάκτηση στοιχείων ασθενούς'} placement={'right'} >
                    <IconButton aria-label="patch" color="primary" onClick={() => handleDialog(true)}>
                        <CloudDownloadIcon fontSize={'large'}/>
                    </IconButton>
                </Tooltip>
            </Box>
            <Stack rowGap={5} mt={5} direction={'column'} sx={{width: '100%'}}>
                {patient.map((element: any, idx: number) => {
                    if (element.type === InputType.FREE) {
                        return <FreeText key={`${element.propertyName}_${idx}`} property={element.propertyName}
                                         handleChange={handleValuesChange}
                                         value={formValues[element.propertyName as keyof FormValuesPatient]}
                                         label={element.label}
                                         required={element.required}
                                         errorMsg={element.errorMsg} validator={element.validator}
                                         error={errors[element.propertyName as keyof FormValuesPatient]}
                                         handleError={handleError}
                        />
                    }
                    if (element.type === InputType.DROPDOWN) {
                        return <DropDown key={`${element.propertyName}_${idx}`} options={element.values}
                                         property={element.propertyName} handleChange={handleValuesChange}
                                         value={formValues[element.propertyName as keyof FormValuesPatient]}
                                         label={element.label} errorMsg={element.errorMsg}
                                         required={element.required}
                                         error={errors[element.propertyName as keyof FormValuesPatient]}
                                         handleError={handleError}/>
                    }
                    if (element.type === InputType.DATE) {
                        return <DatePickerWrapper key={`${element.propertyName}_${idx}`}
                                                  property={element.propertyName} handleChange={handleValuesChange}
                                                  value={formValues[element.propertyName as keyof FormValuesPatient]}
                                                  label={element.label}
                                                  error={errors[element.propertyName as keyof FormValuesPatient]}
                                                  handleError={handleError}/>
                    }
                })}
            </Stack>
        </Box>
        </>
    )
}

export default AddPatient
