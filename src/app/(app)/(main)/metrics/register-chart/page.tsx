"use client";

import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

interface RegisterData {
    date: string;
    registerUsers: number;
    averageRegistrationTime: number | null;
    successRate: number;
}

const Page: React.FC = () => {
    const [data, setData] = useState<RegisterData[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState(
        <CircularProgress size="10rem" />
    );
    const [barHovered, setBarHovered] = useState(false);

    const fetchData = async () => {

            axios
                .get(`${process.env.NEXT_PUBLIC_METRICS_SERVER_URL}/metrics`, {
                params: { type: 'register' },

                }).then((response) => {
                    setData(response.data.data);
                }
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

    if (loading) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                {statusMessage}
            </div>
        );
    }

    if (!data) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <label className="text-[1.1rem] text-[rgb(255,75,75)] font-[500]">
                    No data available to display.
                </label>
            </div>
        );
    }

    const chartData = data.map(item => ({
        date: new Date(item.date).toLocaleDateString(),
        totalRegistrations: item.registerUsers,
        successCount: Math.round(item.registerUsers * item.successRate),
        failureCount: Math.round(item.registerUsers * (1 - item.successRate)),
    }));

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            console.log("Tooltip data:", data);

            return (
                <div
                    className="custom-tooltip"
                     style={{
                         backgroundColor: '#333',
                         color: '#fff',
                         padding: '10px',
                         borderRadius: '5px',
                         border: '1px solid #ccc',
                         cursor: 'pointer',
                         fill: 'transparent',
                     }}>
                    <p>{`Total Registrations: ${data.totalRegistrations}`}</p>
                    <p>{`Successes: ${data.successCount} (${((data.successCount / data.totalRegistrations) * 100).toFixed(2)}%)`}</p>
                    <p>{`Failures: ${data.failureCount} (${((data.failureCount / data.totalRegistrations) * 100).toFixed(2)}%)`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{padding: '20px'}}>
            <h2 style={{
                textAlign: 'center',
                color: '#b6b4b4',
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '20px'
            }}>
                Register Bar Chart
            </h2>

            <div style={{width: '100%', height: 400}}>
                <ResponsiveContainer>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            label={{ value: 'Date', position: 'insideBottom', offset: -20, fill: '#b6b4b4', fontSize: 20 }}
                        />
                        <YAxis
                            label={{ value: 'Registrations', angle: -90, position: '', offset: -20, fill: '#b6b4b4', fontSize: 20 }}
                        />
                        <Tooltip content={<CustomTooltip/>} cursor={{fill: 'transparent'}} active={barHovered}/>
                        <Legend
                            layout="vertical"
                            align="right"
                            verticalAlign="bottom"
                            wrapperStyle={{ padding: '20px' }}
                            iconSize={20}
                            iconType="square"
                            payload={[
                                { value: 'Success', type: 'square', color: '#82ca9d' },
                                { value: 'Failure', type: 'square', color: '#ff6347' }
                            ]}
                        />
                        {}
                        <Bar dataKey="successCount" fill="#82ca9d" stackId="a" name="Successes"
                             onMouseEnter={() => setBarHovered(true)}
                             onMouseLeave={() => setBarHovered(false)}
                        />
                        <Bar dataKey="failureCount" fill="#ff6347" stackId="a" name="Failures"
                             onMouseEnter={() => setBarHovered(true)}
                             onMouseLeave={() => setBarHovered(false)}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Page;
