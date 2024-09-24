import * as React from 'react';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import { useState} from "react";
import {tokens} from "../../styles/tokens";
import {Box} from "@mui/material"
import {CheckCircleOutlined, ErrorOutlined} from "@mui/icons-material";
import dayjs from "dayjs";

function DatePickerWrapper({property, handleChange, value, label, error, handleError}) {
    const [cleared, setCleared] = useState(false);
    const [touched, setTouched] = useState(false);


    const handleDateChange = (value: any) => {
        if (!touched) {
            setTouched(true)
        }
        const newVal = value ? value.toDate() : ''
        handleChange(newVal, property)
        if (!value) {
            handleError(true, property)
        } else {
            handleError(false, property)
        }
    }

    return (
        <Box columnGap={5} sx={{...tokens.classes.formBox, alignItems: 'center'}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    sx={{ width: '350px' }}
                    disablePast={true}
                    label={label}
                    value={value ? dayjs(value) : null}
                    onChange={(newValue) => handleDateChange(newValue)}
                    slotProps={{
                        field: { clearable: true, onClear: () => setCleared(true)},
                        inputAdornment: {sx: {paddingRight: 2}}
                    }}
                />
            </LocalizationProvider>
            {(!error && touched) &&
                <CheckCircleOutlined fontSize={'large'} sx={{color: 'success.light'}}/>}
            {error && <ErrorOutlined fontSize={'large'} sx={{color: 'error.light'}}/>}
        </Box>
    );
}

export default DatePickerWrapper;
