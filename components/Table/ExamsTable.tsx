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
    Menu,
    MenuItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {useRouter} from "next/router";
import {validateAndFormatDate, validateText} from "../../utils";


function ExamsTable({exams}: any) {
    const [search, setSearch] = useState(""); // Search state
    const [filteredData, setFilteredData] = useState(exams); // Filtered data state
    const [page, setPage] = useState(0); // Current page
    const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page
    const [anchorEl, setAnchorEl] = useState(null); // Anchor for menu
    const [selectedRowId, setSelectedRowId] = useState(null); // Track selected row
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
                ...row.patient,
                aitia_eksetasis: row.aitia_eksetasis.string, // Include nested fields
            })
                .join(" ")
                .toLowerCase()
                .includes(value)
        );

        setFilteredData(filtered);
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

    // Open menu for a specific row
    const handleMenuOpen = (event, rowId) => {
        setAnchorEl(event.currentTarget);
        setSelectedRowId(rowId);
    };

    // Close menu
    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRowId(null);
    };

    const paginatedData = filteredData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <div>
            <TextField
                label="Αναζήτηση"
                variant="standard"
                fullWidth
                value={search}
                onChange={handleSearch}
                sx={{marginBottom: 5, marginTop: 8}}
            />

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className={'table-row'}>Κωδικός Εξέτασης</TableCell>
                            <TableCell className={'table-row'}>Ημερομηνία Καταγραφής</TableCell>
                            <TableCell className={'table-row'}>Αιτία Εξέτασης</TableCell>
                            <TableCell className={'table-row'}>Όνομα Ασθενή</TableCell>
                            <TableCell className={'table-row'}>Επώνυμο Ασθενή</TableCell>
                            <TableCell className={'table-row'}>Πατρώνυμο</TableCell>
                            <TableCell className={'table-row'}>AMKA</TableCell>
                            <TableCell className={'table-row'}>Ενέργειες</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.examId}</TableCell>
                                <TableCell>{validateAndFormatDate(row.imerominia_katagrafis)}</TableCell>
                                <TableCell>{validateText(row.aitia_eksetasis.string)}</TableCell>
                                <TableCell>{validateText(row.patient.name)}</TableCell>
                                <TableCell>{validateText(row.patient.surname)}</TableCell>
                                <TableCell>{validateText(row.patient.patronimo)}</TableCell>
                                <TableCell>{validateText(row.patient.amka)}</TableCell>
                                <TableCell>
                                    <IconButton
                                        aria-controls="action-menu"
                                        aria-haspopup="true"
                                        onClick={(e) => handleMenuOpen(e, row._id)}
                                    >
                                        <MoreVertIcon/>
                                    </IconButton>
                                    <Menu
                                        id="action-menu"
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl) && selectedRowId === row._id}
                                        onClose={handleMenuClose}
                                    >
                                        <MenuItem onClick={() => goToExam(row.examId)}>Εξέταση</MenuItem>
                                        <MenuItem onClick={() => goToReport(row.examId)}>Πόρισμα</MenuItem>
                                    </Menu>
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
