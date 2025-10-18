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
        return Settings.doctor.report
    }, [])
    const {handleOpenSnackbar} = useAppContext();
    const [activeStep, setActiveStep] = useState(0);
    const [selectedStoryTexts, setSelectedStoryTexts] = useState<string[]>(
        report.map(() => "")
    );
    const [useCustomText, setUseCustomText] = useState(false);
    const [customTexts, setCustomTexts] = useState(report.map(() => ""));
    const [placeholderValues, setPlaceholderValues] = useState<Record<number, Record<string, string>>>({});
    const [finalSelection, setFinalSelection] = useState([])

    const currentStory = report[activeStep];


    console.log(selectedStoryTexts, 'selected store texts')


    const router = useRouter();
    const {query} = router;

    const handleStoryTextSelection = useCallback((event: React.ChangeEvent<HTMLInputElement>, storyIndex: number) => {
        const selectedTextIndex = Number(event.target.value);
        setSelectedStoryTexts((prev) => {
            const newTexts = [...prev];
            newTexts[storyIndex] = report[storyIndex].texts[selectedTextIndex];
            return newTexts;
        });
    }, [selectedStoryTexts]);

    const handleCustomTextToggle = () => {
        setUseCustomText((prev) => !prev);
    };

    const handleCustomTextChange = useCallback((text: string) => {
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
    }, [selectedStoryTexts, customTexts]);

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
        const text = getProcessedText(selectedStoryTexts[activeStep]);
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




    const getProcessedText = (text: string) => {
        if (!currentStory.placeholders) return text;

        const selectedTextIndex = report[activeStep].texts.indexOf(text);
        const textValues = placeholderValues[selectedTextIndex] || {};

        // Normalize placeholders list into a map for consistent key lookup
        const placeholderMap: Record<string, string[]> = Array.isArray(currentStory.placeholders)
            ? currentStory.placeholders.reduce((acc: Record<string, string[]>, p: any) => {
                const k = String(p?.title || '').replace(/\s+/g, '');
                acc[k] = p?.values || [];
                return acc;
            }, {})
            : currentStory.placeholders as any;

        // Replace tokens in text by scanning for <...> and using normalized keys
        return String(text).replace(/<[^>]+>/g, (token) => {
            const rawKey = token.slice(1, -1);
            const normalizedKey = rawKey.trim().replace(/\s+/g, '');
            const value = textValues[normalizedKey] || '......';
            // Only replace if it's a known placeholder; otherwise keep token
            return placeholderMap[normalizedKey] ? value : token;
        });
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
                </Box>

                <Stepper activeStep={activeStep} sx={{mb: 6}}>
                    {report.map((_, index) => (
                        <Step key={index}>
                            <StepLabel></StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Typography variant="h6" sx={{mb: 3}}>
                    {`${activeStep + 1}. ${currentStory.title}`}
                </Typography>

                <Paper elevation={3} sx={{p: 4, mb: 4}}>
                    <Box sx={{display: "flex", justifyContent: "flex-end", mb: 6}}>
                        <Button variant="outlined" onClick={handleCustomTextToggle}>
                            {useCustomText ? "Επιλογες" : "Ελευθερο Κειμενο"}
                        </Button>
                    </Box>

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
                                             placeholderValues={placeholderValues}/>
                        </Box>
                    )}

                    <Divider sx={{my: 3}}/>
                    <Typography variant="subtitle1" sx={{fontWeight: "medium"}}>
                        Επιλεγμένο κείμενο:
                    </Typography>
                    <Typography sx={{mt: 1, whiteSpace: "pre-line"}}>
                        {getProcessedText(selectedStoryTexts[activeStep]) || "-"}
                    </Typography>
                </Paper>

                <Box sx={{display: "flex", justifyContent: "space-between"}}>
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
                    <Button
                        variant="contained"
                        onClick={handleNextStep}
                        endIcon={activeStep === report.length - 1 ? <CheckIcon/> : <ChevronRightIcon/>}
                    >
                        {activeStep === report.length - 1 ? "Υποβολη" : "Επομενο"}
                    </Button>
                </Box>
            </SectionContainer>
        </PageContainer>
    );
}

export default ReportBuilder;
