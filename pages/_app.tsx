import type {AppProps} from 'next/app'
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {elGR} from '@mui/material/locale';
import './../styles/globals.css'
import Appbar from "../components/AppBar/Appbar";
import {AppProvider} from "../context";

const theme = createTheme(
    elGR,
);

export default function MyApp({Component, pageProps}: AppProps) {
    return (
        <ThemeProvider theme={theme}>
            <AppProvider>
                <Appbar/>
                <Component {...pageProps} />
            </AppProvider>
        </ThemeProvider>
    )
}
