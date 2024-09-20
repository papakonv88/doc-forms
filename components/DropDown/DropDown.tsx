import {Autocomplete, Box, InputAdornment, TextField} from "@mui/material";
import {useState} from "react";
import {InputProps} from "../../types/types";
import {CheckCircleOutlined, ErrorOutlined} from "@mui/icons-material";
import {tokens} from "../../styles/tokens";

function DropDown({
                      hasNested,
                      options,
                      value,
                      handleChange,
                      property,
                      errorMsg,
                      label,
                      error,
                      handleError
                  }: InputProps) {
    const [inputValue, setInputValue] = useState('');
    const [touched, setTouched] = useState(false);

    return (
        <Box sx={hasNested ? tokens.classes.formBoxNested : tokens.classes.formBox}>
            {options && options?.length > 0 &&
                <Autocomplete
                    // @ts-ignore
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    value={value as string}
                    onChange={(event, newValue) => {
                        setTouched(true)
                        const newVal = newValue || ''
                        handleChange(newVal, property)
                        if (!newVal) {
                            handleError(true, property)
                        } else {
                            handleError(false, property)
                        }
                    }}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                    }}
                    options={options}
                    sx={{width: 'calc(100% - 80px)'}}
                    renderInput={(params) => <TextField {...params} label={label} variant="standard"
                                                        required
                                                        error={error}
                                                        helperText={error ? errorMsg : ""}
                                                        FormHelperTextProps={{
                                                            sx: {
                                                                fontSize: '0.9rem'
                                                            },
                                                        }}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            endAdornment: (
                                                                <InputAdornment position="end"
                                                                                sx={{position: 'absolute', right: -60}}>
                                                                    {(!error && touched) &&
                                                                        <CheckCircleOutlined fontSize={'large'}
                                                                                             sx={{color: 'success.light'}}/>}
                                                                    {(error) &&
                                                                        <ErrorOutlined fontSize={'large'}
                                                                                       sx={{color: 'error.light'}}/>}
                                                                </InputAdornment>
                                                            ),
                                                        }}
                    />
                    }
                />
            }
        </Box>
    )
}

export default DropDown;
