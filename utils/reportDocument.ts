type ReportStep = {
    title?: string;
    baseTitle?: string;
    sectionTitle?: string;
    texts?: string[];
    placeholders?: Array<{ title?: string; values?: string[] }> | Record<string, string[]>;
};

type PlaceholderValues = Record<number, Record<number, Record<string, string>>>;

function buildPlaceholderMap(placeholders: ReportStep["placeholders"]): Record<string, string[]> {
    if (!placeholders) return {};
    if (Array.isArray(placeholders)) {
        const map: Record<string, string[]> = {};
        for (const p of placeholders) {
            const k = String(p?.title || "").replace(/\s+/g, "");
            map[k] = p?.values || [];
        }
        return map;
    }
    return placeholders as Record<string, string[]>;
}

export function getProcessedTextForStep(
    story: ReportStep,
    stepIndex: number,
    report: ReportStep[],
    rawText: string,
    placeholderValues: PlaceholderValues
): string {
    if (!story.placeholders || !rawText) return rawText;

    const placeholderMap = buildPlaceholderMap(story.placeholders);
    const segments = rawText.split("\n").filter(Boolean);

    const processedSegments = segments.map((segment) => {
        const selectedTextIndex = (story.texts || []).indexOf(segment);
        const textValues = placeholderValues[stepIndex]?.[selectedTextIndex] || {};

        return String(segment).replace(/<[^>]+>/g, (token) => {
            const rawKey = token.slice(1, -1);
            const normalizedKey = rawKey.trim().replace(/\s+/g, "");
            const value = textValues[normalizedKey] || "......";
            return placeholderMap[normalizedKey] ? value : token;
        });
    });

    return processedSegments.join("\n");
}

export function getStepTitle(story: ReportStep): string {
    if (story.sectionTitle && story.baseTitle) {
        return `${story.baseTitle} — ${story.sectionTitle}`;
    }
    return story.sectionTitle || story.title || story.baseTitle || "";
}

const MERGED_SUBSECTION_BASE_TITLES = new Set(["υπνηλία και ύπνος"]);

const MERGED_SECTION_DISPLAY_TITLES: Record<string, string> = {
    "υπνηλία και ύπνος": "Υπνηλία και Ύπνος",
};

function normalizeTitleKey(title: string): string {
    return title.trim().toLocaleLowerCase("el-GR");
}

export function normalizeSectionTitle(title: string): string {
    const trimmed = title.trim();
    if (!trimmed) return trimmed;
    return MERGED_SECTION_DISPLAY_TITLES[normalizeTitleKey(trimmed)] ?? trimmed;
}

function getMergedSectionTitle(story: ReportStep): string | null {
    const baseTitle = story.baseTitle?.trim();
    if (!baseTitle || !story.sectionTitle) return null;
    if (!MERGED_SUBSECTION_BASE_TITLES.has(normalizeTitleKey(baseTitle))) return null;
    return normalizeSectionTitle(baseTitle);
}

export type ReportDocumentSection = {
    title: string | null;
    body: string;
};

export const SECTION_DELIMITER = "\n\n---\n\n";

export function serializeReportSections(sections: ReportDocumentSection[]): string {
    return sections
        .filter((section) => section.title || section.body.length > 0)
        .map((section) => (section.title ? `${section.title}\n${section.body}` : section.body))
        .join(SECTION_DELIMITER);
}

export function bodyToEditingText(body: string): string {
    return parseReportSections(body)
        .map((section) => (section.title ? `${section.title}\n${section.body}` : section.body))
        .filter((block) => block.length > 0)
        .join("\n\n");
}

export function editingTextToBody(text: string): string {
    if (!text.trim()) return "";
    return serializeReportSections(parseReportSections(text));
}

function escapeReportHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

export function formatReportBodyHtml(body: string): string {
    const chunks: string[] = [];
    const pattern = /\*\*([^*]+)\*\*/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(body)) !== null) {
        chunks.push(escapeReportHtml(body.slice(lastIndex, match.index)));
        chunks.push(`<strong>${escapeReportHtml(match[1])}</strong>`);
        lastIndex = match.index + match[0].length;
    }

    chunks.push(escapeReportHtml(body.slice(lastIndex)));
    return chunks.join("").replace(/\n/g, "<br>");
}

export function htmlElementToPlainWithBold(element: HTMLElement): string {
    const visit = (node: Node): string => {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent ?? "";
        }

        if (node.nodeType !== Node.ELEMENT_NODE) {
            return "";
        }

        const el = node as HTMLElement;
        if (el.tagName === "BR") {
            return "\n";
        }

        if (el.tagName === "STRONG" || el.tagName === "B") {
            return `**${el.textContent ?? ""}**`;
        }

        if (el.tagName === "DIV" || el.tagName === "P") {
            const inner = Array.from(el.childNodes).map(visit).join("");
            return inner.endsWith("\n") ? inner : `${inner}\n`;
        }

        return Array.from(el.childNodes).map(visit).join("");
    };

    return Array.from(element.childNodes)
        .map(visit)
        .join("")
        .replace(/\n+$/, "");
}

export function parseReportSections(text: string): ReportDocumentSection[] {
    if (!text.trim()) return [];

    const blocks = text.includes(SECTION_DELIMITER)
        ? text.split(SECTION_DELIMITER)
        : text.split(/\n\n+/);

    return blocks
        .filter((block) => block.trim().length > 0)
        .map((block) => {
            const newlineIndex = block.indexOf("\n");
            if (newlineIndex === -1) {
                return {title: null, body: block};
            }

            const firstLine = block.slice(0, newlineIndex).trim();
            const body = block.slice(newlineIndex + 1);
            const title = firstLine.replace(/^\*\*(.+)\*\*$/, "$1").trim();

            return {
                title: title || null,
                body,
            };
        });
}

export function buildReportSections(
    report: ReportStep[],
    selectedStoryTexts: string[][],
    placeholderValues: PlaceholderValues,
    includeTitles = true
): ReportDocumentSection[] {
    const sections: ReportDocumentSection[] = [];

    report.forEach((story, index) => {
        const selections = selectedStoryTexts[index] || [];
        const combinedSelectedText = selections.join("\n");
        const processed = getProcessedTextForStep(
            story,
            index,
            report,
            combinedSelectedText,
            placeholderValues
        );

        if (!processed.trim()) return;

        const mergedTitle = includeTitles ? getMergedSectionTitle(story) : null;
        if (mergedTitle) {
            const last = sections[sections.length - 1];
            if (last?.title === mergedTitle) {
                last.body = last.body ? `${last.body}\n\n${processed}` : processed;
                return;
            }
            sections.push({title: mergedTitle, body: processed});
            return;
        }

        const title = getStepTitle(story);
        if (includeTitles && title) {
            sections.push({title, body: processed});
        } else {
            sections.push({title: null, body: processed});
        }
    });

    return sections;
}

export function buildFullReportDocument(
    report: ReportStep[],
    selectedStoryTexts: string[][],
    placeholderValues: PlaceholderValues,
    includeTitles = true
): string {
    return serializeReportSections(
        buildReportSections(report, selectedStoryTexts, placeholderValues, includeTitles)
    );
}

export function hasUnresolvedPlaceholders(text: string): boolean {
    return /\.\.\.\.\.\./.test(text);
}
