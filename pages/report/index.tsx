import { useState } from "react";
import {
    Box,
    Button,
    Container,
    Divider,
    FormControl,
    FormControlLabel,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
} from "@mui/material";
import {
    Check as CheckIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";

const stories = [
    {
        id: 1,
        title: "Γενική περιγραφή",
        texts: [
            "Το διάγραμμα έχει καλή οργάνωση.",
            "Το διάγραμμα είναι δύσκολο να διαβαστεί.",
            "Το διάγραμμα δεν περιλαμβάνει αρκετά στοιχεία.",
        ],
        placeholders: null,
    },
    {
        id: 2,
        title: "Οπίσθιες δραστηριότητες",
        texts: [
            "Last weekend, <name> decided to try <activity> with friends at the <location>. The <time> weather was perfect for it.",
            "<name> loves spending time doing <activity> at the <location>.",
            "The <time> was ideal for <name> to engage in <activity> at the <location>.",
        ],
        placeholders: {
            name: ["John", "Jane", "Alex", "Sarah"],
            activity: ["painting", "photography", "meditation", "yoga"],
            location: ["studio", "garden", "rooftop", "park"],
            time: ["spring", "summer", "autumn", "winter"],
        },
    },
];

interface TextWithPlaceholdersProps {
    text: string;
    textIndex: number;
    placeholders: Record<string, string[]>;
    values: Record<string, Record<string, string>>;
    onChange: (textIndex: number, key: string, value: string) => void;
}

function TextWithPlaceholders({ text, textIndex, placeholders, values, onChange }: TextWithPlaceholdersProps) {
    const parts = text.split(/(<[^>]+>)/);
    const textValues = values[textIndex] || {};

    return (
        <Box sx={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
            {parts.map((part, index) => {
                const match = part.match(/<([^>]+)>/);
                if (match) {
                    const key = match[1];
                    const options = placeholders[key];
                    if (options) {
                        return (
                            <FormControl key={index} size="small" sx={{ minWidth: 100, gap: 1 }}>
                                <Select
                                    value={textValues[key] || ""}
                                    onChange={(e) => onChange(textIndex, key, e.target.value)}
                                    displayEmpty
                                >
                                    <MenuItem value="">Select {key}</MenuItem>
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

export default function StoryBuilder() {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedStoryTexts, setSelectedStoryTexts] = useState<string[]>(
        stories.map(() => "")
    );
    const [useCustomText, setUseCustomText] = useState(false);
    const [customTexts, setCustomTexts] = useState(stories.map(() => ""));
    const [placeholderValues, setPlaceholderValues] = useState<Record<number, Record<string, string>>>({});

    const currentStory = stories[activeStep];

    const handleStoryTextSelection = (event: React.ChangeEvent<HTMLInputElement>, storyIndex: number) => {
        const selectedTextIndex = Number(event.target.value);
        setSelectedStoryTexts((prev) => {
            const newTexts = [...prev];
            newTexts[storyIndex] = stories[storyIndex].texts[selectedTextIndex];
            return newTexts;
        });
    };

    const handleCustomTextToggle = () => {
        setUseCustomText((prev) => !prev);
    };

    const handleCustomTextChange = (text: string) => {
        setCustomTexts((prev) => {
            const newTexts = [...prev];
            newTexts[activeStep] = text;
            return newTexts;
        });

        setSelectedStoryTexts((prev) => {
            const newTexts = [...prev];
            newTexts[activeStep] = text;
            return newTexts;
        });
    };

    const handlePlaceholderChange = (textIndex: number, key: string, value: string) => {
        setPlaceholderValues(prev => ({
            ...prev,
            [textIndex]: {
                ...(prev[textIndex] || {}),
                [key]: value
            }
        }));
    };

    const renderStoryTextSelection = (storyIndex: number) => {
        const story = stories[storyIndex];
        return (
            <RadioGroup
                value={stories[storyIndex].texts.indexOf(selectedStoryTexts[storyIndex])}
                onChange={(e) => handleStoryTextSelection(e, storyIndex)}
            >
                {story.texts.map((text, textIndex) => (
                    <FormControlLabel
                        key={textIndex}
                        value={textIndex}
                        control={<Radio />}
                        label={
                            story.placeholders ? (
                                <TextWithPlaceholders
                                    text={text}
                                    textIndex={textIndex}
                                    placeholders={story.placeholders}
                                    values={placeholderValues}
                                    onChange={handlePlaceholderChange}
                                />
                            ) : (
                                text
                            )
                        }
                        sx={{
                            padding: 2,
                            alignItems: 'center',
                            columnGap: 2,
                            '.MuiFormControlLabel-label': {
                                pt: 1
                            }
                        }}
                    />
                ))}
            </RadioGroup>
        );
    };

    const getProcessedText = (text: string) => {
        if (!currentStory.placeholders) return text;

        const selectedTextIndex = stories[activeStep].texts.indexOf(text);
        const textValues = placeholderValues[selectedTextIndex] || {};

        let processedText = text;
        Object.entries(currentStory.placeholders).forEach(([key, _]) => {
            const placeholder = `<${key}>`;
            const value = textValues[key] || placeholder;
            processedText = processedText.replace(placeholder, value);
        });
        return processedText;
    };

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Box sx={{ textAlign: "center", mb: 6 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Story Builder
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Step {activeStep + 1} of {stories.length}
                </Typography>
            </Box>

            <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
                {stories.map((_, index) => (
                    <Step key={index}>
                        <StepLabel></StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Typography variant="h5" sx={{ mb: 3 }}>
                {`${activeStep + 1}. ${currentStory.title}`}
            </Typography>

            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
                    <Button variant="outlined" onClick={handleCustomTextToggle}>
                        {useCustomText ? "Use Template" : "Custom Text"}
                    </Button>
                </Box>

                {useCustomText ? (
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={customTexts[activeStep]}
                        onChange={(e) => handleCustomTextChange(e.target.value)}
                        placeholder="Write your text here..."
                    />
                ) : (
                    <Box>
                        {renderStoryTextSelection(activeStep)}
                    </Box>
                )}

                <Divider sx={{ my: 3 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                    Selected Text:
                </Typography>
                <Typography sx={{ mt: 1, whiteSpace: "pre-line" }}>
                    {getProcessedText(selectedStoryTexts[activeStep]) || "No selection made"}
                </Typography>
            </Paper>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                    variant="outlined"
                    onClick={() => {
                        setActiveStep((prev) => prev - 1);
                        setUseCustomText(false);
                    }}
                    disabled={activeStep === 0}
                    startIcon={<ChevronLeftIcon />}
                >
                    Previous
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        if (activeStep < stories.length - 1) {
                            setActiveStep((prev) => prev + 1);
                            setUseCustomText(false);
                        } else {
                            console.log("Final selections:", {
                                selectedStoryTexts,
                                customTexts,
                                useCustomText,
                                placeholderValues,
                            });
                        }
                    }}
                    endIcon={activeStep === stories.length - 1 ? <CheckIcon /> : <ChevronRightIcon />}
                >
                    {activeStep === stories.length - 1 ? "Submit" : "Next"}
                </Button>
            </Box>
        </Container>
    );
}
