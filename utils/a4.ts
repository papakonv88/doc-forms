export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;

/** Converts millimeters to CSS pixels at 96dpi. */
export function mmToPx(mm: number): number {
    return mm * (96 / 25.4);
}

export function getA4PageCount(contentHeightPx: number, pageHeightPx = mmToPx(A4_HEIGHT_MM)): number {
    if (contentHeightPx <= 0 || pageHeightPx <= 0) return 1;
    return Math.max(1, Math.ceil(contentHeightPx / pageHeightPx));
}
