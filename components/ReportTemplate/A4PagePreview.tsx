import {ReactNode, useEffect, useRef, useState} from "react";
import {Box} from "@mui/material";
import {A4_HEIGHT_MM, A4_WIDTH_MM, getA4PageCount, mmToPx} from "../../utils/a4";

const PAGE_GAP_PX = 16;

type A4PagePreviewProps = {
    children: ReactNode;
};

function A4PagePreview({children}: A4PagePreviewProps) {
    const [pageCount, setPageCount] = useState(1);
    const [contentHeightPx, setContentHeightPx] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = contentRef.current;
        if (!element) return;

        const measure = () => {
            try {
                const height = Math.max(
                    element.getBoundingClientRect().height,
                    element.scrollHeight
                );
                setContentHeightPx(height);
                setPageCount(getA4PageCount(height));
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
    }, [children]);

    const pageHeight = `${A4_HEIGHT_MM}mm`;
    const pageWidth = `${A4_WIDTH_MM}mm`;
    const singlePageHeightPx = mmToPx(A4_HEIGHT_MM);
    const pageStackHeightPx =
        pageCount * singlePageHeightPx + Math.max(0, pageCount - 1) * PAGE_GAP_PX;
    const containerMinHeightPx = Math.max(contentHeightPx, pageStackHeightPx);

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
                minHeight: containerMinHeightPx + 48,
                boxSizing: "border-box",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    width: pageWidth,
                    minHeight: containerMinHeightPx,
                }}
            >
                <Box
                    aria-hidden
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: pageWidth,
                        height: pageStackHeightPx,
                        zIndex: 0,
                    }}
                >
                    {Array.from({length: pageCount}).map((_, index) => (
                        <Box
                            key={index}
                            sx={{
                                width: pageWidth,
                                height: pageHeight,
                                bgcolor: "#fff",
                                boxShadow: "0 2px 14px rgba(0,0,0,0.22)",
                                border: "1px solid rgba(0,0,0,0.08)",
                                boxSizing: "border-box",
                                mb: index < pageCount - 1 ? `${PAGE_GAP_PX}px` : 0,
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
                                top: (index + 1) * singlePageHeightPx + index * PAGE_GAP_PX - 1,
                                zIndex: 2,
                                borderTop: "2px dashed",
                                borderColor: "rgba(0,0,0,0.2)",
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
