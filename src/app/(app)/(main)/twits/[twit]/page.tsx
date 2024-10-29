"use client";

import { authenticatedAtom } from "@/types/authTypes";
import axios from "axios";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import {TwitType} from "@/types/twit";
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from "@mui/material";

const TIMEOUT_MSECONDS = 5000;

export default function Twit({ params }: { params: { twit: string } }) {
    const [twit, setTwit] = useState<TwitType | null>(null);
    const token = useAtomValue(authenticatedAtom)?.token;
    const [statusMessage, setStatusMessage] = useState(
        <CircularProgress size="10rem" />
    );

    useEffect(() => {
        if (!token || !params.twit) {
            return;
        }

        axios
            .get(
                `${process.env.NEXT_PUBLIC_TWIT_SERVER_URL}/snaps/${params.twit}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    timeout: TIMEOUT_MSECONDS,
                }
            )
            .then((response) => {
                setTwit(response.data.data);

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
                                Oops!. This twit does not exist!
                            </label>
                        );
                    }
                }
            });
    }, []);

    if (!twit) {
        return (
            <div className="w-full h-full flex justify-center place-items-center">
                    {statusMessage}
            </div>
        );
    }
    //{loading && <CircularProgress size="10rem" />}
    //{error && <div className="error-message">{error}</div>}
    return (
        <div>

            {twit && (
                <TableContainer
                    component={Paper}
                    sx={{
                        height: '100%',
                        width: '100%',
                        overflowX: 'auto',
                        backgroundColor: '#25252b'
                    }}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{
                                    whiteSpace: 'nowrap',
                                    color: '#b6b4b4',
                                    borderColor: '#444444'
                                }}>
                                    <strong>ID:</strong>
                                </TableCell>
                                <TableCell component="th" scope="row" sx={{
                                    whiteSpace: 'nowrap',
                                    color: '#b6b4b4',
                                    borderColor: '#444444'
                                }}>
                                    {twit.id}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{
                                    whiteSpace: 'nowrap',
                                    color: '#b6b4b4',
                                    borderColor: '#444444'
                                }}>
                                    <strong>Username:</strong>
                                </TableCell>
                                <TableCell component="th" scope="row" sx={{
                                    whiteSpace: 'nowrap',
                                    color: '#b6b4b4',
                                    borderColor: '#444444'
                                }}>
                                    {twit.user.username}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{
                                    whiteSpace: 'nowrap',
                                    color: '#b6b4b4',
                                    borderColor: '#444444'
                                }}>
                                <strong>Name:</strong>
                                </TableCell>
                                <TableCell component="th" scope="row" sx={{
                                    whiteSpace: 'nowrap',
                                    color: '#b6b4b4',
                                    borderColor: '#444444'
                                }}>
                                    {twit.user.name}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{
                                    whiteSpace: 'nowrap',
                                    color: '#b6b4b4',
                                    borderColor: '#444444'
                                }}>
                                    <strong>Created At:</strong>
                                </TableCell>
                                <TableCell component="th" scope="row" sx={{
                                    whiteSpace: 'nowrap',
                                    color: '#b6b4b4',
                                    borderColor: '#444444'
                                }}>
                                    {new Date(twit.createdAt).toLocaleString()}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{
                                    whiteSpace: 'nowrap',
                                    color: '#b6b4b4',
                                    borderColor: '#444444'
                                }}>
                                    <strong>Content:</strong>
                                </TableCell>
                                <TableCell component="th" scope="row" sx={{
                                    whiteSpace: 'nowrap',
                                    color: '#b6b4b4',
                                    borderColor: '#444444'
                                }}>{twit.content}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{
                                    whiteSpace: 'nowrap',
                                    color: '#b6b4b4',
                                    borderColor: '#444444'
                                }}>
                                    <strong>Avatar:</strong>
                                </TableCell>
                                <TableCell component="th" scope="row" sx={{
                                    whiteSpace: 'nowrap',
                                    color: '#b6b4b4',
                                    borderColor: '#444444'
                                }}>
                                    <img
                                        //src={twit.user.avatar} // Asegúrate de que este campo exista
                                        alt={`${twit.user.username}'s avatar`}
                                        style={{ width: '50px', height: '50px', borderRadius: '50%' }} // Estilo para mostrar como círculo
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
}
