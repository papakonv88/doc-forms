import {useCallback, useMemo, useState} from "react";
import {
    Box,
    Button,
    Divider,
    Paper,
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
import {validateText} from "../../utils";
import {useRouter} from "next/router";
import Settings from "../../settings.json";
import RenderSelection from "../../components/RenderSelection/RenderSelection";
import PageContainer from "../../components/Containers/PageContainer";
import SectionContainer from "../../components/Containers/SectionContainer/SectionContainer";
import {useAppContext} from "../../context";
import MessageVariants from "../../enums/MessageVariants";

function ReportBuilder() {
    const report = useMemo(() => {
        // Expand each story with "sections" into distinct sub-steps,
        // so that every section becomes its own step with its own title and texts,
        // while keeping metadata so we can show "sub-step" info in the UI.
        const expanded: any[] = [];

        for (const story of Settings.doctor.report as any[]) {
            const hasSections = Array.isArray(story.sections) && story.sections.length > 0;
            const hasDirectTexts = Array.isArray(story.texts) && story.texts.length > 0;

            if (hasSections) {
                const totalSections = story.sections.length;
                story.sections.forEach((section: any, idx: number) => {
                    expanded.push({
                        // inherit base story fields that might be useful
                        ...story,
                        // override step-specific fields from section
                        baseTitle: story.title,
                        sectionTitle: section.title ?? story.title,
                        sectionIndex: idx,
                        totalSections,
                        title: section.title ?? story.title,
                        texts: section.texts ?? [],
                        placeholders: section.placeholders ?? story.placeholders ?? [],
                    });
                });
            } else if (hasDirectTexts) {
                expanded.push(story);
            } else {
                // Fallback: push story as-is even if no texts, to avoid losing steps
                expanded.push(story);
            }
        }

        return expanded;
    }, []);
    const {handleOpenSnackbar} = useAppContext();
    const [activeStep, setActiveStep] = useState(0);
    // Allow multiple selections per step: array of arrays of selected texts
    const [selectedStoryTexts, setSelectedStoryTexts] = useState<string[][]>(
        report.map(() => [])
    );
    const [useCustomText, setUseCustomText] = useState(false);
    const [customTexts, setCustomTexts] = useState(report.map(() => ""));
    const [placeholderValues, setPlaceholderValues] = useState<Record<number, Record<string, string>>>({});
    const [finalSelection, setFinalSelection] = useState([])

    const currentStory = report[activeStep];

    // Build dynamic styles for Stepper to show dotted connectors between sub-steps
    const subStepConnectorStyles = useMemo(() => {
        const styles: Record<string, any> = {};

        report.forEach((item: any, index: number) => {
            if (index === 0) return;
            const currentIsSub = !!item.baseTitle;
            const prev = report[index - 1] as any;
            const prevIsSameGroup = !!prev?.baseTitle && prev.baseTitle === item.baseTitle;

            // Connector index corresponds to the step after the connector,
            // so we target nth-of-type(index) for the connector between prev and current.
            if (currentIsSub && prevIsSameGroup) {
                const selector = `& .MuiStepConnector-root:nth-of-type(${index}) .MuiStepConnector-line`;
                styles[selector] = {
                    borderTopStyle: 'dotted',
                };
            }
        });

        return styles;
    }, [report]);


    console.log(selectedStoryTexts, 'selected store texts')


    const router = useRouter();
    const {query} = router;

    const handleStoryTextSelection = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>, storyIndex: number, textIndex: number, isMulti: boolean) => {
            const text = report[storyIndex].texts[textIndex];

            // When user selects an option, clear any free-text for this step
            setCustomTexts((prev) => {
                const newTexts = [...prev];
                newTexts[storyIndex] = "";
                return newTexts;
            });

            setSelectedStoryTexts((prev) => {
                const newSelections = [...prev];
                const currentSelections = newSelections[storyIndex] || [];

                // Keep only selections that are valid predefined texts for this step
                const validTextsForStep = report[storyIndex].texts;
                const baseSelections = currentSelections.filter((t) =>
                    validTextsForStep.includes(t)
                );

                if (isMulti) {
                    // Multi-select: toggle selection among predefined texts only
                    if (baseSelections.includes(text)) {
                        newSelections[storyIndex] = baseSelections.filter((t) => t !== text);
                    } else {
                        newSelections[storyIndex] = [...baseSelections, text];
                    }
                } else {
                    // Single-select: replace with just this text
                    newSelections[storyIndex] = [text];
                }

                return newSelections;
            });
        },
        [report]
    );

    const handleCustomTextToggle = () => {
        // Simple toggle: keep any existing free-text content,
        // so user can return to it later if they want.
        setUseCustomText((prev) => !prev);
    };

    const handleCustomTextChange = useCallback((text: string) => {
        setCustomTexts((prev) => {
            const newTexts = [...prev];
            newTexts[activeStep] = text;
            return newTexts;
        });

        // For custom text, we keep selectedStoryTexts entry as a single-element array
        setSelectedStoryTexts((prev) => {
            const newTexts = [...prev];
            newTexts[activeStep] = text ? [text] : [];
            return newTexts;
        });
    }, [activeStep]);

    const handlePlaceholderChange = (textIndex: number, key: string, value: string) => {
        setPlaceholderValues(prev => ({
            ...prev,
            [textIndex]: {
                ...(prev[textIndex] || {}),
                [key]: value
            }
        }));
    };

    const updateFinalSelection = (text) => {
        const finalSelectionCp = [...finalSelection]
        finalSelectionCp[activeStep] = text || customTexts[activeStep]
        setFinalSelection(finalSelectionCp)
    }

    const handleNextStep = () => {
        const currentSelections = selectedStoryTexts[activeStep] as any;
        const combinedSelectedText = Array.isArray(currentSelections)
            ? currentSelections.join("\n")
            : (currentSelections || "");
        const text = getProcessedText(combinedSelectedText);
        const regex = /\.\.\.\.\.\./;
        const isMatch = regex.test(text);
        if (isMatch && selectedStoryTexts[activeStep]) {
            handleOpenSnackbar('Συμπληρώστε τα απαιτούμενα πεδία ή επιλέξτε ελεύθερο κείμενο για να προχωρήσετε', MessageVariants.ERROR)
            return;
        }
        updateFinalSelection(text)
        if (activeStep < report.length - 1) {
            setActiveStep((prev) => prev + 1);
            setUseCustomText(false);
        }
    };




    const getProcessedText = (rawText: string) => {
        if (!currentStory.placeholders) return rawText;

        // Normalize placeholders list into a map for consistent key lookup
        let placeholderMap: Record<string, string[]> = {};
        if (Array.isArray(currentStory.placeholders)) {
            for (const p of currentStory.placeholders) {
                const k = String(p?.title || "").replace(/\s+/g, "");
                placeholderMap[k] = p?.values || [];
            }
        } else {
            placeholderMap = currentStory.placeholders as any;
        }

        // When multiple templates are selected, rawText is a join of them.
        // We process each original template separately (by index) using its own placeholderValues,
        // then join them back together.
        const segments = rawText.split("\n").filter(Boolean);

        const processedSegments = segments.map((segment) => {
            const selectedTextIndex = report[activeStep].texts.indexOf(segment);
            const textValues = placeholderValues[selectedTextIndex] || {};

            return String(segment).replace(/<[^>]+>/g, (token) => {
                const rawKey = token.slice(1, -1);
                const normalizedKey = rawKey.trim().replace(/\s+/g, "");
                const value = textValues[normalizedKey] || "......";
                return placeholderMap[normalizedKey] ? value : token;
            });
        });

        return processedSegments.join("\n");
    };

    return (
        <PageContainer>
            <SectionContainer pb={12}>
                <Box sx={{textAlign: "center", my: 6}}>
                    <Typography variant="h6" gutterBottom>
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
                        Βήμα {activeStep + 1} από {report.length}
                    </Typography>
                    {currentStory.baseTitle && (
                        <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            sx={{mt: 1}}
                        >
                            Υποβήμα {currentStory.sectionIndex + 1} από {currentStory.totalSections} στην ενότητα:{" "}
                            <strong>{currentStory.baseTitle}</strong>
                        </Typography>
                    )}
                </Box>

                <Stepper
                    activeStep={activeStep}
                    sx={{
                        mb: 6,
                        '& .MuiStepConnector-line': {
                            borderTopStyle: 'solid',
                        },
                        ...subStepConnectorStyles,
                    }}
                >
                    {report.map((storyItem: any, index) => (
                        <Step key={index}>
                            <StepLabel>
                                {index + 1}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Typography variant="h6" sx={{mb: 1}}>
                    {currentStory.baseTitle || currentStory.title}
                </Typography>
                {currentStory.baseTitle && (
                    <Typography variant="subtitle1" sx={{mb: 3}}>
                        {currentStory.sectionTitle}
                    </Typography>
                )}

                <Paper elevation={3} sx={{p: 4, mb: 4}}>
                    {useCustomText ? (
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            value={customTexts[activeStep]}
                            onChange={(e) => handleCustomTextChange(e.target.value)}
                            placeholder="Γράψτε το κείμενο σας εδώ..."
                        />
                    ) : (
                        <Box>
                            <RenderSelection story={report[activeStep]} index={activeStep}
                                             selectedStoryTexts={selectedStoryTexts}
                                             handlePlaceholderChange={handlePlaceholderChange}
                                             handleStoryTextSelection={handleStoryTextSelection}
                                             placeholderValues={placeholderValues}
                                             isMulti={activeStep !== 0}/>
                        </Box>
                    )}

                    <Divider sx={{my: 3}}/>
                    <Typography variant="subtitle1" sx={{fontWeight: "medium"}}>
                        Επιλεγμένο κείμενο:
                    </Typography>
                    <Typography sx={{mt: 1, whiteSpace: "pre-line"}}>
                        {(() => {
                            const currentSelections = selectedStoryTexts[activeStep] as any;
                            const combinedSelectedText = Array.isArray(currentSelections)
                                ? currentSelections.join("\n")
                                : (currentSelections || "");
                            return getProcessedText(combinedSelectedText) || "-";
                        })()}
                    </Typography>
                </Paper>

                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2}}>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setActiveStep((prev) => prev - 1);
                            setUseCustomText(false);
                        }}
                        disabled={activeStep === 0}
                        startIcon={<ChevronLeftIcon/>}
                    >
                        Προηγουμενο
                    </Button>
                    <Box sx={{display: "flex", columnGap: 2}}>
                        <Button variant="outlined" onClick={handleCustomTextToggle}>
                            {useCustomText ? "Επιλογες" : "Ελευθερο Κειμενο"}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleNextStep}
                            endIcon={activeStep === report.length - 1 ? <CheckIcon/> : <ChevronRightIcon/>}
                        >
                            {activeStep === report.length - 1 ? "Υποβολη" : "Επομενο"}
                        </Button>
                    </Box>
                </Box>
            </SectionContainer>
        </PageContainer>
    );
}

export default ReportBuilder;
