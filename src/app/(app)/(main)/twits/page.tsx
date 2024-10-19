"use client";

import { CircularProgress } from "@mui/material";
import { useAtomValue } from "jotai";
import { authenticatedAtom } from "@/types/authTypes";
import axios from "axios";
import {useCallback, useEffect, useMemo, useState} from "react";
import { TwitType } from "@/types/twit";
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TablePagination from '@mui/material/TablePagination';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TableFooter from '@mui/material/TableFooter';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

const TIMEOUT_MSECONDS = 5000;

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

export default function Twits() {
    const [twits, setTwits] = useState<TwitType[] | null>(null);
    const [totalTwits, setTotalTwits] = useState(0);
    const token = useAtomValue(authenticatedAtom)?.token;
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [statusMessage, setStatusMessage] = useState(
        <CircularProgress size="20rem" />
    );

    const emptyRows = useMemo(() => {
        return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - twits?.length) : 0;
    }, [page, rowsPerPage, twits?.length]);


    const  handleChangePage= useCallback(
         (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
            setPage(newPage);
            fetchTwits(newPage, rowsPerPage);
            fetchTotalAmountOfTwits();

    }, [page, rowsPerPage]);


    const handleChangeRowsPerPage = useCallback(
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const newRowsPerPage = parseInt(event.target.value, 10);
            console.log(newRowsPerPage);
            setRowsPerPage(newRowsPerPage);
            setPage(0);


            fetchTwits(0, newRowsPerPage);
            fetchTotalAmountOfTwits();
        },
        [page, rowsPerPage]
    );

    const fetchTotalAmountOfTwits = async () => {
        if (!token) return;

        axios
            .get(`${process.env.NEXT_PUBLIC_TWIT_SERVER_URL}/snaps/amount`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: TIMEOUT_MSECONDS,
            })
            .then((response) => {
                setTotalTwits(response.data.data);
            })
            .catch((error) => {
                if (error.code === "ECONNABORTED") {
                    setStatusMessage(
                        <label className="text-[1.1rem] text-[rgb(255,75,75)] font-[500]">
                            Looks like the server is taking to long to respond,
                            please try again in sometime
                        </label>
                    );
                } else {
                    if ((error.status & 500) === 500) {
                        setStatusMessage(
                            <label className="text-[1.1rem] text-[rgb(255,75,75)] font-[500]">
                                Server error occurred, please try again later
                            </label>
                        );
                    } else {
                        setStatusMessage(
                            <label className="text-[1.1rem] text-[rgb(255,75,75)] font-[500]">
                                Oops!, this content does not exist!
                            </label>
                        );
                    }
                }
            });
    }

    const fetchTwits = async (page: number, limit: number) => {
        if (!token) return;

        const queryParams = {
            limit: limit,
            offset: (limit * page),
        };

        axios
            .get(`${process.env.NEXT_PUBLIC_TWIT_SERVER_URL}/snaps`, {
                headers: {
                    Authorization: `Bearer ${token}`,

                },
                params: queryParams as object | undefined,
                timeout: TIMEOUT_MSECONDS,
            })
            .then((response) => {
                setTwits(response.data.data);
            })
            .catch((error) => {
                if (error.code === "ECONNABORTED") {
                    setStatusMessage(
                        <label className="text-[1.1rem] text-[rgb(255,75,75)] font-[500]">
                            Looks like the server is taking to long to respond,
                            please try again in sometime
                        </label>
                    );
                } else {
                    if ((error.status & 500) === 500) {
                        setStatusMessage(
                            <label className="text-[1.1rem] text-[rgb(255,75,75)] font-[500]">
                                Server error occurred, please try again later
                            </label>
                        );
                    } else {
                        setStatusMessage(
                            <label className="text-[1.1rem] text-[rgb(255,75,75)] font-[500]">
                                Oops!, this content does not exist!
                            </label>
                        );
                    }
                }
            });

    }

    useEffect(() => {
        fetchTwits(page, rowsPerPage);
        fetchTotalAmountOfTwits();
    }, []);


    if (!twits) {
        return (
            <div className="w-full h-full flex justify-center place-items-center">
                {statusMessage}
            </div>
        );
    }


    return (
        <TableContainer
            component={Paper}
            sx={{
                height: '100%',
                width: '100%',
                overflowX: 'auto',
            }}
        >

            <Table sx={{ minWidth: '80%' }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Id</TableCell>
                        <TableCell align="left">Username</TableCell>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="left">Date</TableCell>
                        <TableCell align="left">Content</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(twits).map((twit)  => (
                        <TableRow
                            key={twit.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row" sx={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '50px'
                            }}>
                                {twit.id}
                            </TableCell>
                            <TableCell align="left" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {twit.user.username}
                            </TableCell>
                            <TableCell align="left" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {twit.user.name}
                            </TableCell>
                            <TableCell align="left" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {twit.createdAt}
                            </TableCell>
                            <TableCell align="left" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {twit.content}
                            </TableCell>
                        </TableRow>
                    ))}
                    {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={6} />
                        </TableRow>
                    )}

                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 20, { label: 'All', value: -1 }]}
                            colSpan={3}
                            count={totalTwits || 0}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            slotProps={{
                                select: {
                                    inputProps: {
                                        'aria-label': 'rows per page',
                                    },
                                    native: true,
                                },
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}


