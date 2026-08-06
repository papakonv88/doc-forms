import type {AppProps} from 'next/app'
import {ThemeProvider} from '@mui/material/styles';
import {SessionProvider} from "next-auth/react";
import {useRouter} from "next/router";
import './../styles/globals.css'
import Appbar from "../components/AppBar/Appbar";
import {AppProvider} from "../context";
import {CssBaseline} from "@mui/material";
import {lightTheme} from "../theme/theme";

export default function MyApp({Component, pageProps}: AppProps) {
    const router = useRouter();
    const hideAppBar = router.pathname === "/login";

    return (
        <SessionProvider session={pageProps.session}>
            <ThemeProvider theme={lightTheme}>
                <CssBaseline />
                <AppProvider>
                    {!hideAppBar && <Appbar/>}
                    <Component {...pageProps} />
                </AppProvider>
            </ThemeProvider>
        </SessionProvider>
    )
}
