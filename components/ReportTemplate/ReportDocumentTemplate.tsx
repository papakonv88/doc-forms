import {forwardRef, useEffect, useRef} from "react";
import {Box, Tooltip, Typography} from "@mui/material";
import ReportDocumentBody, {ReportDocumentBodyHandle} from "./ReportDocumentBody";
import ReportDrawingCanvas, {DrawingTool} from "./ReportDrawingCanvas";
import ReportExamDetailsSection, {ReportExamDetails, ReportPatientInfo, ReportSectionHeading} from "./ReportExamDetailsSection";
import {REPORT_BODY_FONT, REPORT_BODY_FONT_SIZE, REPORT_BODY_LINE_HEIGHT} from "./reportTypography";

export type {ReportPatientInfo, ReportExamDetails};

export type ReportDrawingConfig = {
    active: boolean;
    tool: DrawingTool;
    color: string;
    lineWidth: number;
    dataUrl: string;
    onChange: (dataUrl: string) => void;
};

export type ReportImageSize = {
    width: number;
    height: number;
};

type ReportDocumentTemplateProps = {
    body: string;
    onBodyChange?: (value: string) => void;
    editable?: boolean;
    drawing?: ReportDrawingConfig;
    patient?: ReportPatientInfo | null;
    examDetails?: ReportExamDetails | null;
    eegDiagramSize?: ReportImageSize | null;
    onEegDiagramSizeChange?: (size: ReportImageSize) => void;
    bodyEditorRef?: React.Ref<ReportDocumentBodyHandle>;
};

const DEFAULT_EEG_DIAGRAM_WIDTH = 400;
const DEFAULT_EEG_DIAGRAM_HEIGHT = 300;
const MIN_EEG_DIAGRAM_WIDTH = 120;
const MAX_EEG_DIAGRAM_WIDTH = 720;
const MIN_EEG_DIAGRAM_HEIGHT = 90;
const MAX_EEG_DIAGRAM_HEIGHT = 540;

const pageSx = {
    width: "210mm",
    bgcolor: "#fff",
    color: "#000",
    boxSizing: "border-box",
    px: "14mm",
    py: "10mm",
    fontFamily: REPORT_BODY_FONT,
    fontSize: REPORT_BODY_FONT_SIZE,
    lineHeight: REPORT_BODY_LINE_HEIGHT,
} as const;

const headerTextSx = {
    fontFamily: '"Bookman Old Style", "Times New Roman", serif',
    fontSize: "10pt",
    lineHeight: 1.35,
    textAlign: "center",
    color: "#000",
} as const;

const titleSx = {
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "15pt",
    fontWeight: 700,
    textAlign: "center",
    lineHeight: 1.25,
    letterSpacing: "0.02em",
    color: "#000",
} as const;

const ruleSx = {
    borderBottom: "1px solid #000",
    width: "100%",
} as const;

const LEFT_HEADER_LINES = [
    "Γ΄ ΝΕΥΡΟΛΟΓΙΚΗ ΚΛΙΝΙΚΗ",
    "ΑΡΙΣΤΟΤΕΛΕΙΟΥ ΠΑΝΕΠΙΣΤΗΜΙΟΥ ΘΕΣΣΑΛΟΝΙΚΗΣ",
    "ΕΡΓΑΣΤΗΡΙΟ ΗΛΕΚΤΡΟΕΓΚΕΦΑΛΟΓΡΑΦΙΑΣ ΚΑΙ ΒΙΝΤΕΟ-",
    "ΗΕΓ ΚΑΤΑΓΡΑΦΩΝ",
] as const;

const RIGHT_HEADER_LINES = [
    "ΕΛΛΗΝΙΚΗ ΔΗΜΟΚΡΑΤΙΑ",
    "Β΄ Πε.Σ.Υ.Π. ΚΕΝΤΡΙΚΗΣ ΜΑΚΕΔΟΝΙΑΣ",
    "ΓΕΝΙΚΟ ΝΟΣΟΚΟΜΕΙΟ ΘΕΣΣΑΛΟΝΙΚΗΣ",
    "«ΓΕΩΡΓΙΟΣ ΠΑΠΑΝΙΚΟΛΑΟΥ»",
] as const;

const SIGNATURE_COLUMNS = [
    "Τεχνολόγος EEG",
    "Ιατρός",
    "Επιβλέπων Ιατρός",
] as const;

const signaturesBorderColor = "#000";

const signatureCellSx = {
    flex: 1,
    minWidth: 0,
    border: `1px solid ${signaturesBorderColor}`,
    p: "6pt 8pt",
    boxSizing: "border-box",
} as const;

const signatureLabelSx = {
    fontFamily: '"Calibri", "Arial", sans-serif',
    fontSize: "10pt",
    color: "#000",
    lineHeight: 1.4,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
} as const;

const signatureLineSx = {
    flex: 1,
    borderBottom: "1px solid #000",
    height: "1px",
    alignSelf: "flex-end",
    mb: "3pt",
} as const;

const pageFooterCellSx = {
    fontFamily: '"Calibri", "Arial", sans-serif',
    fontSize: "10pt",
    color: "#000",
    flex: 1,
    minWidth: 0,
} as const;

type ReportTemplateFooterProps = {
    patient?: ReportPatientInfo | null;
};

function ReportTemplateFooter({patient}: ReportTemplateFooterProps) {
    const patientName = patient?.fullName?.trim() || "Ονοματεπώνυμο ασθενούς";
    const amka = patient?.amka?.trim() || "ΑΜΚΑ / Study ID";

    return (
        <Box sx={{mt: 4, width: "100%"}}>
            <Box
                sx={{
                    bgcolor: "#16365c",
                    color: "#fff",
                    px: "8pt",
                    py: "4pt",
                    border: `1px solid ${signaturesBorderColor}`,
                    borderBottom: "none",
                }}
            >
                <Typography
                    sx={{
                        fontFamily: '"Calibri", "Arial", sans-serif',
                        fontSize: "11pt",
                        fontWeight: 700,
                        color: "#fff",
                        lineHeight: 1.3,
                    }}
                >
                    ΥΠΟΓΡΑΦΕΣ
                </Typography>
            </Box>

            <Box sx={{display: "flex", width: "100%"}}>
                {SIGNATURE_COLUMNS.map((label) => (
                    <Box
                        key={label}
                        sx={{
                            ...signatureCellSx,
                            py: "4pt",
                            textAlign: "center",
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: '"Calibri", "Arial", sans-serif',
                                fontSize: "10.5pt",
                                fontWeight: 700,
                                color: "#000",
                                lineHeight: 1.3,
                            }}
                        >
                            {label}
                        </Typography>
                    </Box>
                ))}
            </Box>

            <Box sx={{display: "flex", width: "100%"}}>
                {SIGNATURE_COLUMNS.map((label) => (
                    <Box
                        key={`${label}-body`}
                        sx={{
                            ...signatureCellSx,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                            minHeight: "78pt",
                        }}
                    >
                        <Box sx={{display: "flex", alignItems: "flex-end", gap: "4pt"}}>
                            <Typography sx={signatureLabelSx}>Ονοματεπώνυμο:</Typography>
                            <Box sx={signatureLineSx}/>
                        </Box>
                        <Box sx={{display: "flex", alignItems: "flex-end", gap: "4pt", mt: "6pt"}}>
                            <Typography sx={signatureLabelSx}>Υπογραφή:</Typography>
                            <Box sx={signatureLineSx}/>
                        </Box>
                    </Box>
                ))}
            </Box>

            <Box
                sx={{
                    display: "flex",
                    width: "100%",
                    alignItems: "flex-start",
                    mt: "10pt",
                    px: "2pt",
                }}
            >
                <Typography sx={{...pageFooterCellSx, textAlign: "left"}}>
                    {patientName}
                </Typography>
                <Typography sx={{...pageFooterCellSx, textAlign: "right"}}>
                    {amka}
                </Typography>
            </Box>
        </Box>
    );
}

type ResizableEegDiagramProps = {
    size?: ReportImageSize | null;
    onSizeChange?: (size: ReportImageSize) => void;
    interactive: boolean;
};

function clampDiagramSize(next: ReportImageSize): ReportImageSize {
    return {
        width: Math.min(
            MAX_EEG_DIAGRAM_WIDTH,
            Math.max(MIN_EEG_DIAGRAM_WIDTH, Math.round(next.width))
        ),
        height: Math.min(
            MAX_EEG_DIAGRAM_HEIGHT,
            Math.max(MIN_EEG_DIAGRAM_HEIGHT, Math.round(next.height))
        ),
    };
}

function ResizableEegDiagram({size, onSizeChange, interactive}: ResizableEegDiagramProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const isUserResizingRef = useRef(false);
    const lastEmittedRef = useRef<string>("");
    const propSizeKeyRef = useRef<string>("");

    const width = Math.min(
        MAX_EEG_DIAGRAM_WIDTH,
        Math.max(MIN_EEG_DIAGRAM_WIDTH, size?.width ?? DEFAULT_EEG_DIAGRAM_WIDTH)
    );
    const height = Math.min(
        MAX_EEG_DIAGRAM_HEIGHT,
        Math.max(MIN_EEG_DIAGRAM_HEIGHT, size?.height ?? DEFAULT_EEG_DIAGRAM_HEIGHT)
    );

    useEffect(() => {
        propSizeKeyRef.current = `${width}x${height}`;
        lastEmittedRef.current = propSizeKeyRef.current;
    }, [width, height]);

    useEffect(() => {
        if (!interactive) return;
        const element = containerRef.current;
        if (!element || typeof ResizeObserver === "undefined") return;

        const markUserResize = () => {
            isUserResizingRef.current = true;
        };
        const releaseUserResize = () => {
            // Defer until after the resulting ResizeObserver tick has fired
            window.setTimeout(() => {
                isUserResizingRef.current = false;
            }, 50);
        };

        element.addEventListener("pointerdown", markUserResize);
        window.addEventListener("pointerup", releaseUserResize);
        window.addEventListener("pointercancel", releaseUserResize);

        let observer: ResizeObserver | null = null;
        try {
            observer = new ResizeObserver((entries) => {
                if (!isUserResizingRef.current) return;
                for (const entry of entries) {
                    const borderBox = Array.isArray(entry.borderBoxSize)
                        ? entry.borderBoxSize[0]
                        : (entry.borderBoxSize as unknown as ResizeObserverSize | undefined);

                    let nextWidth: number;
                    let nextHeight: number;
                    if (borderBox && typeof borderBox.inlineSize === "number") {
                        nextWidth = borderBox.inlineSize;
                        nextHeight = borderBox.blockSize;
                    } else {
                        const rect = (entry.target as HTMLElement).getBoundingClientRect();
                        nextWidth = rect.width;
                        nextHeight = rect.height;
                    }

                    const clamped = clampDiagramSize({width: nextWidth, height: nextHeight});
                    const key = `${clamped.width}x${clamped.height}`;
                    if (key === lastEmittedRef.current) continue;
                    lastEmittedRef.current = key;
                    onSizeChange?.(clamped);
                }
            });
            observer.observe(element);
        } catch {
            observer = null;
        }

        return () => {
            element.removeEventListener("pointerdown", markUserResize);
            window.removeEventListener("pointerup", releaseUserResize);
            window.removeEventListener("pointercancel", releaseUserResize);
            observer?.disconnect();
        };
    }, [interactive, onSizeChange]);

    return (
        <Box
            sx={{
                pageBreakBefore: "always",
                breakBefore: "page",
                display: "flex",
                justifyContent: "center",
                width: "100%",
                mt: 4,
                pt: 2,
            }}
        >
            <Tooltip
                title={interactive ? "Σύρετε τη γωνία κάτω-δεξιά για αλλαγή μεγέθους" : ""}
                placement="top"
                arrow
                disableHoverListener={!interactive}
                disableFocusListener={!interactive}
                disableTouchListener={!interactive}
            >
                <Box
                    ref={containerRef}
                    sx={{
                        position: "relative",
                        width: `${width}px`,
                        height: `${height}px`,
                        maxWidth: "100%",
                        minWidth: `${MIN_EEG_DIAGRAM_WIDTH}px`,
                        minHeight: `${MIN_EEG_DIAGRAM_HEIGHT}px`,
                        boxSizing: "border-box",
                        overflow: "hidden",
                        resize: interactive ? "both" : "none",
                        border: interactive ? "1px dashed rgba(0,0,0,0.25)" : "none",
                        transition: "border-color 0.15s ease-in-out",
                        "&:hover": interactive
                            ? {borderColor: "rgba(0,0,0,0.55)"}
                            : undefined,
                    }}
                >
                    <Box
                        component="img"
                        src="/report-template/eeg-diagram.gif"
                        alt=""
                        draggable={false}
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            display: "block",
                            pointerEvents: "none",
                            userSelect: "none",
                        }}
                    />
                </Box>
            </Tooltip>
        </Box>
    );
}

function ReportTemplateHeader() {
    return (
        <Box sx={{mb: 2}}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "stretch",
                    gap: 3,
                    mb: 2,
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        minWidth: 0,
                    }}
                >
                    {LEFT_HEADER_LINES.map((line) => (
                        <Typography key={line} sx={{...headerTextSx, width: "100%"}}>
                            {line}
                        </Typography>
                    ))}
                    <Typography
                        sx={{
                            ...headerTextSx,
                            width: "100%",
                            mt: 0.25,
                            fontSize: "9.5pt",
                        }}
                    >
                        Διευθυντής: Αν. Καθηγητής Δημήτριος Α. Κάζης
                    </Typography>
                    <Box
                        component="img"
                        src="/report-template/auth-logo.jpg"
                        alt=""
                        sx={{width: 92, height: "auto", mt: "auto", pt: 1.5, display: "block"}}
                    />
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        minWidth: 0,
                    }}
                >
                    {RIGHT_HEADER_LINES.map((line) => (
                        <Typography key={line} sx={{...headerTextSx, width: "100%"}}>
                            {line}
                        </Typography>
                    ))}
                    <Box
                        component="img"
                        src="/report-template/hospital-logo.jpg"
                        alt=""
                        sx={{width: 78, height: "auto", mt: "auto", pt: 1.5, display: "block"}}
                    />
                </Box>
            </Box>

            <Box sx={{...ruleSx, mb: 1.5}}/>

            <Typography sx={titleSx}>ΠΟΡΙΣΜΑ</Typography>
            <Typography sx={{...titleSx, mt: 0.25}}>ΗΛΕΚΤΡΟΕΓΚΕΦΑΛΟΓΡΑΦΗΜΑΤΟΣ</Typography>

            <Box sx={{...ruleSx, mt: 1.5}}/>
        </Box>
    );
}

const ReportDocumentTemplate = forwardRef<HTMLDivElement, ReportDocumentTemplateProps>(
    function ReportDocumentTemplate(
        {body, onBodyChange, editable = false, drawing, patient, examDetails, eegDiagramSize, onEegDiagramSizeChange, bodyEditorRef},
        ref
    ) {
        const canEditText = editable && !drawing?.active;
        const canResizeDiagram = editable && !drawing?.active;

        return (
            <Box ref={ref} sx={pageSx}>
                <Box sx={{position: "relative"}}>
                    <ReportTemplateHeader/>

                    {examDetails && <ReportExamDetailsSection exam={examDetails}/>}

                    <Box sx={{mt: examDetails ? 0 : 2, mb: 1.5}}>
                        <ReportSectionHeading title="Στοιχεία πορίσματος"/>
                    </Box>

                    <Box sx={{width: "100%", pointerEvents: canEditText ? "auto" : "none"}}>
                        <ReportDocumentBody
                            ref={bodyEditorRef}
                            body={body}
                            onBodyChange={onBodyChange}
                            editable={canEditText}
                        />
                    </Box>

                    <ResizableEegDiagram
                        size={eegDiagramSize}
                        onSizeChange={onEegDiagramSizeChange}
                        interactive={canResizeDiagram}
                    />

                    <ReportTemplateFooter patient={patient}/>

                    {drawing && (
                        <ReportDrawingCanvas
                            active={drawing.active}
                            tool={drawing.tool}
                            color={drawing.color}
                            lineWidth={drawing.lineWidth}
                            dataUrl={drawing.dataUrl}
                            onChange={drawing.onChange}
                        />
                    )}
                </Box>
            </Box>
        );
    }
);

export default ReportDocumentTemplate;
