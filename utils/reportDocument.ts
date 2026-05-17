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

export type ReportDocumentSection = {
    title: string | null;
    body: string;
};

const SECTION_DELIMITER = "\n\n---\n\n";

export function serializeReportSections(sections: ReportDocumentSection[]): string {
    return sections
        .filter((section) => section.title || section.body.length > 0)
        .map((section) => (section.title ? `${section.title}\n${section.body}` : section.body))
        .join(SECTION_DELIMITER);
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
