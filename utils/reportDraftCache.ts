export type ReportImageSizeDraft = {
    width: number;
    height: number;
};

export type ReportDraft = {
    version: 2;
    reportStepCount: number;
    activeStep: number;
    selectedStoryTexts: string[][];
    customTexts: string[];
    placeholderValues: Record<number, Record<number, Record<string, string>>>;
    useCustomTextByStep: boolean[];
    completedSteps: number[];
    isReviewMode: boolean;
    finalDocument: string;
    drawingDataUrl: string;
    eegDiagramSize: ReportImageSizeDraft | null;
    updatedAt: number;
};

export type ReportDraftState = Omit<ReportDraft, "version" | "updatedAt">;

const STORAGE_PREFIX = "doc-forms-report-draft-";
const DRAFT_VERSION = 2 as const;

function storageKey(examId: string): string {
    return `${STORAGE_PREFIX}${examId}`;
}

export function isValidExamId(examId: string): boolean {
    return !!examId && examId !== "exam" && examId !== "-";
}

export function createEmptyReportDraftState(reportStepCount: number): ReportDraftState {
    return {
        reportStepCount: reportStepCount,
        activeStep: 0,
        selectedStoryTexts: Array.from({length: reportStepCount}, () => []),
        customTexts: Array.from({length: reportStepCount}, () => ""),
        placeholderValues: {},
        useCustomTextByStep: Array.from({length: reportStepCount}, () => false),
        completedSteps: [],
        isReviewMode: false,
        finalDocument: "",
        drawingDataUrl: "",
        eegDiagramSize: null,
    };
}

function padArray<T>(arr: T[] | undefined, fill: T, length: number): T[] {
    const copy = [...(arr || [])];
    while (copy.length < length) {
        copy.push(fill);
    }
    return copy.slice(0, length);
}

function migrateLegacyDraft(raw: any, reportStepCount: number): ReportDraft | null {
    try {
        if (!raw || typeof raw !== "object") return null;

        const count = typeof raw.reportStepCount === "number" ? raw.reportStepCount : reportStepCount;
        if (count !== reportStepCount) return null;

        const activeStepRaw = typeof raw.activeStep === "number" ? raw.activeStep : 0;
        const placeholderValuesRaw =
            raw.placeholderValues && typeof raw.placeholderValues === "object" && !Array.isArray(raw.placeholderValues)
                ? raw.placeholderValues
                : {};

        return {
            version: DRAFT_VERSION,
            reportStepCount: count,
            activeStep: activeStepRaw,
            selectedStoryTexts: padArray(
                Array.isArray(raw.selectedStoryTexts)
                    ? raw.selectedStoryTexts.map((items: unknown) => (Array.isArray(items) ? items.filter((x) => typeof x === "string") : []))
                    : [],
                [],
                count
            ),
            customTexts: padArray(
                Array.isArray(raw.customTexts)
                    ? raw.customTexts.map((t: unknown) => (typeof t === "string" ? t : ""))
                    : [],
                "",
                count
            ),
            placeholderValues: placeholderValuesRaw,
            useCustomTextByStep: padArray(
                Array.isArray(raw.useCustomTextByStep)
                    ? raw.useCustomTextByStep.map((v: unknown) => !!v)
                    : Array.from({length: count}, (_, i) => !!raw.useCustomText && i === activeStepRaw),
                false,
                count
            ),
            completedSteps: Array.isArray(raw.completedSteps)
                ? raw.completedSteps.filter((n: unknown) => typeof n === "number" && n >= 0 && n < count)
                : [],
            isReviewMode: !!raw.isReviewMode,
            finalDocument: typeof raw.finalDocument === "string" ? raw.finalDocument : "",
            drawingDataUrl: typeof raw.drawingDataUrl === "string" ? raw.drawingDataUrl : "",
            eegDiagramSize:
                raw.eegDiagramSize &&
                typeof raw.eegDiagramSize === "object" &&
                typeof raw.eegDiagramSize.width === "number" &&
                typeof raw.eegDiagramSize.height === "number"
                    ? {width: raw.eegDiagramSize.width, height: raw.eegDiagramSize.height}
                    : null,
            updatedAt: typeof raw.updatedAt === "number" ? raw.updatedAt : Date.now(),
        };
    } catch {
        return null;
    }
}

export function loadReportDraft(examId: string, reportStepCount: number): ReportDraft | null {
    if (typeof window === "undefined" || !isValidExamId(examId)) return null;

    try {
        const raw = localStorage.getItem(storageKey(examId));
        if (!raw) return null;

        const parsed = JSON.parse(raw);
        if (parsed.version === DRAFT_VERSION) {
            return migrateLegacyDraft(parsed, reportStepCount);
        }
        if (parsed.version === 1) {
            return migrateLegacyDraft(parsed, reportStepCount);
        }
        return null;
    } catch {
        return null;
    }
}

export function saveReportDraft(examId: string, draft: ReportDraftState): void {
    if (typeof window === "undefined" || !isValidExamId(examId)) return;

    try {
        const payload: ReportDraft = {
            ...draft,
            version: DRAFT_VERSION,
            updatedAt: Date.now(),
        };
        localStorage.setItem(storageKey(examId), JSON.stringify(payload));
    } catch {
        // Ignore quota or private-mode errors
    }
}

export function clearReportDraft(examId: string): void {
    if (typeof window === "undefined" || !isValidExamId(examId)) return;
    localStorage.removeItem(storageKey(examId));
}

export function normalizeDraftForReport(draft: ReportDraft, reportStepCount: number): ReportDraftState {
    const safeCount = Math.max(0, reportStepCount);
    return {
        reportStepCount: safeCount,
        activeStep: safeCount === 0 ? 0 : Math.min(Math.max(0, draft.activeStep), safeCount - 1),
        selectedStoryTexts: padArray(draft.selectedStoryTexts, [], safeCount),
        customTexts: padArray(draft.customTexts, "", safeCount),
        placeholderValues: draft.placeholderValues || {},
        useCustomTextByStep: padArray(draft.useCustomTextByStep, false, safeCount),
        completedSteps: (draft.completedSteps || []).filter((n) => n >= 0 && n < safeCount),
        isReviewMode: !!draft.isReviewMode,
        finalDocument: draft.finalDocument || "",
        drawingDataUrl: draft.drawingDataUrl || "",
        eegDiagramSize: draft.eegDiagramSize || null,
    };
}

export function hasDraftContent(draft: ReportDraftState): boolean {
    const hasSelections = draft.selectedStoryTexts.some((items) => items.length > 0);
    const hasCustom = draft.customTexts.some((text) => text.trim().length > 0);
    const hasPlaceholders = Object.keys(draft.placeholderValues).length > 0;

    return (
        hasSelections ||
        hasCustom ||
        hasPlaceholders ||
        draft.finalDocument.trim().length > 0 ||
        draft.drawingDataUrl.trim().length > 0 ||
        draft.completedSteps.length > 0 ||
        draft.activeStep > 0 ||
        draft.isReviewMode ||
        !!draft.eegDiagramSize
    );
}

export function getInitialReportDraftState(
    examId: string,
    reportStepCount: number
): {state: ReportDraftState; restored: boolean} {
    try {
        if (typeof window === "undefined" || !isValidExamId(examId) || reportStepCount === 0) {
            return {state: createEmptyReportDraftState(reportStepCount), restored: false};
        }

        const stored = loadReportDraft(examId, reportStepCount);
        if (!stored) {
            return {state: createEmptyReportDraftState(reportStepCount), restored: false};
        }

        const normalized = normalizeDraftForReport(stored, reportStepCount);
        if (!hasDraftContent(normalized)) {
            return {state: createEmptyReportDraftState(reportStepCount), restored: false};
        }

        return {state: normalized, restored: true};
    } catch {
        return {state: createEmptyReportDraftState(reportStepCount), restored: false};
    }
}
