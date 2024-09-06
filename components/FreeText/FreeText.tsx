import {Box, InputAdornment, TextField} from "@mui/material";
import {CheckCircleOutlined, ErrorOutlined} from "@mui/icons-material";
import {InputProps} from "../../types/types";
import {SyntheticEvent, useState} from "react";
import {tokens} from "../../styles/tokens";

function FreeText({hasNested, property, handleChange, value, label, errorMsg, validator, error, handleError}: InputProps) {

    const [touched, setTouched] = useState(false);

    const valueValidator = validator ? new RegExp(validator) : '';

    const handleValueChange = (e: SyntheticEvent) => {
        if (!touched) {
            setTouched(true)
        }
        // @ts-ignore
        const newValue = e?.target?.value as any;
        handleChange(newValue, property)

        console.log(valueValidator, 'validator')


        if (validator && valueValidator) {
            if (!valueValidator.test(newValue)) {
                handleError(true, property)
            } else {
                console.log('no error')
                handleError(false, property)
            }
        }
    }

    return (
        <Box sx={hasNested ? tokens.classes.formBoxNested : tokens.classes.formBox}>
            <TextField
                key={`${property}_field`}
                required
                sx={{width: '100%'}}
                label={label}
                variant={'standard'}
                InputLabelProps={{
                    sx: {width: '100%'}
                }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end" sx={{position: 'absolute', right: -60}}>
                            {(!error && touched) &&
                                <CheckCircleOutlined fontSize={'large'} sx={{color: 'success.light'}}/>}
                            {(error && touched) && <ErrorOutlined fontSize={'large'} sx={{color: 'error.light'}}/>}
                        </InputAdornment>
                    ),
                }}
                value={value}
                onChange={handleValueChange}
                error={error}
                helperText={error ? errorMsg : ""}
                FormHelperTextProps={{
                    sx: {
                        fontSize: '0.9rem'
                    },
                }}
            />
        </Box>
    )
}

export default FreeText;