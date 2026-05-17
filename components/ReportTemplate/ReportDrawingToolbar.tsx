import {
    Box,
    Button,
    IconButton,
    Slider,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
} from "@mui/material";
import {
    AutoFixHigh as EraserIcon,
    Brush as BrushIcon,
    Create as PenIcon,
    Gesture as DrawModeIcon,
} from "@mui/icons-material";
import {DrawingTool} from "./ReportDrawingCanvas";

type ReportDrawingToolbarProps = {
    isDrawingMode: boolean;
    onDrawingModeChange: (active: boolean) => void;
    tool: DrawingTool;
    onToolChange: (tool: DrawingTool) => void;
    color: string;
    onColorChange: (color: string) => void;
    lineWidth: number;
    onLineWidthChange: (width: number) => void;
    onClear: () => void;
};

const COLORS = ["#000000", "#1a237e", "#c62828", "#2e7d32"];

function ReportDrawingToolbar({
    isDrawingMode,
    onDrawingModeChange,
    tool,
    onToolChange,
    color,
    onColorChange,
    lineWidth,
    onLineWidthChange,
    onClear,
}: ReportDrawingToolbarProps) {
    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 2,
                mb: 2,
                p: 1.5,
                borderRadius: 1,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
            }}
        >
            <Tooltip title={isDrawingMode ? "Λειτουργία κειμένου" : "Λειτουργία σχεδίου"}>
                <ToggleButton
                    value="draw"
                    selected={isDrawingMode}
                    onChange={() => onDrawingModeChange(!isDrawingMode)}
                    size="small"
                    color="primary"
                >
                    <DrawModeIcon sx={{mr: 0.5}}/>
                    {isDrawingMode ? "Σχεδιαση" : "Σχεδιαση"}
                </ToggleButton>
            </Tooltip>

            <ToggleButtonGroup
                size="small"
                exclusive
                value={tool}
                onChange={(_, value) => value && onToolChange(value)}
                disabled={!isDrawingMode}
            >
                <ToggleButton value="pen">
                    <Tooltip title="Μολύβι">
                        <PenIcon fontSize="small"/>
                    </Tooltip>
                </ToggleButton>
                <ToggleButton value="brush">
                    <Tooltip title="Πινέλο">
                        <BrushIcon fontSize="small"/>
                    </Tooltip>
                </ToggleButton>
                <ToggleButton value="eraser">
                    <Tooltip title="Γόμα">
                        <EraserIcon fontSize="small"/>
                    </Tooltip>
                </ToggleButton>
            </ToggleButtonGroup>

            <Box sx={{display: "flex", alignItems: "center", gap: 1, minWidth: 140, opacity: isDrawingMode ? 1 : 0.5}}>
                <Typography variant="caption" sx={{whiteSpace: "nowrap"}}>
                    Πάχος
                </Typography>
                <Slider
                    size="small"
                    min={1}
                    max={12}
                    value={lineWidth}
                    onChange={(_, value) => onLineWidthChange(value as number)}
                    disabled={!isDrawingMode || tool === "eraser"}
                    sx={{width: 100}}
                />
            </Box>

            <Box sx={{display: "flex", alignItems: "center", gap: 0.5, opacity: isDrawingMode ? 1 : 0.5}}>
                {COLORS.map((swatch) => (
                    <IconButton
                        key={swatch}
                        size="small"
                        disabled={!isDrawingMode || tool === "eraser"}
                        onClick={() => onColorChange(swatch)}
                        sx={{
                            p: 0.25,
                            border: color === swatch ? "2px solid" : "1px solid",
                            borderColor: color === swatch ? "primary.main" : "divider",
                        }}
                    >
                        <Box
                            sx={{
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                bgcolor: swatch,
                            }}
                        />
                    </IconButton>
                ))}
                <input
                    type="color"
                    value={color}
                    disabled={!isDrawingMode || tool === "eraser"}
                    onChange={(e) => onColorChange(e.target.value)}
                    style={{width: 32, height: 28, border: "none", cursor: "pointer"}}
                />
            </Box>

            <Button size="small" variant="outlined" disabled={!isDrawingMode} onClick={onClear}>
                Καθαρισμος
            </Button>
        </Box>
    );
}

export default ReportDrawingToolbar;
