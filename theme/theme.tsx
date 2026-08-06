import {createTheme} from "@mui/material/styles";
import {elGR} from "@mui/material/locale";

export const lightTheme = createTheme(
    {
        palette: {
            mode: "light",
            primary: {
                main: "#1976d2",
            },
            background: {
                default: "#f5f7fa",
                paper: "#ffffff",
            },
        },
    },
    elGR,
);
