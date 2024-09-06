import {Box, FormControlLabel, Radio, RadioGroup, Typography} from "@mui/material";
import {SyntheticEvent, useEffect, useState} from "react";
import {InputProps} from "../../types/types";
import DropDown from '../DropDown/DropDown';
import {tokens} from "../../styles/tokens";

function DropDownWithRadio({title, options, handleChange, property, errorMsg, label, radios, error, handleError}: InputProps) {
    const [radioValue, setRadioValue] = useState('')
    const [dropDownValue, setDropDownValue] = useState('')

    useEffect(() => {
        if (options && options?.length > 0) {
            setRadioValue(options[0])
        }
    }, [options])


    const handleRadioChange = (e: SyntheticEvent) => {
        // @ts-ignore
        const newValue = e?.target?.value as any || '';
        setRadioValue(newValue)
        setDropDownValue('')
        // @ts-ignore
        handleChange({radio: '', string: ''}, property)
    }


    const handleDropDownValue = (val: string, prop: string) => {
        setDropDownValue(val)
            // @ts-ignore
            handleChange({
                radio: radioValue,
                string: val
            }, property)
    }


    return (
        <Box display={'flex'} rowGap={3} flexDirection={'column'} sx={tokens.classes.formBox}>
            <Typography>{title}</Typography>
            <RadioGroup
                value={radioValue}
                onChange={handleRadioChange}
                sx={{columnGap: 10}}
                row>
                {options && options?.length > 0 && options.map((radio: string, idx: number) => (
                    <FormControlLabel key={`${radio}_${idx}`} value={radio} control={<Radio/>} label={radio}/>
                ))}
            </RadioGroup>
            <DropDown key={radioValue} hasNested={true} options={radios[radioValue]} value={dropDownValue} handleChange={handleDropDownValue} property={property} errorMsg={errorMsg} label={label} error={error} handleError={handleError} />
        </Box>
    )
}

export default DropDownWithRadio;