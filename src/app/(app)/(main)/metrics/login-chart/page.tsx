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
    LineChart, Line,
} from 'recharts';

interface LoginData {
    date: string;
    loginUsers: number,
    successfulLogins: number;
    failedLoginAttempts: number;
    averageLoginTime: number;
}

interface LoginWithProviderData{
    date: string;
    successfulLogins: number;
    successfulLoginsWithProvider: number;
}

const Page: React.FC = () => {
    const [loginData, setLoginData] = useState<LoginData[] | null>(null);
    const [loginWithProviderData, setLoginWithProviderData] = useState<LoginWithProviderData[] | null>(null)
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState(
        <CircularProgress size="10rem" />
    );
    const [barHovered, setBarHovered] = useState(false);

    function handleError(error: { code: string; response: { status: number; }; }) {
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
    }

    const fetchLoginData = async () => {

        axios
            .get(`${process.env.NEXT_PUBLIC_METRICS_SERVER_URL}/metrics`, {
                params: { type: 'login' },

            }).then((response) => {
                setLoginData(response.data.data);
            }
            ).catch((error) => {
                handleError(error);
            });
    };

    const fetchLoginWithProviderData = async () => {

        axios
            .get(`${process.env.NEXT_PUBLIC_METRICS_SERVER_URL}/metrics`, {
                params: { type: 'login_with_provider' },

            })
            .then((response) => {
                setLoginWithProviderData(response.data.data);
            })
            .catch((error) => {
                handleError(error);
            });
    };

    useEffect(() => {
        setLoading(true);
        fetchLoginData();
        fetchLoginWithProviderData();
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                {statusMessage}
            </div>
        );
    }

    if (!loginData || !loginWithProviderData) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <label className="text-[1.1rem] text-[rgb(255,75,75)] font-[500]">
                    No data available to display.
                </label>
            </div>
        );
    }

    const chartData = loginData.map(item => ({
        date: new Date(item.date).toLocaleDateString(),
        totalLogins: item.loginUsers,
        successCount: item.successfulLogins,
        failureCount: item.failedLoginAttempts,
        averageLoginTime: item.averageLoginTime ?  parseFloat((item.averageLoginTime / 1000).toFixed(2)) : 0,
    }));

    const chartWithProviderData = loginWithProviderData.map(item => ({
        date: new Date(item.date).toLocaleDateString(),
        successCount: item.successfulLogins,
        successCountWithProvider: item.successfulLoginsWithProvider,
    }));


    const LoginsTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;

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
                    <p>{`Date: ${data.date}`}</p>
                    <p>{`Total Logins: ${data.totalRegistrations}`}</p>
                    <p>{`Successes: ${data.successCount} `}</p>
                    <p>{`Failures: ${data.failureCount} `}</p>
                </div>
            );
        }
        return null;
    };

    const LoginsWithProviderTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="custom-tooltip" style={{ backgroundColor: '#333', color: '#fff', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
                    <p>{`Date: ${data.date}`}</p>
                    <p>{`Logins: ${data.successCount}`}</p>
                    <p>{`Logins with Provider: ${data.successCountWithProvider}`}</p>
                </div>
            );
        }
        return null;
    };


    const TimeTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;

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
                    <p>{`Date: ${data.date}`}</p>
                    <p>{`Average Time: ${data.averageLoginTime}`}</p>
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
                Logins Per Day
            </h2>

            <div style={{width: '100%', height: 400}}>
                <ResponsiveContainer>
                    <BarChart data={chartData} margin={{top: 20, right: 30, left: 20, bottom: 40}}>
                        <CartesianGrid vertical={false}/>
                        <XAxis
                            dataKey="date"
                            tick={{fill: '#b6b4b4', fontSize: 14}}
                            label={{
                                value: 'Date',
                                position: 'insideBottom',
                                offset: -20,
                                fill: '#b6b4b4',
                                fontSize: 20
                            }}
                        />
                        <YAxis
                            tick={{fill: '#b6b4b4', fontSize: 14}}
                            label={{
                                value: 'Logins',
                                angle: -90,
                                position: 'insideLeft',
                                offset: 10,
                                fill: '#b6b4b4',
                                fontSize: 20,
                                dy: 30
                            }}
                        />
                        <Tooltip content={<LoginsTooltip/>} cursor={{fill: 'transparent'}}
                                 active={barHovered}/>
                        <Legend
                            layout="vertical"
                            align="right"
                            verticalAlign="bottom"
                            wrapperStyle={{padding: '20px'}}
                            iconSize={20}
                            iconType="square"
                            payload={[
                                {value: 'Success', type: 'square', color: '#82ca9d'},
                                {value: 'Failure', type: 'square', color: '#ff6347'}
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

            <h2 style={{
                textAlign: 'center',
                color: '#b6b4b4',
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '20px'
            }}>
                Logins vs Logins with Provider Per Day
            </h2>
            <div style={{width: '100%', height: 400}}>
                <ResponsiveContainer>
                    <BarChart
                        data={chartWithProviderData}
                        margin={{top: 20, right: 30, left: 20, bottom: 40}}
                    >
                        <CartesianGrid vertical={false}/>
                        <XAxis
                            dataKey="date"
                            tick={{fill: '#b6b4b4', fontSize: 14}}
                            label={{
                                value: 'Date',
                                position: 'insideBottom',
                                offset: -20,
                                fill: '#b6b4b4',
                                fontSize: 20
                            }}
                        />
                        <YAxis
                            tick={{fill: '#b6b4b4', fontSize: 14}}
                            label={{
                                value: 'Successful Logins',
                                angle: -90,
                                position: 'insideLeft',
                                offset: 10,
                                fill: '#b6b4b4',
                                fontSize: 20,
                                dy: 60
                            }}
                        />
                        <Tooltip
                            content={<LoginsWithProviderTooltip/>}
                            cursor={{fill: 'transparent'}}
                        />
                        <Legend
                            layout="vertical"
                            align="right"
                            verticalAlign="bottom"
                            iconSize={20}
                            wrapperStyle={{padding: '20px'}}
                            iconType="square"
                            payload={[
                                {value: 'Logins', type: 'square', color: '#82ca9d'},
                                {value: 'Logins with Provider', type: 'square', color: '#4797ff'}
                            ]}
                        />
                        <Bar
                            dataKey="successCount"
                            fill="#82ca9d"
                            name="Logins"
                        />
                        <Bar
                            dataKey="successCountWithProvider"
                            fill="#4797ff"
                            name="Logins with Provider"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <h2
                style={{
                    textAlign: 'center',
                    color: '#b6b4b4',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '20px',
                    marginTop: '40px'
                }}
            >
                Average Login Time Per Day
            </h2>

            <div style={{width: '100%', height: 400}}>
                <ResponsiveContainer>
                    <LineChart data={chartData} margin={{top: 20, right: 30, left: 20, bottom: 40}}>
                        <CartesianGrid vertical={false}/>
                        <XAxis
                            dataKey="date"
                            tick={{fill: '#b6b4b4', fontSize: 14}}
                            label={{
                                value: 'Date',
                                position: 'insideBottom',
                                offset: -20,
                                fill: '#b6b4b4',
                                fontSize: 20
                            }}
                        />
                        <YAxis
                            tick={{fill: '#b6b4b4', fontSize: 14}}
                            label={{
                                value: 'Avg Time (s)',
                                angle: -90,
                                position: 'insideLeft',
                                offset: 10,
                                fill: '#b6b4b4',
                                fontSize: 20,
                                dy: 60
                            }}
                        />
                        <Tooltip content={<TimeTooltip/>}/>
                        <Line type="monotone" dataKey="averageLoginTime" stroke="#82ca9d" dot={true}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};


export default Page;
