import {Autocomplete, Box, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";

const MULTI_VALUE_SEP = ", ";

type PlaceholderEntry = { values: string[]; allowFreeText?: boolean; multiple?: boolean };

interface TextWithPlaceholdersProps {
    text: string;
    textIndex: number;
    placeholders: Record<string, string[] | PlaceholderEntry>;
    values: Record<number, Record<string, string>>;
    onChange: (textIndex: number, key: string, value: string) => void;
}

function getOptions(entry: string[] | PlaceholderEntry | undefined): string[] {
    if (!entry) return [];
    return Array.isArray(entry) ? entry : (entry.values || []);
}

function getAllowFreeText(entry: string[] | PlaceholderEntry | undefined): boolean {
    if (!entry || Array.isArray(entry)) return false;
    return entry.allowFreeText === true;
}

function getMultiple(entry: string[] | PlaceholderEntry | undefined): boolean {
    if (!entry || Array.isArray(entry)) return false;
    return entry.multiple === true;
}

function parseMultiValue(stored: string): string[] {
    if (!stored || !stored.trim()) return [];
    return stored.split(MULTI_VALUE_SEP).map((s) => s.trim()).filter(Boolean);
}

function formatMultiValue(arr: string[]): string {
    return arr.join(MULTI_VALUE_SEP);
}

function TextWithPlaceholders({text, textIndex, placeholders, values, onChange}: TextWithPlaceholdersProps) {
    const parts = text.split(/(<[^>]+>)/);
    const textValues = values[textIndex] || {};

    return (
        <Box sx={{display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: 1}}>
            {parts.map((part, index) => {
                const match = part.match(/<([^>]+)>/);
                if (match) {
                    const rawKey = match[1];
                    const normalizedKey = rawKey.trim().replace(/\s+/g, "");
                    const entry = placeholders[normalizedKey];
                    const options = getOptions(entry);
                    const allowFreeText = getAllowFreeText(entry);
                    const multiple = getMultiple(entry);
                    if (options.length > 0 || allowFreeText) {
                        const value = textValues[normalizedKey] || "";
                        if (multiple) {
                            const selected = parseMultiValue(value);
                            return (
                                <Autocomplete
                                    key={index}
                                    multiple
                                    options={options}
                                    value={selected}
                                    onChange={(_, newValue) => onChange(textIndex, normalizedKey, formatMultiValue(newValue as string[]))}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            size="small"
                                            label="Επιλογή"
                                            sx={{minWidth: 200}}
                                        />
                                    )}
                                    sx={{minWidth: 200}}
                                />
                            );
                        }
                        if (allowFreeText) {
                            return (
                                <Autocomplete
                                    key={index}
                                    freeSolo
                                    options={options}
                                    value={value}
                                    onChange={(_, newValue) => onChange(textIndex, normalizedKey, (newValue ?? "") as string)}
                                    onInputChange={(_, newInputValue) => onChange(textIndex, normalizedKey, newInputValue)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            size="small"
                                            label="Επιλογή"
                                            sx={{minWidth: 180}}
                                        />
                                    )}
                                    sx={{minWidth: 180}}
                                />
                            );
                        }
                        return (
                            <FormControl key={index} size="small" sx={{minWidth: 120, gap: 1}}>
                                <InputLabel id={`label_${index}`}>Επιλογή</InputLabel>
                                <Select
                                    label={'Επιλογή'}
                                    value={value}
                                    onChange={(e) => onChange(textIndex, normalizedKey, e.target.value as string)}
                                    sx={{
                                        "& .MuiSelect-select": {
                                            textWrap: 'wrap'
                                        }
                                    }}
                                >
                                    {options.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        );
                    }
                }
                return <span key={index}>{part}</span>;
            })}
        </Box>
    );
}

export default TextWithPlaceholders;
