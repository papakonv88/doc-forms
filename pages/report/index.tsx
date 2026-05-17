import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {saveReportDraftNow, useReportDraft} from "../../hooks/useReportDraft";
import {
    clearReportDraft,
    createEmptyReportDraftState,
    getInitialReportDraftState,
    isValidExamId,
    ReportDraftState,
} from "../../utils/reportDraftCache";
import ErrorBoundary from "../../components/General/ErrorBoundary/ErrorBoundary";
import {
    Box,
    Button,
    CircularProgress,
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
    PictureAsPdf as PictureAsPdfIcon,
} from "@mui/icons-material";
import axios from "axios";
import {validateText} from "../../utils";
import A4PagePreview from "../../components/ReportTemplate/A4PagePreview";
import {DrawingTool} from "../../components/ReportTemplate/ReportDrawingCanvas";
import ReportDrawingToolbar from "../../components/ReportTemplate/ReportDrawingToolbar";
import ReportDocumentTemplate, {ReportImageSize, ReportPatientInfo} from "../../components/ReportTemplate/ReportDocumentTemplate";
import {useRouter} from "next/router";
import Settings from "../../settings.json";
import RenderSelection from "../../components/RenderSelection/RenderSelection";
import PageContainer from "../../components/Containers/PageContainer";
import SectionContainer from "../../components/Containers/SectionContainer/SectionContainer";
import Loader from "../../components/General/Loader/Loader";
import ScrollToBottomFab from "../../components/General/ScrollToBottomFab/ScrollToBottomFab";
import {useAppContext} from "../../context";
import MessageVariants from "../../enums/MessageVariants";
import {
    buildFullReportDocument,
    getProcessedTextForStep,
    hasUnresolvedPlaceholders,
} from "../../utils/reportDocument";
import {exportElementToPdf} from "../../utils/exportPdf";

function ReportBuilder() {
    const report = useMemo(() => {
        const expanded: any[] = [];

        for (const story of Settings.doctor.report as any[]) {
            const hasSections = Array.isArray(story.sections) && story.sections.length > 0;
            const hasDirectTexts = Array.isArray(story.texts) && story.texts.length > 0;

            if (hasSections) {
                const totalSections = story.sections.length;
                story.sections.forEach((section: any, idx: number) => {
                    expanded.push({
                        ...story,
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
                expanded.push(story);
            }
        }

        return expanded;
    }, []);

    const {handleOpenSnackbar} = useAppContext();
    const handleOpenSnackbarRef = useRef(handleOpenSnackbar);
    handleOpenSnackbarRef.current = handleOpenSnackbar;

    const router = useRouter();
    const {query, isReady: isRouterReady} = router;
    const rawExamId = query?.id;
    const examId = isRouterReady ? validateText(typeof rawExamId === "string" ? rawExamId : "", "") : "";

    const [isHydrated, setIsHydrated] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [isReviewMode, setIsReviewMode] = useState(false);
    const [finalDocument, setFinalDocument] = useState("");
    const [isExportingPdf, setIsExportingPdf] = useState(false);
    const pdfContentRef = useRef<HTMLDivElement>(null);
    const hydratedExamRef = useRef<string | null>(null);

    const [selectedStoryTexts, setSelectedStoryTexts] = useState<string[][]>([]);
    const [customTexts, setCustomTexts] = useState<string[]>([]);
    const [placeholderValues, setPlaceholderValues] = useState<
        Record<number, Record<number, Record<string, string>>>
    >({});
    const [useCustomTextByStep, setUseCustomTextByStep] = useState<boolean[]>([]);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [drawingTool, setDrawingTool] = useState<DrawingTool>("pen");
    const [drawingColor, setDrawingColor] = useState("#000000");
    const [drawingLineWidth, setDrawingLineWidth] = useState(3);
    const [drawingDataUrl, setDrawingDataUrl] = useState("");
    const [eegDiagramSize, setEegDiagramSize] = useState<ReportImageSize | null>(null);
    const [patientInfo, setPatientInfo] = useState<ReportPatientInfo | null>(null);

    const useCustomText = useCustomTextByStep[activeStep] ?? false;

    const applyDraftState = useCallback((draft: ReportDraftState) => {
        setActiveStep(draft.activeStep);
        setSelectedStoryTexts(draft.selectedStoryTexts);
        setCustomTexts(draft.customTexts);
        setPlaceholderValues(draft.placeholderValues);
        setUseCustomTextByStep(draft.useCustomTextByStep);
        setCompletedSteps(draft.completedSteps);
        setIsReviewMode(draft.isReviewMode);
        setFinalDocument(draft.finalDocument);
        setDrawingDataUrl(draft.drawingDataUrl || "");
        setEegDiagramSize(draft.eegDiagramSize || null);
    }, []);

    useEffect(() => {
        if (!isRouterReady || !isValidExamId(examId) || report.length === 0) {
            return;
        }

        if (hydratedExamRef.current === examId) {
            return;
        }

        hydratedExamRef.current = examId;

        let nextState: ReportDraftState;
        let restored = false;

        try {
            const result = getInitialReportDraftState(examId, report.length);
            nextState = result.state;
            restored = result.restored;

            if (nextState.isReviewMode && !nextState.finalDocument.trim()) {
                const rebuilt = buildFullReportDocument(
                    report,
                    nextState.selectedStoryTexts,
                    nextState.placeholderValues
                );
                if (rebuilt.trim()) {
                    nextState = {...nextState, finalDocument: rebuilt};
                } else {
                    nextState = {...nextState, isReviewMode: false};
                }
            }
        } catch {
            nextState = createEmptyReportDraftState(report.length);
            restored = false;
        }

        applyDraftState(nextState);
        setIsHydrated(true);

        if (restored) {
            handleOpenSnackbarRef.current?.(
                "Ανακτήθηκαν οι αποθηκευμένες απαντήσεις σας.",
                MessageVariants.INFO
            );
        }
    }, [applyDraftState, examId, isRouterReady, report]);

    useEffect(() => {
        if (!isRouterReady || !isValidExamId(examId)) {
            return;
        }

        let cancelled = false;

        (async () => {
            try {
                const {data} = await axios.get(`/api/getExam?id=${encodeURIComponent(examId)}`);
                if (cancelled) return;

                const patient = data?.patient;
                const fullName = [patient?.surname, patient?.name, patient?.patronimo]
                    .map((part) => (typeof part === "string" ? part.trim() : ""))
                    .filter(Boolean)
                    .join(" ");

                setPatientInfo({
                    fullName,
                    amka: typeof patient?.amka === "string" ? patient.amka : "",
                });
            } catch {
                if (!cancelled) setPatientInfo(null);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [examId, isRouterReady]);

    const draftState = useMemo<ReportDraftState>(
        () => ({
            reportStepCount: report.length,
            activeStep,
            selectedStoryTexts,
            customTexts,
            placeholderValues,
            useCustomTextByStep,
            completedSteps,
            isReviewMode,
            finalDocument,
            drawingDataUrl,
            eegDiagramSize,
        }),
        [
            activeStep,
            completedSteps,
            customTexts,
            drawingDataUrl,
            eegDiagramSize,
            finalDocument,
            isReviewMode,
            placeholderValues,
            report.length,
            selectedStoryTexts,
            useCustomTextByStep,
        ]
    );

    useReportDraft({
        examId,
        isRouterReady: isRouterReady && isHydrated,
        state: draftState,
        enabled: isHydrated,
    });

    const currentStory = report[activeStep];
    const isLoading = !isRouterReady || !isHydrated || !isValidExamId(examId) || !currentStory;

    const subStepConnectorStyles = useMemo(() => {
        const styles: Record<string, any> = {};

        report.forEach((item: any, index: number) => {
            if (index === 0) return;
            const currentIsSub = !!item.baseTitle;
            const prev = report[index - 1] as any;
            const prevIsSameGroup = !!prev?.baseTitle && prev.baseTitle === item.baseTitle;

            if (currentIsSub && prevIsSameGroup) {
                const selector = `& .MuiStepConnector-root:nth-of-type(${index}) .MuiStepConnector-line`;
                styles[selector] = {
                    borderTopStyle: "dotted",
                };
            }
        });

        return styles;
    }, [report]);

    const persistDraft = useCallback(
        (patch: Partial<ReportDraftState>) => {
            if (!isValidExamId(examId)) return;
            saveReportDraftNow(examId, {...draftState, ...patch});
        },
        [draftState, examId]
    );

    const handleClearDrawing = useCallback(() => {
        setDrawingDataUrl("");
        persistDraft({drawingDataUrl: ""});
    }, [persistDraft]);

    const getCurrentStepProcessedText = useCallback(() => {
        if (!currentStory) return "";
        const currentSelections = selectedStoryTexts[activeStep] || [];
        const combinedSelectedText = currentSelections.join("\n");
        return getProcessedTextForStep(
            currentStory,
            activeStep,
            report,
            combinedSelectedText,
            placeholderValues
        );
    }, [activeStep, currentStory, placeholderValues, report, selectedStoryTexts]);

    const handleStoryTextSelection = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>, storyIndex: number, textIndex: number, isMulti: boolean) => {
            const text = report[storyIndex].texts[textIndex];

            setCustomTexts((prev) => {
                const newTexts = [...prev];
                newTexts[storyIndex] = "";
                return newTexts;
            });

            setUseCustomTextByStep((prev) => {
                const copy = [...prev];
                copy[storyIndex] = false;
                return copy;
            });

            setSelectedStoryTexts((prev) => {
                const newSelections = [...prev];
                const currentSelections = newSelections[storyIndex] || [];
                const validTextsForStep = report[storyIndex].texts;
                const baseSelections = currentSelections.filter((t) =>
                    validTextsForStep.includes(t)
                );

                if (isMulti) {
                    if (baseSelections.includes(text)) {
                        newSelections[storyIndex] = baseSelections.filter((t) => t !== text);
                    } else {
                        newSelections[storyIndex] = [...baseSelections, text];
                    }
                } else {
                    newSelections[storyIndex] = [text];
                }

                return newSelections;
            });
        },
        [report]
    );

    const handleCustomTextToggle = () => {
        if (!useCustomText) {
            setSelectedStoryTexts((sts) => {
                const copy = [...sts];
                copy[activeStep] = [];
                return copy;
            });
            setPlaceholderValues((pv) => {
                if (pv[activeStep] == null) return pv;
                const next = {...pv};
                delete next[activeStep];
                return next;
            });
        }

        setUseCustomTextByStep((prev) => {
            const copy = [...prev];
            copy[activeStep] = !copy[activeStep];
            return copy;
        });
    };

    const handleCustomTextChange = useCallback((text: string) => {
        setCustomTexts((prev) => {
            const newTexts = [...prev];
            newTexts[activeStep] = text;
            return newTexts;
        });

        setSelectedStoryTexts((prev) => {
            const newTexts = [...prev];
            newTexts[activeStep] = text ? [text] : [];
            return newTexts;
        });
    }, [activeStep]);

    const handlePlaceholderChange = (textIndex: number, key: string, value: string) => {
        setPlaceholderValues((prev) => ({
            ...prev,
            [activeStep]: {
                ...(prev[activeStep] || {}),
                [textIndex]: {
                    ...((prev[activeStep] || {})[textIndex] || {}),
                    [key]: value,
                },
            },
        }));
    };

    const validateCurrentStep = (): boolean => {
        const text = getCurrentStepProcessedText();
        if (hasUnresolvedPlaceholders(text) && selectedStoryTexts[activeStep]?.length) {
            handleOpenSnackbar(
                "Συμπληρώστε τα απαιτούμενα πεδία ή επιλέξτε ελεύθερο κείμενο για να προχωρήσετε",
                MessageVariants.ERROR
            );
            return false;
        }
        return true;
    };

    const handleNextStep = () => {
        if (!validateCurrentStep()) return;

        const nextCompleted = Array.from(new Set([...completedSteps, activeStep]));

        if (activeStep < report.length - 1) {
            const nextStep = activeStep + 1;
            setCompletedSteps(nextCompleted);
            setActiveStep(nextStep);
            persistDraft({
                completedSteps: nextCompleted,
                activeStep: nextStep,
            });
            return;
        }

        const documentText = buildFullReportDocument(report, selectedStoryTexts, placeholderValues);
        if (!documentText.trim()) {
            handleOpenSnackbar("Επιλέξτε ή συμπληρώστε κείμενο πριν την υποβολή", MessageVariants.ERROR);
            return;
        }

        const allCompleted = Array.from(new Set([...nextCompleted, activeStep]));
        setCompletedSteps(allCompleted);
        setFinalDocument(documentText);
        setIsReviewMode(true);
        persistDraft({
            completedSteps: allCompleted,
            finalDocument: documentText,
            isReviewMode: true,
            activeStep,
        });
    };

    const handleBackToSteps = () => {
        setIsReviewMode(false);
        persistDraft({isReviewMode: false});
    };

    const handleExportPdf = async () => {
        if (!finalDocument.trim()) {
            handleOpenSnackbar("Το πόρισμα είναι κενό", MessageVariants.ERROR);
            return;
        }

        const element = pdfContentRef.current;
        if (!element) return;

        setIsExportingPdf(true);
        try {
            await exportElementToPdf(element, `porisma-${examId}.pdf`);
            clearReportDraft(examId);
            applyDraftState(createEmptyReportDraftState(report.length));
            setIsReviewMode(false);
            setActiveStep(0);
            handleOpenSnackbar("Το PDF εξήχθη επιτυχώς", MessageVariants.SUCCESS);
        } catch {
            handleOpenSnackbar("Αποτυχία εξαγωγής PDF", MessageVariants.ERROR);
        } finally {
            setIsExportingPdf(false);
        }
    };

    if (isRouterReady && !isValidExamId(examId)) {
        return (
            <PageContainer>
                <SectionContainer>
                    <Typography color="error" textAlign="center" sx={{mt: 4}}>
                        Μη έγκυρος κωδικός εξέτασης. Ανοίξτε το πόρισμα από τη λίστα εξετάσεων.
                    </Typography>
                </SectionContainer>
            </PageContainer>
        );
    }

    if (isLoading) {
        return (
            <PageContainer>
                <Loader open/>
            </PageContainer>
        );
    }

    const examCodeHeader = (
        <Box sx={{textAlign: "center", my: isReviewMode ? 4 : 6}}>
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
                    {examId}
                </Typography>
            </Typography>
            {!isReviewMode && (
                <>
                    <Typography variant="subtitle1" color="text.secondary">
                        Βήμα {activeStep + 1} από {report.length}
                    </Typography>
                    {currentStory.baseTitle && (
                        <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            sx={{mt: 1}}
                        >
                            Υποβήμα {currentStory.sectionIndex + 1} από {currentStory.totalSections} στην
                            ενότητα: <strong>{currentStory.baseTitle}</strong>
                        </Typography>
                    )}
                </>
            )}
        </Box>
    );

    if (isReviewMode) {
        return (
            <PageContainer>
                <SectionContainer pb={12}>
                    {examCodeHeader}

                    <ReportDrawingToolbar
                        isDrawingMode={isDrawingMode}
                        onDrawingModeChange={setIsDrawingMode}
                        tool={drawingTool}
                        onToolChange={setDrawingTool}
                        color={drawingColor}
                        onColorChange={setDrawingColor}
                        lineWidth={drawingLineWidth}
                        onLineWidthChange={setDrawingLineWidth}
                        onClear={handleClearDrawing}
                    />

                    <Paper elevation={2} sx={{mb: 3, overflow: "auto", maxHeight: "85vh"}}>
                        <A4PagePreview>
                            <ReportDocumentTemplate
                                ref={pdfContentRef}
                                body={finalDocument}
                                onBodyChange={setFinalDocument}
                                editable
                                patient={patientInfo}
                                eegDiagramSize={eegDiagramSize}
                                onEegDiagramSizeChange={setEegDiagramSize}
                                drawing={{
                                    active: isDrawingMode,
                                    tool: drawingTool,
                                    color: drawingColor,
                                    lineWidth: drawingLineWidth,
                                    dataUrl: drawingDataUrl,
                                    onChange: setDrawingDataUrl,
                                }}
                            />
                        </A4PagePreview>
                    </Paper>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 2,
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={handleBackToSteps}
                            startIcon={<ChevronLeftIcon/>}
                        >
                            Πισω
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleExportPdf}
                            disabled={isExportingPdf || !finalDocument.trim()}
                            startIcon={
                                isExportingPdf ? (
                                    <CircularProgress size={20} color="inherit"/>
                                ) : (
                                    <PictureAsPdfIcon/>
                                )
                            }
                        >
                            {isExportingPdf ? "Εξαγωγή..." : "Εξαγωγή PDF"}
                        </Button>
                    </Box>
                </SectionContainer>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <ScrollToBottomFab/>
            <SectionContainer pb={12}>
                {examCodeHeader}

                <Stepper
                    activeStep={activeStep}
                    sx={{
                        mb: 6,
                        "& .MuiStepConnector-line": {
                            borderTopStyle: "solid",
                        },
                        ...subStepConnectorStyles,
                    }}
                >
                    {report.map((storyItem: any, index) => (
                        <Step key={index} completed={completedSteps.includes(index)}>
                            <StepLabel>{index + 1}</StepLabel>
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
                            <RenderSelection
                                story={report[activeStep]}
                                index={activeStep}
                                selectedStoryTexts={selectedStoryTexts}
                                handlePlaceholderChange={handlePlaceholderChange}
                                handleStoryTextSelection={handleStoryTextSelection}
                                placeholderValues={placeholderValues[activeStep] ?? {}}
                                isMulti={activeStep !== 0}
                            />
                        </Box>
                    )}

                    <Divider sx={{my: 3}}/>
                    <Typography variant="subtitle1" sx={{fontWeight: "medium"}}>
                        Επιλεγμένο κείμενο:
                    </Typography>
                    <Typography sx={{mt: 1, whiteSpace: "pre-line"}}>
                        {getCurrentStepProcessedText() || "-"}
                    </Typography>
                </Paper>

                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2}}>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            const prevStep = activeStep - 1;
                            setActiveStep(prevStep);
                            persistDraft({activeStep: prevStep});
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

function ReportBuilderPage() {
    return (
        <ErrorBoundary>
            <ReportBuilder/>
        </ErrorBoundary>
    );
}

export default ReportBuilderPage;
