import {ReactNode, useCallback, useEffect, useRef, useState} from "react";
import {Box} from "@mui/material";
import {A4_HEIGHT_MM, A4_WIDTH_MM, getA4PageCount, mmToPx} from "../../utils/a4";

type A4PagePreviewProps = {
    children: ReactNode;
};

function A4PagePreview({children}: A4PagePreviewProps) {
    const [pageCount, setPageCount] = useState(1);
    const [contentHeightPx, setContentHeightPx] = useState(0);
    const [pageHeightPx, setPageHeightPx] = useState(() => mmToPx(A4_HEIGHT_MM));
    const contentRef = useRef<HTMLDivElement>(null);
    const pageMeasureRef = useRef<HTMLDivElement>(null);

    const measurePageHeight = useCallback(() => {
        const measured = pageMeasureRef.current?.getBoundingClientRect().height;
        if (measured && measured > 0) {
            setPageHeightPx(measured);
        }
    }, []);

    useEffect(() => {
        measurePageHeight();
        window.addEventListener("resize", measurePageHeight);
        return () => window.removeEventListener("resize", measurePageHeight);
    }, [measurePageHeight]);

    useEffect(() => {
        const element = contentRef.current;
        if (!element) return;

        const measure = () => {
            try {
                measurePageHeight();
                const height = Math.max(
                    element.getBoundingClientRect().height,
                    element.scrollHeight
                );
                setContentHeightPx(height);
            } catch {
                // ignore measurement errors
            }
        };

        measure();

        if (typeof ResizeObserver === "undefined") return;

        let observer: ResizeObserver | null = null;
        try {
            observer = new ResizeObserver(measure);
            observer.observe(element);
        } catch {
            observer = null;
        }

        return () => observer?.disconnect();
    }, [children, measurePageHeight]);

    useEffect(() => {
        setPageCount(getA4PageCount(contentHeightPx, pageHeightPx));
    }, [contentHeightPx, pageHeightPx]);

    const pageWidth = `${A4_WIDTH_MM}mm`;
    const pageHeight = `${A4_HEIGHT_MM}mm`;
    const pageStackHeightPx = pageCount * pageHeightPx;
    const containerHeightPx = Math.max(contentHeightPx, pageStackHeightPx);

    return (
        <Box
            sx={{
                bgcolor: "#b0b0b0",
                borderRadius: 1,
                p: {xs: 1.5, sm: 3},
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                boxSizing: "border-box",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    width: pageWidth,
                    minHeight: containerHeightPx,
                }}
            >
                <Box
                    ref={pageMeasureRef}
                    aria-hidden
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: pageWidth,
                        height: pageHeight,
                        visibility: "hidden",
                        pointerEvents: "none",
                    }}
                />

                <Box
                    aria-hidden
                    sx={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 0,
                    }}
                >
                    {Array.from({length: pageCount}).map((_, index) => (
                        <Box
                            key={index}
                            sx={{
                                position: "absolute",
                                top: index * pageHeightPx,
                                left: 0,
                                width: pageWidth,
                                height: pageHeight,
                                bgcolor: "#fff",
                                boxShadow: "0 2px 14px rgba(0,0,0,0.22)",
                                border: "1px solid rgba(0,0,0,0.08)",
                                boxSizing: "border-box",
                            }}
                        />
                    ))}
                </Box>

                {pageCount > 1 &&
                    Array.from({length: pageCount - 1}).map((_, index) => (
                        <Box
                            key={`page-break-${index}`}
                            aria-hidden
                            sx={{
                                position: "absolute",
                                left: 0,
                                right: 0,
                                top: (index + 1) * pageHeightPx,
                                zIndex: 2,
                                borderTop: "2px dashed",
                                borderColor: "rgba(0,0,0,0.35)",
                                pointerEvents: "none",
                            }}
                        />
                    ))}

                <Box ref={contentRef} sx={{position: "relative", zIndex: 1, width: pageWidth}}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}

export default A4PagePreview;
