"use client";

import { useState } from "react";
import {
    Button,
    Container,
    Menu,
    MenuItem,
    Paper,
    Stepper,
    Step,
    StepLabel,
    TextField,
    Typography,
    Box,
} from "@mui/material";
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Check as CheckIcon,
} from "@mui/icons-material";
import PageContainer from "../../components/Containers/PageContainer";
import {useRouter} from "next/router";

const stories = [
    {
        id: 1,
        text: "<name> went <activity> at the <location> in the <time>. It was their favorite way to spend time outdoors and stay active.",
        placeholders: {
            name: ["John", "Jane", "Alex", "Sarah"],
            activity: ["running", "swimming", "cycling", "hiking"],
            location: ["park", "beach", "mountains", "gym"],
            time: ["morning", "afternoon", "evening", "night"],
        }
    },
    {
        id: 2,
        text: "Last weekend, <name> decided to try <activity> with friends at the <location>. The <time> weather was perfect for it.",
        placeholders: {
            name: ["John", "Jane", "Alex", "Sarah"],
            activity: ["painting", "photography", "meditation", "yoga"],
            location: ["studio", "garden", "rooftop", "park"],
            time: ["spring", "summer", "autumn", "winter"],
        }
    },
    // Add more stories here...
];

function StoryBuilder() {
    const [activeStep, setActiveStep] = useState(0);
    const [useCustomText, setUseCustomText] = useState(false);
    const [customTexts, setCustomTexts] = useState(stories.map(() => ""));
    const [selections, setSelections] = useState(
        stories.map(story => {
            const initialValues: Record<string, string> = {};
            Object.entries(story.placeholders).forEach(([key, values]) => {
                initialValues[key] = values[0];
            });
            return initialValues;
        })
    );
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [activePlaceholder, setActivePlaceholder] = useState<{field: string, storyIndex: number} | null>(null);

    const router = useRouter();
    const { query } = router;

    const handleClick = (event: React.MouseEvent<HTMLElement>, field: string, storyIndex: number) => {
        setAnchorEl(event.currentTarget);
        setActivePlaceholder({ field, storyIndex });
    };

    const handleClose = () => {
        setAnchorEl(null);
        setActivePlaceholder(null);
    };

    const handleOptionSelect = (option: string) => {
        if (activePlaceholder) {
            setSelections(prev => {
                const newSelections = [...prev];
                newSelections[activePlaceholder.storyIndex] = {
                    ...newSelections[activePlaceholder.storyIndex],
                    [activePlaceholder.field]: option,
                };
                return newSelections;
            });
            handleClose();
        }
    };

    const handleCustomTextChange = (text: string) => {
        setCustomTexts(prev => {
            const newTexts = [...prev];
            newTexts[activeStep] = text;
            return newTexts;
        });
    };

    const renderStoryText = (text: string, placeholders: Record<string, string[]>, storyIndex: number) => {
        let parts = text.split(/(<\w+>)/);
        return (
            <Typography variant="body1" sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                {parts.map((part, index) => {
                    const match = part.match(/<(\w+)>/);
                    if (match) {
                        const field = match[1];
                        return (
                            <Button
                                key={index}
                                variant="outlined"
                                size="small"
                                onClick={(e) => handleClick(e, field, storyIndex)}
                                sx={{
                                    textTransform: 'none',
                                    borderStyle: 'dashed',
                                    minWidth: 'auto',
                                    px: 1,
                                    py: 0.5
                                }}
                            >
                                {selections[storyIndex][field]}
                            </Button>
                        );
                    }
                    return part;
                })}
            </Typography>
        );
    };

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Έκδοση πορίσματος για την εξέταση με κωδικό: { query?.id }
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

            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setUseCustomText(!useCustomText)}
                    >
                        {useCustomText ? "Use Template" : "Write Custom"}
                    </Button>
                </Box>

                {useCustomText ? (
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={customTexts[activeStep]}
                        onChange={(e) => handleCustomTextChange(e.target.value)}
                        placeholder={`Write your own story for step ${activeStep + 1}...`}
                    />
                ) : (
                    <Box sx={{ typography: 'body1' }}>
                        {renderStoryText(
                            stories[activeStep].text,
                            stories[activeStep].placeholders,
                            activeStep
                        )}
                    </Box>
                )}
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    variant="outlined"
                    onClick={() => setActiveStep((prev) => prev - 1)}
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
                        } else {
                            console.log("Final submissions:", {
                                templates: selections,
                                customTexts,
                                useCustomText,
                            });
                        }
                    }}
                    endIcon={activeStep === stories.length - 1 ? <CheckIcon /> : <ChevronRightIcon />}
                >
                    {activeStep === stories.length - 1 ? "Submit" : "Next"}
                </Button>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {activePlaceholder && stories[activePlaceholder.storyIndex].placeholders[activePlaceholder.field].map((option) => (
                    <MenuItem
                        key={option}
                        onClick={() => handleOptionSelect(option)}
                        selected={selections[activePlaceholder.storyIndex][activePlaceholder.field] === option}
                    >
                        {option}
                    </MenuItem>
                ))}
            </Menu>
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
