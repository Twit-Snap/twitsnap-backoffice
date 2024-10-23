"use client";

import { authenticatedAtom } from "@/types/authTypes";
import axios from "axios";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import {TwitType} from "@/types/twit";
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const TIMEOUT_MSECONDS = 5000;

export default function Twit({ params }: { params: { twit_id: string } }) {
    const [twit, setTwit] = useState<TwitType | null>(null);
    const token = useAtomValue(authenticatedAtom)?.token;
    const [statusMessage, setStatusMessage] = useState(
        <CircularProgress size="20rem" />
    );
    console.log(params);


    useEffect(() => {
        if (!token || !params.twit_id) {
            return;
        }
        console.log('segunda vez',params.twit_id);
        axios
            .get(
                `${process.env.NEXT_PUBLIC_TWIT_SERVER_URL}/snaps/${params.twit_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    timeout: TIMEOUT_MSECONDS,
                }
            )
            .then((response) => {
                setTwit(response.data.data);
                console.log(response.data.data);
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

    return (
        <div>
            {statusMessage}
            {twit && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Content</TableCell>
                                <TableCell>Avatar</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow key={twit.id}>
                                <TableCell>{twit.id}</TableCell>
                                <TableCell>{twit.user.username}</TableCell>
                                <TableCell>{twit.user.name}</TableCell>
                                <TableCell>{twit.createdAt}</TableCell>
                                <TableCell>{twit.content}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
}
