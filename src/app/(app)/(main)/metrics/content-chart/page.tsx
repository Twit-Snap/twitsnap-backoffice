"use client";

import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";

import {TooltipTwitsProps} from "@/types/metric";

interface TwitData {
    dateName: string;
    date: Date;
    amount: number;
}

interface CompleteTwitData {
    total: number,
    twits:  TwitData[]
}

interface HashtagData {
    date: Date;
    hashtags: Record<string, number>;
}



const Page: React.FC = () => {
    const [ twitData, setTwitData] = useState<CompleteTwitData | null>(null);
    const [hashtagData, setHashtagData] = useState<HashtagData[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState(
        <CircularProgress size="10rem" />
    );

    function handleError(error: {
        code: string;
        response: { status: number };
    }) {
        if (error.code === "ECONNABORTED") {
            setStatusMessage(
                <label className="text-[1.1rem] text-[rgb(255,75,75)] font-[500]">
                    Looks like the server is taking too long to respond, please
                    try again sometime.
                </label>
            );
        } else if (error.response && error.response.status >= 500) {
            setStatusMessage(
                <label className="text-[1.1rem] text-[rgb(255,75,75)] font-[500]">
                    Server error occurred, please try again later.
                </label>
            );
        } else {
            setStatusMessage(
                <label className="text-[1.1rem] text-[rgb(255,75,75)] font-[500]">
                    Oops! This content does not exist!
                </label>
            );
        }
    }

    const fetchHashtagData = async () => {
        axios
            .get(`${process.env.NEXT_PUBLIC_METRICS_SERVER_URL}/metrics`, {
                params: { type: "hashtag", auth: false},
            })
            .then((response) => {
                setHashtagData(response.data.data);
            })
            .catch((error) => {
                handleError(error);
            });
    }

    const fetchTwitData = async () => {
        axios
            .get(`${process.env.NEXT_PUBLIC_METRICS_SERVER_URL}/metrics`, {
                params: { type: "twit", auth: true},
            })
            .then((response) => {
                setTwitData(response.data.data);
            })
            .catch((error) => {
                handleError(error);
            });
    };

    useEffect(() => {
        setLoading(true);
        fetchTwitData();
        fetchHashtagData();
        setLoading(false);
    }, []);

    if (loading || !twitData || !hashtagData) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                {statusMessage}
            </div>
        );
    }

    const chartTwitData = twitData.twits.map((item) => {
        const [year, month, day] =item.date.split('T')[0].split('-');
        return {
            date: `${year}/${month}/${day}`,
            total: item.amount,
        }
    });

    const chartData = hashtagData.map((item) => {
        const [year, month, day] =item.date.split('T')[0].split('-');
        return{
            date: `${year}/${month}/${day}`,
            ...item.hashtags,
        }
    });

    const uniqueHashtags = hashtagData.length === 0 ?  [] : Object.keys(hashtagData[0].hashtags);


    const TwitsTooltip: React.FC<TooltipTwitsProps> = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;

            return (
                <div
                    className="custom-tooltip"
                    style={{
                        backgroundColor: "#333",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        cursor: "pointer",
                        fill: "transparent",

                    }}>
                    <p>{`Date: ${data.date}`}</p>
                    <p>{`Total Twits: ${data.total}`}</p>
                </div>
            );
        }
        return null;
    };
    console.log(chartData);
    return (
        <div style={{padding: "20px"}}>
            <h2
                style={{
                    textAlign: "center",
                    color: "#b6b4b4",
                    fontSize: "24px",
                    fontWeight: "bold",
                    marginBottom: "20px",
                    marginTop: "60px",
                }}>
                Twits Per Day
            </h2>

            <div
                style={{
                    textAlign: "right",
                    marginBottom: "20px",
                    padding: "10px",
                    borderRadius: "8px",
                }}>
                <h3
                    style={{
                        fontSize: "18px",
                        color: "#b6b4b4",
                        marginBottom: "5px",
                        marginRight: "30px",
                        fontWeight: "bold"
                    }}>
                    Total Twits: {twitData.total}
                </h3>
                <div/>

                <div style={{width: "100%", height: 400}}>
                    <ResponsiveContainer>
                        <LineChart
                            data={chartTwitData}
                            margin={{top: 20, right: 30, left: 20, bottom: 40}}>
                            <CartesianGrid vertical={false}/>
                            <XAxis
                                dataKey="date"
                                tick={{fill: "#b6b4b4", fontSize: 14}}
                                label={{
                                    value: "Date",
                                    position: "insideBottom",
                                    offset: -20,
                                    fill: "#b6b4b4",
                                    fontSize: 20,
                                }}
                            />
                            <YAxis
                                tick={{fill: "#b6b4b4", fontSize: 14}}
                                label={{
                                    value: "Amount of Twits",
                                    angle: -90,
                                    position: "insideLeft",
                                    offset: 10,
                                    fill: "#b6b4b4",
                                    fontSize: 20,
                                    dy: 60,
                                }}
                                allowDecimals={false}
                            />
                            <Tooltip
                                content={
                                    <TwitsTooltip
                                        active={false}
                                        payload={undefined}
                                    />
                                }
                            />
                            <Line
                                type="monotone"
                                dataKey="total"
                                stroke="#82ca9d"
                                dot={true}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>



            <h2
                style={{
                    textAlign: "center",
                    color: "#b6b4b4",
                    fontSize: "24px",
                    fontWeight: "bold",
                    marginBottom: "20px",
                    marginTop: "60px",
                }}>
                Hashtags Per Day
            </h2>

            <div
                style={{
                    textAlign: "right",
                    marginBottom: "20px",
                    padding: "10px",
                    borderRadius: "8px",
                }}>
                <div style={{width: "100%", height: 400}}>
                    <ResponsiveContainer>
                        <LineChart
                            data={chartData}
                            margin={{top: 20, right: 30, left: 20, bottom: 40}}>
                            <CartesianGrid vertical={false}/>
                            <XAxis
                                dataKey="date"
                                tick={{fill: "#b6b4b4", fontSize: 14}}
                                label={{
                                    value: "Date",
                                    position: "insideBottom",
                                    offset: -20,
                                    fill: "#b6b4b4",
                                    fontSize: 20,
                                }}
                            />
                            <YAxis
                                tick={{fill: "#b6b4b4", fontSize: 14}}
                                label={{
                                    value: "Hashtags",
                                    angle: -90,
                                    position: "insideLeft",
                                    offset: 10,
                                    fill: "#b6b4b4",
                                    fontSize: 20,
                                    dy: 60,
                                }}
                                allowDecimals={false}
                            />
                            <Tooltip  contentStyle={{  backgroundColor: "#333", color: "#333", borderRadius: "5px" }}/>

                            {/* Generar dinámicamente las líneas */}
                            {uniqueHashtags.map((hashtag) => (
                                <Line
                                    key={hashtag}
                                    type="monotone"
                                    dataKey={hashtag}
                                    name={hashtag}
                                    stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} // Color aleatorio
                                    dot={true}
                                    connectNulls={true}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Page;
