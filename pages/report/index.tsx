"use client";

import { useState } from "react";
import {
    Box,
    Button,
    Container,
    Divider,
    FormControlLabel,
    Menu,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
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
import PageContainer from "../../components/Containers/PageContainer";
import { useRouter } from "next/router";
import { validateText } from "../../utils";

const stories = [
    {
        id: 1,
        title: "Γενική περιγραφή",
        texts: [
            "Το διάγραμμα έχει καλή οργάνωση.",
            "Το διάγραμμα είναι δύσκολο να διαβαστεί.",
            "Το διάγραμμα δεν περιλαμβάνει αρκετά στοιχεία.",
        ],
        placeholders: null, // No placeholders needed in this example
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

function StoryBuilder() {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedStoryTexts, setSelectedStoryTexts] = useState<string[]>(stories.map(() => ""));
    const [useCustomText, setUseCustomText] = useState(false);
    const [customTexts, setCustomTexts] = useState(stories.map(() => ""));

    const router = useRouter();
    const { query } = router;

    // Handle selection of a text option within a story
    const handleStoryTextSelection = (event: React.ChangeEvent<HTMLInputElement>, storyIndex: number) => {
        const selectedTextIndex = Number(event.target.value);
        setSelectedStoryTexts(prev => {
            const newTexts = [...prev];
            newTexts[storyIndex] = stories[storyIndex].texts[selectedTextIndex]; // Store selected text
            return newTexts;
        });
    };

    // Toggle between template selection and custom text mode
    const handleCustomTextToggle = () => {
        setUseCustomText(prev => {
            const newState = !prev;
            if (newState) {
                setSelectedStoryTexts(prev => {
                    const newTexts = [...prev];
                    newTexts[activeStep] = ""; // Clear selection when switching to custom
                    return newTexts;
                });
                setCustomTexts(prev => {
                    const newTexts = [...prev];
                    newTexts[activeStep] = ""; // Clear custom text
                    return newTexts;
                });
            }
            return newState;
        });
    };

    // Handle custom text input
    const handleCustomTextChange = (text: string) => {
        setCustomTexts(prev => {
            const newTexts = [...prev];
            newTexts[activeStep] = text;
            return newTexts;
        });

        setSelectedStoryTexts(prev => {
            const newTexts = [...prev];
            newTexts[activeStep] = text; // Save custom text as selected
            return newTexts;
        });
    };

    // Render story text selection (radio buttons)
    const renderStoryTextSelection = (storyIndex: number) => {
        return (
            <RadioGroup
                value={stories[storyIndex].texts.indexOf(selectedStoryTexts[storyIndex])}
                onChange={(e) => handleStoryTextSelection(e, storyIndex)}
            >
                {stories[storyIndex].texts.map((text, textIndex) => (
                    <FormControlLabel
                        key={textIndex}
                        value={textIndex}
                        control={<Radio />}
                        label={text}
                    />
                ))}
            </RadioGroup>
        );
    };

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Box sx={{ textAlign: "center", mb: 6 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Έκδοση πορίσματος για την εξέταση με κωδικό:{" "}
                    <Typography
                        sx={{
                            cursor: "pointer",
                            display: "inline",
                            fontWeight: "bold",
                            fontSize: "inherit",
                            color: "text.primary",
                            transition: "color 0.2s ease-in-out",
                            "&:hover": {
                                color: "primary.main",
                            },
                        }}
                        onClick={() => window.open(`/exams/${query?.id}`, "_blank")}
                    >
                        {validateText(query?.id)}
                    </Typography>
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Βήμα {activeStep + 1} από {stories.length}
                </Typography>
            </Box>

            <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
                {stories.map((_, index) => (
                    <Step key={index}>
                        <StepLabel></StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Typography sx={{ marginBottom: 3 }} variant="h5">
                {`${activeStep + 1}. ${stories[activeStep].title}`}
            </Typography>

            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
                    <Button variant="outlined" onClick={handleCustomTextToggle}>
                        {useCustomText ? "Επιλογές" : "Ελεύθερο Κείμενο"}
                    </Button>
                </Box>

                {useCustomText ? (
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={customTexts[activeStep]}
                        onChange={(e) => handleCustomTextChange(e.target.value)}
                        placeholder={`Γράψτε το κείμενό σας εδώ...`}
                    />
                ) : (
                    <Box sx={{ typography: "body1" }}>{renderStoryTextSelection(activeStep)}</Box>
                )}

                <Divider sx={{ padding: "10px 0" }} />
                <Typography variant="body1" sx={{ mt: 1, whiteSpace: "pre-line", fontWeight: "bold" }}>
                    Επιλεγμένο κείμενο: {selectedStoryTexts[activeStep] || "Δεν έχετε κάνει κάποια επιλογή"}
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
                    Προηγούμενο
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
                            });
                        }
                    }}
                    endIcon={activeStep === stories.length - 1 ? <CheckIcon /> : <ChevronRightIcon />}
                >
                    {activeStep === stories.length - 1 ? "Καταχώρηση" : "Επόμενο"}
                </Button>
            </Box>
        </Container>
    );
}

export default function Page() {
    return (
        <PageContainer>
            <StoryBuilder />
        </PageContainer>
    );
}
