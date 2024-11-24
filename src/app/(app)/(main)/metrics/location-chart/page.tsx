"use client";

import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import {TooltipLocationProps} from "@/types/metric";

interface LoginData {
    country: string;
    amount: number;
}

const Page: React.FC = () => {
    const [data, setData] = useState<LoginData[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState(
        <CircularProgress size="10rem" />
    );

    const fetchData = async () => {

        axios
            .get(`${process.env.NEXT_PUBLIC_METRICS_SERVER_URL}/metrics`, {
                params: { type: 'location' },

            }).then((response) => {
            setData(response.data.data);
            console.log(response.data.data)
            ;            }
        ).catch((error) => {
            if (error.code === "ECONNABORTED") {
                setStatusMessage(
                    <label className="text-[1.1rem] text-[rgb(255,75,75)] font-[500]">
                        Looks like the server is taking too long to respond,
                        please try again sometime.
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
        });
    };

    useEffect(() => {
        setLoading(true);
        fetchData();
        setLoading(false);
    }, []);

    if (loading || !data) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                {statusMessage}
            </div>
        );
    }


    const chartData = data.map(item => ({
        country: item.country,
        amount: item.amount,
    }));

    const LocationTooltip: React.FC<TooltipLocationProps>  = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div
                    style={{
                        background: "#333",
                        color: "#fff",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                    }}
                >
                    <p>{`Country: ${data.country}`}</p>
                    <p>{`Amount of Users: ${data.amount}`}</p>
                </div>
            );
        }
        return null;
    };

    const generateColor = (index: number) => {
        const hue = (index * 137.5) % 360;
        return `hsl(${hue}, 70%, 35%)`;
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2
                style={{
                    textAlign: "center",
                    color: "#b6b4b4",
                    fontSize: "24px",
                    fontWeight: "bold",
                    marginBottom: "20px",
                }}
            >
                Geographical Distribution of Users
            </h2>

            <div style={{ width: "100%", height: 400 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="amount"
                            nameKey="country"
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            fill="#8884d8"
                            label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(1)}%`
                            }
                        >
                            {chartData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={generateColor(index)} />
                            ))}
                        </Pie>

                        <Tooltip content={<LocationTooltip  active={false} payload={undefined}/>} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};


export default Page;
