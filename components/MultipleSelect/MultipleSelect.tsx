import {
    Box,
    Checkbox, ListItemText,
    MenuItem,
    Select,
    Stack, InputLabel, FormHelperText
} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import {InputProps} from "../../types/types";
import {tokens} from "../../styles/tokens";
import {CheckCircleOutlined, ErrorOutlined} from "@mui/icons-material";
import * as React from "react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function MultipleSelect({
                            hasNested,
                            options,
                            value,
                            handleChange,
                            property,
                            errorMsg,
                            label,
                            error,
                            handleError,
                            required,
                            isDepended,
                            dependsOn
                        }: InputProps) {
    const [touched, setTouched] = useState(false);
    useEffect(() => {
        if (!((isDepended && dependsOn) || !Boolean(isDepended))) {
            handleChange('', property)
            handleError(false, property)
        }
    }, [(isDepended && dependsOn) || !Boolean(isDepended)])

    const handleValuesChange = (event: any) => {
        if (required) {
            setTouched(true)
        }
        const {
            target: {value},
        } = event;
        const newVal = value.filter((val) => val !== '')
        handleChange(newVal.join(', '), property)
        if (newVal.length < 1 && required) {
            handleError(true, property)
        } else {
            handleError(false, property)
        }
    };

    const inputVal = useMemo(() => {
        // @ts-ignore
        return value?.length > 0 ? value.split(', ') : []
    }, [value])

    return (
        <>
            {((isDepended && dependsOn) || !Boolean(isDepended)) &&
                <Box sx={hasNested ? tokens.classes.formBoxNested : tokens.classes.formBox}>
                    {options && options?.length > 0 &&
                        <Stack flexDirection={'column'}>
                            <InputLabel sx={{ marginBottom: 2.5}}>{label}</InputLabel>
                            <Stack columnGap={5} direction={'row'} alignItems={'center'}>
                                <Box>
                                    <Select
                                        style={{
                                            width: 550,
                                            wordWrap: 'normal',
                                        }}
                                        multiple
                                        value={inputVal}
                                        onChange={handleValuesChange}
                                        renderValue={(selected) => selected.join(', ')}
                                        MenuProps={MenuProps}
                                    >
                                        {options.map((label) => (
                                            <MenuItem key={label} value={label}>
                                                <Checkbox checked={inputVal.includes(label)}/>
                                                <ListItemText primary={label}/>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                                {(!error && touched) &&
                                    <CheckCircleOutlined fontSize={'large'} sx={{color: 'success.light'}}/>}
                                {error && <ErrorOutlined fontSize={'large'} sx={{color: 'error.light'}}/>}
                            </Stack>
                            {error && <FormHelperText error sx={{ fontSize: '0.9rem' }}>{errorMsg}</FormHelperText>}
                        </Stack>
                    }
                </Box>
            }
        </>
    )
}

export default MultipleSelect;
