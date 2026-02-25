import {Box, IconButton, Stack, TextField, Typography} from "@mui/material";
import {AddCircleOutline, RemoveCircleOutline} from "@mui/icons-material";
import Autocomplete from "@mui/material/Autocomplete";
import {useState} from "react";
import {InputProps} from "../../types/types";
import {tokens} from "../../styles/tokens";

interface MedicationEntry {
    medicine: string;
    dose: string;
}

type MedicationListProps = InputProps & {
    value?: string;
    options?: string[];
};

function parseValueToEntries(value?: string): MedicationEntry[] {
    if (!value) {
        return [{medicine: "", dose: ""}];
    }

    const lines = value.split("\n").filter(line => line.trim().length > 0);
    if (lines.length === 0) {
        return [{medicine: "", dose: ""}];
    }

    const regex = /^Φάρμακο\s+\d+:\s*(.*?)\s+—\s*Δόση:\s*(.*)$/;

    const entries: MedicationEntry[] = lines.map((line) => {
        const match = line.match(regex);
        if (match) {
            return {
                medicine: match[1] || "",
                dose: match[2] || "",
            };
        }

        return {
            medicine: line.trim(),
            dose: "",
        };
    });

    return entries.slice(0, 5);
}

function formatEntries(entries: MedicationEntry[]): string {
    const nonEmpty = entries
        .map(e => ({
            medicine: e.medicine.trim(),
            dose: e.dose.trim()
        }))
        .filter(e => e.medicine || e.dose);

    if (nonEmpty.length === 0) {
        return "";
    }

    return nonEmpty
        .map((e, idx) => `Φάρμακο ${idx + 1}: ${e.medicine} — Δόση: ${e.dose}`)
        .join("\n");
}

function validateEntries(entries: MedicationEntry[], required?: boolean): boolean {
    if (!required) {
        return false;
    }

    const nonEmpty = entries.filter(e => e.medicine.trim() || e.dose.trim());

    if (nonEmpty.length === 0) {
        return true;
    }

    return nonEmpty.some(e => !e.medicine.trim() || !e.dose.trim());
}

function MedicationList({
                            options = [],
                            property,
                            handleChange,
                            value,
                            label,
                            errorMsg,
                            error,
                            handleError,
                            required
                        }: MedicationListProps) {
    const [entries, setEntries] = useState<MedicationEntry[]>(() => parseValueToEntries(value as string));

    const sync = (nextEntries: MedicationEntry[]) => {
        const formatted = formatEntries(nextEntries);
        // Αν το formatted string είναι ίδιο με αυτό που έχει ήδη ο γονέας, μην πυροδοτείς νέο update
        if (formatted === (value as string)) {
            const hasErrorSame = validateEntries(nextEntries, required);
            handleError(hasErrorSame, property);
            return;
        }
        // @ts-ignore
        handleChange(formatted, property);
        const hasError = validateEntries(nextEntries, required);
        handleError(hasError, property);
    };

    const updateEntry = (index: number, partial: Partial<MedicationEntry>) => {
        setEntries(prev => {
            const next = prev.map((e, i) => i === index ? {...e, ...partial} : e);
            sync(next);
            return next;
        });
    };

    const addEntry = () => {
        setEntries(prev => {
            if (prev.length >= 5) {
                return prev;
            }
            const next = [...prev, {medicine: "", dose: ""}];
            sync(next);
            return next;
        });
    };

    const removeEntry = (index: number) => {
        setEntries(prev => {
            let next = prev.filter((_, i) => i !== index);
            if (next.length === 0) {
                next = [{medicine: "", dose: ""}];
            }
            sync(next);
            return next;
        });
    };

    return (
        <Box sx={tokens.classes.formBox}>
            <Stack spacing={2} width={"100%"}>
                <Typography>{label}</Typography>
                {entries.map((entry, idx) => (
                    <Box key={idx} display="flex" alignItems="flex-end" columnGap={2}>
                        <Autocomplete
                            freeSolo
                            options={options}
                            value={entry.medicine}
                            sx={{flex: 1}}
                            onChange={(event, newValue) => {
                                const val = (newValue || "") as string;
                                updateEntry(idx, {medicine: val});
                            }}
                            onInputChange={(event, newInputValue) => {
                                updateEntry(idx, {medicine: newInputValue});
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    label="Φάρμακο"
                                />
                            )}
                        />
                        <TextField
                            variant="standard"
                            label="Δόση"
                            value={entry.dose}
                            onChange={(e) => updateEntry(idx, {dose: e.target.value})}
                            sx={{flex: 1}}
                        />
                        <IconButton
                            color="primary"
                            onClick={addEntry}
                            disabled={entries.length >= 5}
                            aria-label="Προσθήκη"
                        >
                            <AddCircleOutline/>
                        </IconButton>
                        <IconButton
                            color="error"
                            onClick={() => removeEntry(idx)}
                            aria-label="Αφαίρεση"
                            disabled={entries.length === 1 && !entry.medicine && !entry.dose}
                        >
                            <RemoveCircleOutline/>
                        </IconButton>
                    </Box>
                ))}
                {error && errorMsg && (
                    <Typography variant="caption" color="error">
                        {errorMsg}
                    </Typography>
                )}
            </Stack>
        </Box>
    );
}

export default MedicationList;

