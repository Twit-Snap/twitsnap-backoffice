"use client";

import { authenticatedAtom } from "@/types/authTypes";
import axios from "axios";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import {TwitType} from "@/types/twit";
import {
    CircularProgress,
    Avatar,
    List, ListItem, ListItemText
} from "@mui/material";

const TIMEOUT_MSECONDS = 5000;

export default function Twit({ params }: { params: { twit: string } }) {
    const [twit, setTwit] = useState<TwitType | null>(null);
    const token = useAtomValue(authenticatedAtom)?.token;
    const [statusMessage, setStatusMessage] = useState(
        <CircularProgress size="10rem" />
    );
    const [loading, setLoading] = useState(false);

    const fetchData = async () =>{
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
    }
    useEffect(() => {
        setLoading(true);
        fetchData();
        setLoading(false);
    }, []);


    const formatDate = (dateString: string ) => {
        return new Date(dateString).toLocaleString()
    };


    if (!twit || loading) {
        return (
            <div className="w-full h-full flex justify-center place-items-center">
                    {statusMessage}
            </div>
        );
    }

    return (
        <div className="mx-10 py-6 h-full flex flex-col items-start">


            {/* Contenedor de la imagen con estilo de subtítulo */}
            <div className="bg-[#868686] shadow rounded-full p-2 flex items-start  mb-10">
                <Avatar
                    className="w-24 h-24 rounded-full"
                    src="data:image/webp;base64,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"
                />
            </div>
            <List style={{backgroundColor: '#25252b', color: '#b6b4b4'}} className="w-full overflow-auto max-h-full">
                {Object.entries(twit).filter(([key]) =>
                    key !== 'userLiked' && key !== 'user' && key!== 'entities'
                ).map(([k, v]) => (
                    <div className="px-2" key={`${k}`}>
                        <ListItem>
                            <ListItemText
                                primary={
                                    <>
                                        <label className="font-bold capitalize cursor-text text-customTextColor">
                                            {k}
                                        </label>
                                        <hr className="border-t border-customBorder my-4 "/>
                                    </>
                                }
                                secondary={
                                    <label className="pl-3 cursor-text text-customTextColor">
                                        {k === 'createdAt' ? formatDate(v) : `${v}`}
                                    </label>
                                }></ListItemText>
                        </ListItem>
                    </div>
                ))}
                {Object.entries(twit.user || {}).filter(([key]) =>

                    ['name', 'username'].includes(key)
                ).map(([k, v]) => (
                    <div className="px-2" key={`user-${k}`}>
                        <ListItem>
                            <ListItemText
                                primary={
                                    <>
                                        <label className="font-bold capitalize cursor-text text-customTextColor">
                                            {k}
                                        </label>
                                        <hr className="border-t border-customBorder my-4"/>
                                    </>
                                }
                                secondary={
                                    <label className="pl-3 cursor-text text-customTextColor">{`${v}`}</label>
                                }/>
                        </ListItem>
                    </div>
                ))}
                {Object.entries(twit.entities || {})
                    .filter(([key]) => ['hashtags'].includes(key))
                    .map(([k, v]) => (
                        <div className="px-2" key={`user-${k}`}>
                            <ListItem>
                                <ListItemText
                                    primary={
                                        <>
                                            <label className="font-bold capitalize cursor-text text-customTextColor">
                                                {k}
                                            </label>
                                            <hr className="border-t border-customBorder my-4" />
                                        </>
                                    }
                                    secondary={
                                        <label className="pl-3 cursor-text text-customTextColor">
                                            {Array.isArray(v) ? v.map(item => item.text).join(', ') : ''} {/* Cambia 'text' según la estructura de tu objeto */}
                                        </label>
                                    }
                                />
                            </ListItem>
                        </div>
                    ))}
            </List>
        </div>
    );
}
