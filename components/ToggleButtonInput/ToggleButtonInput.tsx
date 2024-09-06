import {Box, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import {SyntheticEvent, useEffect, useState} from "react";
import {InputProps} from "../../types/types";
import {tokens} from "../../styles/tokens";
import DropDown from "../DropDown/DropDown";
import FreeText from "../FreeText/FreeText";

function ToggleButtonInput({title, options, handleChange, property, errorMsg, label, radios, validator, error, handleError}: InputProps) {
    const [unitValue, setUnitValue] = useState('')
    const [inputValue, setInputValue] = useState('')


    useEffect(() => {
        if (options && options?.length > 0) {
            setUnitValue(options[0])
        }
    }, [options])

    const handleUnitChange = (e: SyntheticEvent) => {
        // @ts-ignore
        const newValue = e?.target?.value as any || '';
        setUnitValue(newValue)
        setInputValue('')
        // @ts-ignore
        handleChange({value: '', units: ''}, property)
    }

    const handleInputValue = (val: string, prop: string) => {
        setInputValue(val)
        if (val) {
            // @ts-ignore
            handleChange({
                radio: unitValue,
                string: val
            }, property)
        }
    }

    return (
        <Box display={'flex'} rowGap={3} flexDirection={'column'} sx={tokens.classes.formBox}>
            <Typography>{title}</Typography>
            <ToggleButtonGroup exclusive={true} color={'primary'} value={unitValue} onChange={handleUnitChange}>
                {options && options?.length > 0 && options.map((button: string, idx) => (
                    <ToggleButton key={`${button}_${idx}`} value={button}>{button}</ToggleButton>
                ))}
            </ToggleButtonGroup>
            {radios[unitValue]?.length > 0 ?
                <DropDown key={unitValue} hasNested={true} options={radios[unitValue]} value={inputValue}
                          handleChange={handleInputValue} property={property} errorMsg={errorMsg} label={label} error={error} handleError={handleError}/> :
                <FreeText key={unitValue} hasNested={true} property={property}
                          handleChange={handleInputValue}
                          value={inputValue}
                          label={label}
                          errorMsg={radios.errorMsg[unitValue]} validator={radios.validators[unitValue]} error={error} handleError={handleError}/>}
        </Box>
    )
}

export default ToggleButtonInput;