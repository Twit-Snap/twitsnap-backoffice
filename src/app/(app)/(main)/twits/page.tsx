"use client";

import {
    Avatar,
    CircularProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from "@mui/material";
import Link from "next/link";
import { useAtomValue } from "jotai";
import { authenticatedAtom } from "@/types/authTypes";
import axios from "axios";
import { useEffect, useState } from "react";
import { TwitType } from "@/types/twit";
import { TableComponent } from "./TableComponent";

const TIMEOUT_MSECONDS = 5000;

export default function Users() {
    const [twits, setTwits] = useState<TwitType[] | null>(null);
    const token = useAtomValue(authenticatedAtom)?.token;
    const [statusMessage, setStatusMessage] = useState(
        <CircularProgress size="20rem" />
    );



    useEffect(() => {
        if (!token) {
            return;
        }
        console.log(process.env.NEXT_PUBLIC_TWTIS_URL);
        console.log(token);

        const queryParams = {
            limit: 20,
            byFollowed: false
        };
        axios
            .get(`${process.env.NEXT_PUBLIC_TWIT_SERVER_URL}/snaps`, {
                headers: {
                    Authorization: `Bearer ${token}`,

                },
                params: queryParams as object | undefined,
                timeout: TIMEOUT_MSECONDS,
            })
            .then((response) => setTwits(response.data.data))
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
    }, [token, setStatusMessage, setTwits]);

    if (!twits) {
        return (
            <div className="w-full h-full flex justify-center place-items-center">
                {statusMessage}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen min-w-full">
            <div className="w-full h-full border-[rgb(81,81,81)] border-l border-r">
                <TableComponent data={twits} />
            </div>
        </div>
    );


}

