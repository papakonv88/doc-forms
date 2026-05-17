import {useMemo} from "react";
import {Box, TextField, Typography} from "@mui/material";
import {
    parseReportSections,
    ReportDocumentSection,
    serializeReportSections,
} from "../../utils/reportDocument";

const bodyTextSx = {
    fontFamily: '"Times New Roman", Times, serif',
    fontSize: "12pt",
    lineHeight: 1.5,
    color: "#000",
} as const;

const sectionTitleSx = {
    ...bodyTextSx,
    fontWeight: 700,
    mb: 0.75,
} as const;

type ReportDocumentBodyProps = {
    body: string;
    onBodyChange?: (value: string) => void;
    editable?: boolean;
};

function ReportDocumentBody({body, onBodyChange, editable = false}: ReportDocumentBodyProps) {
    const sections = useMemo(() => parseReportSections(body), [body]);

    const updateSections = (nextSections: ReportDocumentSection[]) => {
        onBodyChange?.(serializeReportSections(nextSections));
    };

    const updateSectionBody = (index: number, value: string) => {
        const next = sections.map((section, i) =>
            i === index ? {...section, body: value} : section
        );
        updateSections(next);
    };

    if (!sections.length) {
        if (editable) {
            return (
                <TextField
                    fullWidth
                    multiline
                    minRows={12}
                    value={body}
                    onChange={(e) => onBodyChange?.(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.stopPropagation();
                        }
                    }}
                    variant="standard"
                    placeholder="Το κείμενο του πορίσματος..."
                    InputProps={{
                        disableUnderline: true,
                        sx: bodyTextSx,
                    }}
                    sx={{
                        "& .MuiInputBase-root": {
                            p: 0,
                            alignItems: "flex-start",
                        },
                        "& textarea": {
                            overflow: "auto !important",
                            resize: "vertical",
                            whiteSpace: "pre-wrap",
                        },
                    }}
                />
            );
        }
        return null;
    }

    return (
        <Box>
            {sections.map((section, index) => (
                <Box key={`${section.title ?? "section"}-${index}`} sx={{mb: index < sections.length - 1 ? 2.5 : 0}}>
                    {section.title && (
                        <Typography sx={sectionTitleSx}>{section.title}</Typography>
                    )}
                    {editable ? (
                        <TextField
                            fullWidth
                            multiline
                            minRows={Math.max(3, section.body.split("\n").length + 1)}
                            value={section.body}
                            onChange={(e) => updateSectionBody(index, e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.stopPropagation();
                                }
                            }}
                            variant="standard"
                            InputProps={{
                                disableUnderline: true,
                                sx: bodyTextSx,
                            }}
                            sx={{
                                "& .MuiInputBase-root": {
                                    p: 0,
                                    alignItems: "flex-start",
                                },
                                "& textarea": {
                                    overflow: "auto !important",
                                    resize: "vertical",
                                    whiteSpace: "pre-wrap",
                                },
                            }}
                        />
                    ) : (
                        <Typography sx={{...bodyTextSx, whiteSpace: "pre-wrap"}}>
                            {section.body}
                        </Typography>
                    )}
                </Box>
            ))}
        </Box>
    );
}

export default ReportDocumentBody;
