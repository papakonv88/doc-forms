export const REPORT_BODY_FONT = '"Times New Roman", Times, serif';
export const REPORT_BODY_FONT_SIZE = "12pt";
export const REPORT_BODY_LINE_HEIGHT = 1.5;

export const reportBodyTextSx = {
    fontFamily: REPORT_BODY_FONT,
    fontSize: REPORT_BODY_FONT_SIZE,
    lineHeight: REPORT_BODY_LINE_HEIGHT,
    color: "#000",
} as const;

export const reportSectionTitleSx = {
    ...reportBodyTextSx,
    fontWeight: 700,
    mb: 0.75,
} as const;

export const reportSectionHeadingSx = {
    ...reportBodyTextSx,
    fontWeight: 700,
    mb: 0.5,
} as const;

export const reportDetailTextSx = {
    ...reportBodyTextSx,
    mb: 0.6,
} as const;

export const reportEditableTextSx = {
    ...reportBodyTextSx,
    whiteSpace: "pre-wrap" as const,
    outline: "none",
    minHeight: "1.5em",
    cursor: "text",
    "& strong, & b": {
        fontWeight: 700,
    },
};
