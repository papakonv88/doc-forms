import {Box, FormControl, InputLabel, MenuItem, Select} from "@mui/material";

interface TextWithPlaceholdersProps {
    text: string;
    textIndex: number;
    placeholders: Record<string, string[]>;
    values: Record<string, Record<string, string>>;
    onChange: (textIndex: number, key: string, value: string) => void;
}
function TextWithPlaceholders({text, textIndex, placeholders, values, onChange}: TextWithPlaceholdersProps) {
    const parts = text.split(/(<[^>]+>)/);
    const textValues = values[textIndex] || {};

    return (
        <Box sx={{display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: 1}}>
            {parts.map((part, index) => {
                const match = part.match(/<([^>]+)>/);
                if (match) {
                    const key = match[1];
                    const options = placeholders[key];
                    if (options) {
                        return (
                            <FormControl key={index} size="small" sx={{minWidth: 120, gap: 1}}>
                                <InputLabel id={`label_${index}`}>Επιλογή</InputLabel>
                                <Select
                                    label={'Επιλογή'}
                                    value={textValues[key] || ""}
                                    onChange={(e) => onChange(textIndex, key, e.target.value)}
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
