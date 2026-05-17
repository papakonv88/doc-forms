import {Box, Button, Typography} from "@mui/material";
import {Component, ErrorInfo, ReactNode} from "react";

type ErrorBoundaryProps = {
    children: ReactNode;
    fallback?: (error: Error, reset: () => void) => ReactNode;
};

type ErrorBoundaryState = {
    error: Error | null;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = {error: null};

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {error};
    }

    componentDidCatch(error: Error, info: ErrorInfo): void {
        if (typeof window !== "undefined") {
            // eslint-disable-next-line no-console
            console.error("ErrorBoundary caught:", error, info);
        }
    }

    reset = (): void => {
        this.setState({error: null});
    };

    render(): ReactNode {
        const {error} = this.state;
        if (!error) return this.props.children;

        if (this.props.fallback) {
            return this.props.fallback(error, this.reset);
        }

        return (
            <Box sx={{maxWidth: 720, mx: "auto", mt: 6, p: 3, textAlign: "center"}}>
                <Typography variant="h6" color="error" gutterBottom>
                    Παρουσιάστηκε σφάλμα κατά την προβολή της σελίδας
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{mb: 3, whiteSpace: "pre-wrap"}}>
                    {error.message}
                </Typography>
                <Button variant="contained" onClick={this.reset}>
                    Δοκιμάστε ξανά
                </Button>
            </Box>
        );
    }
}

export default ErrorBoundary;
