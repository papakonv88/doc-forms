import {useCallback, useEffect, useState} from "react";
import {Autocomplete, TextField} from "@mui/material";

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

function AutocompleteWithAPI({getPatients, retrievePatient}) {
    const [options, setOptions] = useState([]);  // Store fetched options
    const [inputValue, setInputValue] = useState('');  // Current input value
    const [loading, setLoading] = useState(false);  // Loading state for the API request

    const fetchOptions = async (query) => {
        setLoading(true);
        try {
            const response = await getPatients(query);
            console.log(response, 'response')
            setOptions(response);
        } catch (error) {
            console.error('Error fetching data:', error);
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
        <Autocomplete
            options={options}
            getOptionLabel={(option) => getLabel(option) || option}  // Customize based on your API response structure
            loading={loading}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            onChange={(event, newValue) => {
                const newVal = newValue || ''
                retrievePatient(newVal);
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
    );
}

export default AutocompleteWithAPI;
