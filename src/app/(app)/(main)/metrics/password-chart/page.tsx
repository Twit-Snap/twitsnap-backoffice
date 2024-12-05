"use client";

import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";

import { TooltipProps } from "@/types/metric";

interface PasswordData {
    date: string;
    recoveryAttempts: number;
    successfulRecoveries: number,
    failedRecoveryAttempts: number,
    averageRecoveryTime:number
}


const Page: React.FC = () => {
    const [passwordData, setPasswordData] = useState<PasswordData[] | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState(
        <CircularProgress size="10rem" />
    );
    const [passwordBarHovered, setPasswordBarHovered] = useState(false);

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

    const fetchRecoveryPasswordData = async () => {
        axios
            .get(`${process.env.NEXT_PUBLIC_METRICS_SERVER_URL}/metrics`, {
                params: { type: "password" },
            })
            .then((response) => {
                setPasswordData(response.data.data);
            })
            .catch((error) => {
                handleError(error);
            });
    };

    useEffect(() => {
        setLoading(true);
        fetchRecoveryPasswordData();
        setLoading(false);
    }, []);

    if (loading || !passwordData ) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                {statusMessage}
            </div>
        );
    }


    const chartData = passwordData.map(item => ({
        date: new Date(item.date).toLocaleDateString(),
        total: item.recoveryAttempts,
        successCount: item.successfulRecoveries,
        failureCount: item.failedRecoveryAttempts,
        averageTime: item.averageRecoveryTime ?  parseFloat((item.averageRecoveryTime / 1000).toFixed(2)) : 0,
    }));


    const PasswordRecoveryTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;

            return (
                <div
                    className="custom-tooltip"
                    style={{
                        backgroundColor: "#333",
                        color: "#fff",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        cursor: "pointer",
                        fill: "transparent",
                    }}>
                    <p>{`Date: ${data.date}`}</p>
                    <p>{`Total Recoveries: ${data.total}`}</p>
                    <p>{`Successes: ${data.successCount} (${(
                        (data.successCount / data.total) *
                        100
                    ).toFixed(2)}%)`}</p>
                    <p>{`Failures: ${data.failureCount} (${(
                        (data.failureCount / data.total) *
                        100
                    ).toFixed(2)}%)`}</p>
                </div>
            );
        }
        return null;
    };


    const TimeTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;

            return (
                <div
                    className="custom-tooltip"
                    style={{
                        backgroundColor: "#333",
                        color: "#fff",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        cursor: "pointer",
                        fill: "transparent",
                    }}>
                    <p>{`Date: ${data.date}`}</p>
                    <p>{`Average Time: ${data.averageTime}`}</p>
                </div>
            );
        }
        return null;
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
                    marginTop: "60px",
                }}>
                Password recovery Per Day
            </h2>

            <div style={{ width: "100%", height: 400 }}>
                <ResponsiveContainer>
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: "#b6b4b4", fontSize: 14 }}
                            label={{
                                value: "Date",
                                position: "insideBottom",
                                offset: -20,
                                fill: "#b6b4b4",
                                fontSize: 20,
                            }}
                        />
                        <YAxis
                            tick={{ fill: "#b6b4b4", fontSize: 14 }}
                            label={{
                                value: "Recoveries",
                                angle: -90,
                                position: "insideLeft",
                                offset: 10,
                                fill: "#b6b4b4",
                                fontSize: 20,
                                dy: 60,
                            }}
                        />
                        <Tooltip
                            content={
                                <PasswordRecoveryTooltip
                                    active={false}
                                    payload={undefined}
                                />
                            }
                            cursor={{ fill: "transparent" }}
                            active={passwordBarHovered}
                        />
                        <Legend
                            layout="vertical"
                            align="right"
                            verticalAlign="bottom"
                            wrapperStyle={{ padding: "20px" }}
                            iconSize={20}
                            iconType="square"
                            payload={[
                                {
                                    value: "Success",
                                    type: "square",
                                    color: "#82ca9d",
                                },
                                {
                                    value: "Failure",
                                    type: "square",
                                    color: "#ff6347",
                                },
                            ]}
                        />
                        {}
                        <Bar
                            dataKey="successCount"
                            fill="#82ca9d"
                            stackId="a"
                            name="Successes"
                            onMouseEnter={() => setPasswordBarHovered(true)}
                            onMouseLeave={() => setPasswordBarHovered(false)}
                        />
                        <Bar
                            dataKey="failureCount"
                            fill="#ff6347"
                            stackId="a"
                            name="Failures"
                            onMouseEnter={() => setPasswordBarHovered(true)}
                            onMouseLeave={() => setPasswordBarHovered(false)}
                        />
                    </BarChart>
                </ResponsiveContainer>
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
                Average Password Recovery Time Per Day
            </h2>

            <div style={{ width: "100%", height: 400 }}>
                <ResponsiveContainer>
                    <LineChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: "#b6b4b4", fontSize: 14 }}
                            label={{
                                value: "Date",
                                position: "insideBottom",
                                offset: -20,
                                fill: "#b6b4b4",
                                fontSize: 20,
                            }}
                        />
                        <YAxis
                            tick={{ fill: "#b6b4b4", fontSize: 14 }}
                            label={{
                                value: "Avg Time (s)",
                                angle: -90,
                                position: "insideLeft",
                                offset: 10,
                                fill: "#b6b4b4",
                                fontSize: 20,
                                dy: 60,
                            }}
                        />
                        <Tooltip
                            content={
                                <TimeTooltip
                                    active={false}
                                    payload={undefined}
                                />
                            }
                        />
                        <Line
                            type="monotone"
                            dataKey="averageTime"
                            stroke="#82ca9d"
                            dot={true}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>


    );
};

export default Page;
