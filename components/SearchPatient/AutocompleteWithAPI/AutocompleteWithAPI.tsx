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

function AutocompleteWithAPI ({ getPatients }) {
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

    const debouncedFetchOptions = useCallback(
        debounce((query) => {
            if (query) {
                fetchOptions(query);
            } else {
                setOptions([]);
            }
        }, 300),  // 500ms debounce
        []
    );

    useEffect(() => {
        debouncedFetchOptions(inputValue);
    }, [inputValue, debouncedFetchOptions]);

    return (
        <Autocomplete
            options={options}
            getOptionLabel={(option) => option.name || option}  // Customize based on your API response structure
            loading={loading}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Search"
                    variant="outlined"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <span>Loading...</span> : null}
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
