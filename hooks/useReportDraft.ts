import {useEffect, useRef} from "react";
import {
    hasDraftContent,
    isValidExamId,
    ReportDraftState,
    saveReportDraft,
} from "../utils/reportDraftCache";

type UseReportDraftOptions = {
    examId: string;
    isRouterReady: boolean;
    state: ReportDraftState;
    enabled?: boolean;
};

export function useReportDraft({
    examId,
    isRouterReady,
    state,
    enabled = true,
}: UseReportDraftOptions): void {
    const canSaveRef = useRef(false);

    useEffect(() => {
        if (!enabled || !isRouterReady || !isValidExamId(examId)) {
            canSaveRef.current = false;
            return;
        }

        canSaveRef.current = true;
    }, [enabled, examId, isRouterReady]);

    useEffect(() => {
        if (!canSaveRef.current || !isValidExamId(examId)) {
            return;
        }

        if (!hasDraftContent(state)) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            saveReportDraft(examId, state);
        }, 300);

        return () => window.clearTimeout(timeoutId);
    }, [examId, state, enabled]);
}

export function saveReportDraftNow(examId: string, state: ReportDraftState): void {
    if (!isValidExamId(examId) || !hasDraftContent(state)) return;
    saveReportDraft(examId, state);
}
