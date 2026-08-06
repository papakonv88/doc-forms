import {FormEvent, useState} from "react";
import {signIn} from "next-auth/react";
import {useRouter} from "next/router";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import {Vaccines} from "@mui/icons-material";

function Login() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        const result = await signIn("credentials", {
            username,
            password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setError("Λάθος όνομα χρήστη ή κωδικός");
            return;
        }

        const callbackUrl =
            typeof router.query.callbackUrl === "string"
                ? router.query.callbackUrl
                : "/";
        await router.replace(callbackUrl);
    };

    return (
        <Box
            minHeight="100vh"
            display="flex"
            alignItems="center"
            sx={{
                background:
                    "radial-gradient(circle at top, rgba(25, 118, 210, 0.12), transparent 45%), #f5f7fa",
            }}
        >
            <Container maxWidth="xs">
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        background: "#ffffff",
                        border: "1px solid rgba(0, 0, 0, 0.08)",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
                    }}
                >
                    <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                        <Box
                            sx={{
                                background: "#1976d2",
                                borderRadius: 2,
                                p: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Vaccines sx={{color: "white"}} />
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight={700}>
                                Σύνδεση
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                ΗΕΓ Πρόγραμμα Πορίσματος
                            </Typography>
                        </Box>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Όνομα χρήστη"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            margin="normal"
                            autoComplete="username"
                            autoFocus
                            required
                        />
                        <TextField
                            fullWidth
                            label="Κωδικός"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            autoComplete="current-password"
                            required
                        />

                        {error && (
                            <Alert severity="error" sx={{mt: 2}}>
                                {error}
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{mt: 3, py: 1.25, textTransform: "none", fontWeight: 600}}
                        >
                            {loading ? (
                                <CircularProgress size={22} color="inherit" />
                            ) : (
                                "Είσοδος"
                            )}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}

export default Login;
