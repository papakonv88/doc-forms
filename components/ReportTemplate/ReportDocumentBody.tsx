import {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef} from "react";
import {Box, Typography} from "@mui/material";
import {
    bodyToEditingText,
    formatReportBodyHtml,
    htmlElementToPlainWithBold,
    normalizeSectionTitle,
    parseReportSections,
    ReportDocumentSection,
    SECTION_DELIMITER,
} from "../../utils/reportDocument";

import {
    reportBodyTextSx,
    reportEditableTextSx,
    reportSectionTitleSx,
} from "./reportTypography";

export type ReportDocumentBodyHandle = {
    flushEdits: () => string;
};

type ReportDocumentBodyProps = {
    body: string;
    onBodyChange?: (value: string) => void;
    editable?: boolean;
};

function toEditableText(body: string): string {
    if (!body.trim()) return "";
    if (body.includes(SECTION_DELIMITER)) {
        return bodyToEditingText(body);
    }
    return body;
}

function parseEditableSections(body: string): ReportDocumentSection[] {
    return parseReportSections(toEditableText(body)).map((section) => ({
        ...section,
        title: section.title ? normalizeSectionTitle(section.title) : null,
    }));
}

function sectionsToPlainText(sections: ReportDocumentSection[]): string {
    return sections
        .map((section) => (section.title ? `${section.title}\n${section.body}` : section.body))
        .filter((block) => block.length > 0)
        .join("\n\n");
}

type SectionBodyEditorHandle = {
    getPlainText: () => string;
};

type SectionBodyEditorProps = {
    body: string;
    onBlurCommit: () => void;
};

const SectionBodyEditor = forwardRef<SectionBodyEditorHandle, SectionBodyEditorProps>(
    function SectionBodyEditor({body, onBlurCommit}, ref) {
        const editorRef = useRef<HTMLDivElement>(null);
        const isFocusedRef = useRef(false);
        const lastEmittedRef = useRef<string | null>(null);

        const applyHtml = useCallback((text: string) => {
            const editor = editorRef.current;
            if (!editor) return;
            editor.innerHTML = formatReportBodyHtml(text);
        }, []);

        const readPlainText = useCallback(() => {
            const editor = editorRef.current;
            if (!editor) return body;
            return htmlElementToPlainWithBold(editor);
        }, [body]);

        const syncLocalState = useCallback(() => {
            const plain = readPlainText();
            lastEmittedRef.current = plain;
            return plain;
        }, [readPlainText]);

        useImperativeHandle(
            ref,
            () => ({
                getPlainText: readPlainText,
            }),
            [readPlainText]
        );

        useEffect(() => {
            if (body === lastEmittedRef.current && lastEmittedRef.current !== null) return;
            if (!isFocusedRef.current) {
                applyHtml(body);
            }
            lastEmittedRef.current = body;
        }, [applyHtml, body]);

        return (
            <Box
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                role="textbox"
                aria-multiline
                onFocus={() => {
                    isFocusedRef.current = true;
                }}
                onBlur={() => {
                    isFocusedRef.current = false;
                    syncLocalState();
                    onBlurCommit();
                }}
                onKeyDown={(event) => {
                    event.stopPropagation();

                    if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        document.execCommand("insertLineBreak");
                    }
                }}
                sx={reportEditableTextSx}
            />
        );
    }
);

const ReportDocumentRichEditor = forwardRef<
    ReportDocumentBodyHandle,
    {
        body: string;
        onBodyChange?: (value: string) => void;
    }
>(function ReportDocumentRichEditor({body, onBodyChange}, ref) {
    const sections = useMemo(() => parseEditableSections(body), [body]);
    const bodyEditorRefs = useRef<(SectionBodyEditorHandle | null)[]>([]);
    const lastDocumentRef = useRef(body);

    const collectSections = useCallback((): ReportDocumentSection[] => {
        return sections.map((section, index) => ({
            ...section,
            body: bodyEditorRefs.current[index]?.getPlainText() ?? section.body,
        }));
    }, [sections]);

    const emitDocument = useCallback(() => {
        const plain = sectionsToPlainText(collectSections());
        lastDocumentRef.current = plain;
        onBodyChange?.(plain);
        return plain;
    }, [collectSections, onBodyChange]);

    useEffect(() => {
        if (body === lastDocumentRef.current) return;
        lastDocumentRef.current = body;
    }, [body]);

    useImperativeHandle(
        ref,
        () => ({
            flushEdits: () => emitDocument(),
        }),
        [emitDocument]
    );

    bodyEditorRefs.current.length = sections.length;

    if (!sections.length) {
        return (
            <Box
                sx={{
                    ...reportBodyTextSx,
                    minHeight: "50vh",
                    color: "rgba(0, 0, 0, 0.4)",
                }}
            >
                Το κείμενο του πορίσματος...
            </Box>
        );
    }

    return (
        <Box sx={{width: "100%", minHeight: "50vh", boxSizing: "border-box"}}>
            {sections.map((section, index) => (
                <Box
                    key={`${section.title ?? "section"}-${index}`}
                    sx={{mb: index < sections.length - 1 ? 2.5 : 0}}
                >
                    {section.title && (
                        <Typography sx={reportSectionTitleSx}>{section.title}</Typography>
                    )}
                    <SectionBodyEditor
                        ref={(instance) => {
                            bodyEditorRefs.current[index] = instance;
                        }}
                        body={section.body}
                        onBlurCommit={emitDocument}
                    />
                </Box>
            ))}
        </Box>
    );
});

const ReportDocumentBody = forwardRef<ReportDocumentBodyHandle, ReportDocumentBodyProps>(
    function ReportDocumentBody({body, onBodyChange, editable = false}, ref) {
        if (editable) {
            return <ReportDocumentRichEditor ref={ref} body={body} onBodyChange={onBodyChange}/>;
        }

        const sections = parseEditableSections(body);

        if (!sections.length) {
            return null;
        }

        return (
            <Box>
                {sections.map((section, index) => (
                    <Box key={`${section.title ?? "section"}-${index}`} sx={{mb: index < sections.length - 1 ? 2.5 : 0}}>
                        {section.title && (
                            <Typography sx={reportSectionTitleSx}>{section.title}</Typography>
                        )}
                        <Box
                            sx={{...reportBodyTextSx, whiteSpace: "pre-wrap"}}
                            dangerouslySetInnerHTML={{__html: formatReportBodyHtml(section.body)}}
                        />
                    </Box>
                ))}
            </Box>
        );
    }
);

export default ReportDocumentBody;
