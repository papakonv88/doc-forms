import type {AppProps} from 'next/app'
import {ThemeProvider} from '@mui/material/styles';
import './../styles/globals.css'
import Appbar from "../components/AppBar/Appbar";
import {AppProvider} from "../context";
import {CssBaseline} from "@mui/material";
import {darkTheme} from "../theme/theme";

export default function MyApp({Component, pageProps}: AppProps) {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <AppProvider>
                <Appbar/>
                <Component {...pageProps} />
            </AppProvider>
        </ThemeProvider>
    )
}
