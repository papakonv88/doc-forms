// pages/index.tsx
import React, {useState} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    TextField,
    IconButton,
    Chip,
    Tooltip,
    Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import {useRouter} from "next/router";
import {validateAndFormatDate, validateText} from "../../utils";

function getRecordingDateValue(row: any): number {
    const value = row?.imerominia_katagrafis;
    if (!value) return 0;
    const time = new Date(value).getTime();
    return Number.isNaN(time) ? 0 : time;
}

function sortByRecordingDateDesc(rows: any[]): any[] {
    return [...rows].sort(
        (a, b) => getRecordingDateValue(b) - getRecordingDateValue(a)
    );
}

function ExamsTable({exams}: any) {
    const [search, setSearch] = useState(""); // Search state
    const [filteredData, setFilteredData] = useState(() => sortByRecordingDateDesc(exams)); // Filtered data state
    const [page, setPage] = useState(0); // Current page
    const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page
    const router = useRouter();

    const goToExam = (id) => {
        router.push(`/exams/${id}`);
    };

    const goToReport = (id) => {
        router.push(`/report?id=${id}`);
    };

    // Handle search input change
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);

        // Filter data based on all fields
        const filtered = exams.filter((row: any) =>
            Object.values({
                ...row,
                ...(row.patient ?? {}),
                aitia_eksetasis: row.aitia_eksetasis?.string ?? '', // Include nested fields
            })
                .join(" ")
                .toLowerCase()
                .includes(value)
        );

        setFilteredData(sortByRecordingDateDesc(filtered));
        setPage(0); // Reset to first page on search
    };

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page on rows per page change
    };

    const paginatedData = filteredData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <div>
            <TextField
                label="Αναζήτηση εξετάσεων..."
                variant="outlined"
                fullWidth
                value={search}
                onChange={handleSearch}
                sx={{
                    marginBottom: 4,
                    marginTop: 4,
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'background.paper',
                    }
                }}
                InputProps={{
                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                }}
            />

            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: 3,
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                            <TableCell
                                className={'table-row'}
                                sx={{
                                    fontWeight: 700,
                                    color: 'text.primary',
                                    borderBottom: '2px solid #1976d2',
                                    py: 2
                                }}
                            >
                                Κωδικός Εξέτασης
                            </TableCell>
                            <TableCell
                                className={'table-row'}
                                sx={{
                                    fontWeight: 700,
                                    color: 'text.primary',
                                    borderBottom: '2px solid #1976d2',
                                    py: 2
                                }}
                            >
                                Ημερομηνία Καταγραφής
                            </TableCell>
                            <TableCell
                                className={'table-row'}
                                sx={{
                                    fontWeight: 700,
                                    color: 'text.primary',
                                    borderBottom: '2px solid #1976d2',
                                    py: 2
                                }}
                            >
                                Αιτία Εξέτασης
                            </TableCell>
                            <TableCell
                                className={'table-row'}
                                sx={{
                                    fontWeight: 700,
                                    color: 'text.primary',
                                    borderBottom: '2px solid #1976d2',
                                    py: 2
                                }}
                            >
                                Όνομα Ασθενή
                            </TableCell>
                            <TableCell
                                className={'table-row'}
                                sx={{
                                    fontWeight: 700,
                                    color: 'text.primary',
                                    borderBottom: '2px solid #1976d2',
                                    py: 2
                                }}
                            >
                                Επώνυμο Ασθενή
                            </TableCell>
                            <TableCell
                                className={'table-row'}
                                sx={{
                                    fontWeight: 700,
                                    color: 'text.primary',
                                    borderBottom: '2px solid #1976d2',
                                    py: 2
                                }}
                            >
                                Πατρώνυμο
                            </TableCell>
                            <TableCell
                                className={'table-row'}
                                sx={{
                                    fontWeight: 700,
                                    color: 'text.primary',
                                    borderBottom: '2px solid #1976d2',
                                    py: 2
                                }}
                            >
                                AMKA
                            </TableCell>
                            <TableCell
                                className={'table-row'}
                                sx={{
                                    fontWeight: 700,
                                    color: 'text.primary',
                                    borderBottom: '2px solid #1976d2',
                                    py: 2
                                }}
                            >
                                Ενέργειες
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                    },
                                }}
                            >
                                <TableCell sx={{ py: 2, fontWeight: 500 }}>
                                    <Chip
                                        label={row.examId}
                                        color="primary"
                                        variant="outlined"
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell sx={{ py: 2 }}>
                                    {validateAndFormatDate(row.imerominia_katagrafis)}
                                </TableCell>
                                <TableCell sx={{ py: 2 }}>
                                    {validateText(row.aitia_eksetasis.string)}
                                </TableCell>
                                <TableCell sx={{ py: 2, fontWeight: 500 }}>
                                    {validateText(row.patient?.name)}
                                </TableCell>
                                <TableCell sx={{ py: 2, fontWeight: 500 }}>
                                    {validateText(row.patient?.surname)}
                                </TableCell>
                                <TableCell sx={{ py: 2 }}>
                                    {validateText(row.patient?.patronimo)}
                                </TableCell>
                                <TableCell sx={{ py: 2, fontFamily: 'monospace' }}>
                                    {validateText(row.patient?.amka)}
                                </TableCell>
                                <TableCell sx={{ py: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Tooltip title="Εξέταση" arrow>
                                            <IconButton
                                                aria-label="Εξέταση"
                                                onClick={() => goToExam(row.examId)}
                                                size="small"
                                                color="inherit"
                                            >
                                                <VisibilityOutlinedIcon fontSize="small"/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Πόρισμα" arrow>
                                            <IconButton
                                                aria-label="Πόρισμα"
                                                onClick={() => goToReport(row.examId)}
                                                size="small"
                                                color="inherit"
                                            >
                                                <SummarizeOutlinedIcon fontSize="small"/>
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={filteredData.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage="Εγγραφές ανά σελίδα"
            />
        </div>
    );
}

export default ExamsTable;
