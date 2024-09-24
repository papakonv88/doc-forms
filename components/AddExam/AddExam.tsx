import {Stack, Typography, Box} from "@mui/material";
import DropDownWithRadio from "../DropDownWithRadio/DropDownWithRadio";
import {FormValuesPatient, InputProps} from "../../types/types";
import DropDown from "../DropDown/DropDown";
import ToggleButtonInput from "../ToggleButtonInput/ToggleButtonInput";
import DatePickerWrapper from "../DatePickerWrapper/DatePickerWrapper";
import InputType from "../../enums/InputTypes";
import FreeText from "../FreeText/FreeText";
import * as React from "react";

type ValueType = InputProps['value'];

interface AddExamInterface {
    exam: any;
    handleValuesChange: (value: ValueType, propertyName: string) => void;
    formValues: any; // TODO: Specify exact props
    errors: any;
    handleError: (value: boolean, propertyName: string) => void;
}

function AddExam({exam, handleValuesChange, formValues, errors, handleError}: AddExamInterface) {
    return (
        <Box width={'100%'}>
            <Typography variant={'h5'}>Στοιχεία Εξέτασης</Typography>
            <Stack rowGap={5} mt={5} direction={'column'} sx={{width: '100%'}}>
                {exam.map((element: any, idx: number) => {
                    if (element.type === InputType.DATE) {
                        return <DatePickerWrapper key={`${element.alternateName}_${idx}`}
                                                  property={element.propertyName} handleChange={handleValuesChange}
                                                  value={formValues[element.propertyName as keyof FormValuesPatient]}
                                                  label={element.label}
                                                  error={errors[element.propertyName as keyof FormValuesPatient]}
                                                  handleError={handleError}/>
                    }
                    if (element.type === InputType.DROPDOWN) {
                        return <DropDown key={`${element.alternateName}_${idx}`} options={element.values}
                                         property={element.propertyName} handleChange={handleValuesChange}
                                         value={formValues[element.propertyName as keyof FormValuesPatient]}
                                         label={element.label} errorMsg={element.errorMsg}
                                         error={errors[element.propertyName as keyof FormValuesPatient]}
                                         required={element.required}
                                         handleError={handleError}/>
                    }
                    if (element.type === InputType.DROPDOWN_WITH_RADIO) {
                        return <DropDownWithRadio key={`${element.alternateName}_${idx}`} title={element.title}
                                                  options={element.values} property={element.propertyName}
                                                  handleChange={handleValuesChange}
                                                  label={element.label}
                                                  errorMsg={element.errorMsg} validator={element.validator}
                                                  radios={element.radios}
                                                  error={errors[element.propertyName as keyof FormValuesPatient]}
                                                  required={element.required}
                                                  handleError={handleError}/>
                    }
                    if (element.type === InputType.TOGGLE_BUTTON) {
                        return <ToggleButtonInput key={`${element.alternateName}_${idx}`} title={element.title}
                                                  options={element.values} property={element.propertyName}
                                                  handleChange={handleValuesChange}
                                                  label={element.label}
                                                  errorMsg={element.errorMsg}
                                                  radios={element.radios}
                                                  error={errors[element.propertyName as keyof FormValuesPatient]}
                                                  required={element.required}
                                                  handleError={handleError}/>
                    }
                    if (element.type === InputType.FREE) {
                        return <FreeText key={`${element.alternateName}_${idx}`} property={element.propertyName}
                                         handleChange={handleValuesChange}
                                         value={formValues[element.propertyName as keyof FormValuesPatient]}
                                         label={element.label}
                                         errorMsg={element.errorMsg} validator={element.validator}
                                         error={errors[element.propertyName as keyof FormValuesPatient]}
                                         required={element.required}
                                         handleError={handleError}
                        />
                    }
                })}
            </Stack>
        </Box>
    )
}

export default AddExam
