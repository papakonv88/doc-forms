import {useCallback, useEffect, useRef} from "react";
import {Box} from "@mui/material";

export type DrawingTool = "pen" | "brush" | "eraser";

type ReportDrawingCanvasProps = {
    active: boolean;
    tool: DrawingTool;
    color: string;
    lineWidth: number;
    dataUrl: string;
    onChange: (dataUrl: string) => void;
};

function getLineWidth(tool: DrawingTool, lineWidth: number): number {
    if (tool === "pen") return Math.max(1, lineWidth * 0.5);
    if (tool === "brush") return lineWidth;
    return Math.max(12, lineWidth * 4);
}

function ReportDrawingCanvas({
    active,
    tool,
    color,
    lineWidth,
    dataUrl,
    onChange,
}: ReportDrawingCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawingRef = useRef(false);
    const lastPointRef = useRef<{x: number; y: number} | null>(null);
    const loadedDataUrlRef = useRef<string>("");

    const paintSnapshot = useCallback((snapshot: string) => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = container.clientWidth;
        const height = container.clientHeight;
        if (width === 0 || height === 0) return;

        ctx.clearRect(0, 0, width, height);
        if (!snapshot) return;

        const image = new Image();
        image.onload = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(image, 0, 0, width, height);
        };
        image.src = snapshot;
    }, []);

    const clearCanvas = useCallback(() => {
        loadedDataUrlRef.current = "";
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = container.clientWidth;
        const height = container.clientHeight;
        ctx.clearRect(0, 0, width, height);
    }, []);

    const resizeCanvas = useCallback(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const width = container.clientWidth;
        const height = container.clientHeight;
        if (width === 0 || height === 0) return;

        const ratio = window.devicePixelRatio || 1;
        canvas.width = Math.floor(width * ratio);
        canvas.height = Math.floor(height * ratio);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        paintSnapshot(dataUrl);
    }, [dataUrl, paintSnapshot]);

    useEffect(() => {
        resizeCanvas();
        const container = containerRef.current;
        if (!container) return;

        if (typeof ResizeObserver === "undefined") return;

        let observer: ResizeObserver | null = null;
        try {
            observer = new ResizeObserver(() => resizeCanvas());
            observer.observe(container);
        } catch {
            observer = null;
        }

        return () => observer?.disconnect();
    }, [resizeCanvas]);

    useEffect(() => {
        if (dataUrl === loadedDataUrlRef.current) return;

        if (!dataUrl) {
            clearCanvas();
            return;
        }

        loadedDataUrlRef.current = dataUrl;
        paintSnapshot(dataUrl);
    }, [clearCanvas, dataUrl, paintSnapshot]);

    const getPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    };

    const beginStroke = (ctx: CanvasRenderingContext2D) => {
        const width = getLineWidth(tool, lineWidth);

        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = width;

        if (tool === "eraser") {
            ctx.globalCompositeOperation = "destination-out";
            ctx.strokeStyle = "rgba(0,0,0,1)";
        } else {
            ctx.globalCompositeOperation = "source-over";
            ctx.strokeStyle = color;
        }
    };

    const saveCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const next = canvas.toDataURL("image/png");
        loadedDataUrlRef.current = next;
        onChange(next);
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
        if (!active) return;
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);

        const canvas = canvasRef.current;
        const point = getPoint(event);
        if (!canvas || !point) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        isDrawingRef.current = true;
        lastPointRef.current = point;
        beginStroke(ctx);
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(point.x + 0.01, point.y + 0.01);
        ctx.stroke();
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
        if (!active || !isDrawingRef.current) return;
        event.preventDefault();

        const canvas = canvasRef.current;
        const point = getPoint(event);
        const last = lastPointRef.current;
        if (!canvas || !point || !last) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        beginStroke(ctx);
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();

        lastPointRef.current = point;
    };

    const endStroke = (event: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isDrawingRef.current) return;
        isDrawingRef.current = false;
        lastPointRef.current = null;

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }

        saveCanvas();
    };

    const cursor =
        tool === "eraser" ? "cell" : tool === "brush" ? "crosshair" : "crosshair";

    return (
        <Box
            ref={containerRef}
            sx={{
                position: "absolute",
                inset: 0,
                zIndex: 10,
                pointerEvents: "none",
            }}
        >
            <Box
                component="canvas"
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={endStroke}
                onPointerLeave={endStroke}
                onPointerCancel={endStroke}
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: active ? "auto" : "none",
                    cursor: active ? cursor : "default",
                    touchAction: "none",
                }}
            />
        </Box>
    );
}

export default ReportDrawingCanvas;
