import {useCallback, useEffect, useState} from "react";
import {Autocomplete, Box, TextField} from "@mui/material";
import MessageVariants from "../../../enums/MessageVariants";
import {useAppContext} from "../../../context";

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

function AutocompleteWithAPI({getPatients, handleOptionChange}) {
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const {handleOpenSnackbar} = useAppContext();

    const fetchOptions = async (query) => {
        setLoading(true);
        try {
            const response = await getPatients(query);
            setOptions(response);
        } catch (error) {
            handleOpenSnackbar('Σφάλμα κατά την φόρτωση δεδομένων', MessageVariants.ERROR)
        } finally {
            setLoading(false);
        }
    };

    const getLabel = (option) => {
        if (option) {
            return option.patronimo ? `${option.name} ${option.surname} του ${option.patronimo}, ΑΜΚΑ: ${option.amka}` : `${option.name} ${option.surname}, ΑΜΚΑ: ${option.amka}`
        } else {
            return null
        }
    }

    const debouncedFetchOptions = useCallback(
        debounce((query) => {
            if (query) {
                fetchOptions(query);
            } else {
                setOptions([]);
            }
        }, 300),
        []
    );

    useEffect(() => {
        debouncedFetchOptions(inputValue);
    }, [inputValue, debouncedFetchOptions]);

    return (
        <Box sx={{ width: '550px', marginTop: 5, marginBottom: 5 }}>
            <Autocomplete
                options={options}
                getOptionLabel={(option) => getLabel(option) || option}
                loading={loading}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                onChange={(event, newValue) => {
                    const newVal = newValue || null
                    handleOptionChange(newVal);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Αναζήτηση"
                        variant="outlined"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? <span>Φόρτωση...</span> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
            />
        </Box>
    );
}

export default AutocompleteWithAPI;
