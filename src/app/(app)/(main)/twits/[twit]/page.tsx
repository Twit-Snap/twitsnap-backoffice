"use client";

import {authenticatedAtom} from "@/types/authTypes";
import axios from "axios";
import {useAtomValue} from "jotai";
import {useEffect, useState} from "react";
import {TwitType} from "@/types/twit";
import {
    CircularProgress,
    Avatar,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import {useRouter} from "next/navigation";
import default_avatar from "@/assets/no-profile-picture.png";

const TIMEOUT_MSECONDS = 5000;

export default function Twit({params}: { params: { twit: string } }) {
    const [twit, setTwit] = useState<TwitType | null>(null);
    const token = useAtomValue(authenticatedAtom)?.token;
    const [statusMessage, setStatusMessage] = useState(
        <CircularProgress size="10rem"/>
    );
    const [loading, setLoading] = useState(false);

    const fetchData = async (queryParams: object | undefined) => {
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
                    params: queryParams as object | undefined,
                    timeout: TIMEOUT_MSECONDS,
                }
            )
            .then((response) => {
                console.log(response.data.data);
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
    };
    useEffect(() => {
        setLoading(true);
        const queryParams = {withEntities: true};
        fetchData(queryParams);
        setLoading(false);
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const router = useRouter();

    const handleUserClick = (username: string) => {
        router.push(`/users/${username}`);
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
            <div
                className="bg-[#868686] shadow rounded-full flex items-start  mb-10 hover:cursor-pointer"
                //style={{ width: '96px', height: '96px' }}
                onClick={() => handleUserClick(twit?.user.username)}>
                <Avatar
                    className="w-20 h-20 rounded-full"
                    //style={{ width: '100%', height: '100%' }}
                    src={twit.user.profilePicture ? twit.user.profilePicture : default_avatar.src}

                />
            </div>
            <List
                style={{backgroundColor: "#25252b", color: "#b6b4b4"}}
                className="w-full overflow-auto max-h-full">
                {Object.entries(twit)
                    .filter(
                        ([key]) =>
                            key !== "userLiked" &&
                            key !== "user" &&
                            key !== "entities"
                    )
                    .map(([k, v]) => (
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
                                            {k === "createdAt"
                                                ? formatDate(v as string)
                                                : `${v}`}
                                        </label>
                                    }></ListItemText>
                            </ListItem>
                        </div>
                    ))}
                {Object.entries(twit.user || {})
                    .filter(([key]) => ["username"].includes(key))
                    .map(([k, v]) => (
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
                                    }
                                />
                            </ListItem>
                        </div>
                    ))}
                {Object.entries(twit.entities || {})
                    .filter(([key]) => ["hashtags"].includes(key))
                    .map(([k, v]) => (
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
                                        <label className="pl-3 cursor-text text-customTextColor">
                                            {Array.isArray(v)
                                                ? v
                                                    .map(
                                                        (item) => item.text
                                                    )
                                                    .join(", ")
                                                : ""}{" "}
                                            {}
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
