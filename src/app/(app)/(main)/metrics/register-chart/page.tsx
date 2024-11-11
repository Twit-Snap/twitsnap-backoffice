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

interface RegisterData {
    date: string;
    registerUsers: number;
    averageRegistrationTime: number | null;
    successRate: number;
}

interface RegisterWithProviderData{
    date: string;
    successfulRegisters: number;
    successfulRegistersWithProvider: number;
}



const Page: React.FC = () => {
    const [registerData, setRegisterData] = useState<RegisterData[] | null>(null);
    const [registerWithProviderData, setRegisterWithProviderData] = useState<RegisterWithProviderData[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState(
        <CircularProgress size="10rem" />
    );
    const [registerBarHovered, setRegisterBarHovered] = useState(false);
    const [registerWithProviderBarHovered, setRegisterWithProviderBarHovered] = useState(false);


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

    const fetchRegisterData = async () => {

            axios
                .get(`${process.env.NEXT_PUBLIC_METRICS_SERVER_URL}/metrics`, {
                params: { type: 'register' },

                }).then((response) => {
                    setRegisterData(response.data.data);
                }
                ).catch((error) => {
                    handleError(error);
                });
    };
    const fetchRegisterWithProviderData = async () => {

        axios
            .get(`${process.env.NEXT_PUBLIC_METRICS_SERVER_URL}/metrics`, {
                params: { type: 'register_with_provider' },

            }).then((response) => {
            setRegisterWithProviderData(response.data.data);
            }
        ).catch((error) => {
            handleError(error);
        });
    };


    useEffect(() => {
        setLoading(true);
        fetchRegisterData();
        fetchRegisterWithProviderData();
        setLoading(false);
    }, []);

    if (loading || !registerData || !registerWithProviderData ) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                {statusMessage}
            </div>
        );
    }

    const chartData = registerData.map(item => ({
        date: new Date(item.date).toLocaleDateString(),
        totalRegistrations: item.registerUsers,
        successCount: Math.round(item.registerUsers * item.successRate),
        failureCount: Math.round(item.registerUsers * (1 - item.successRate)),
        averageRegistrationTime: item.averageRegistrationTime ?  parseFloat((item.averageRegistrationTime / 1000).toFixed(2)) : 0,
    }));

    const chartWithProviderData = registerWithProviderData.map(item => ({
        date: new Date(item.date).toLocaleDateString(),
        successCount: item.successfulRegisters,
        successCountWithProvider: item.successfulRegistersWithProvider,
    }));
    console.log(chartWithProviderData);

    const RegisterTooltip = ({ active, payload }: any) => {
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
                    <p>{`Total Registrations: ${data.totalRegistrations}`}</p>
                    <p>{`Successes: ${data.successCount} (${((data.successCount / data.totalRegistrations) * 100).toFixed(2)}%)`}</p>
                    <p>{`Failures: ${data.failureCount} (${((data.failureCount / data.totalRegistrations) * 100).toFixed(2)}%)`}</p>
                </div>
            );
        }
        return null;
    };

    const RegisterWithProviderTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="custom-tooltip" style={{
                    backgroundColor: '#333',
                    color: '#fff',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc'
                }}>
                    <p>{`Date: ${data.date}`}</p>
                    <p>{`Registers: ${data.successCount}`}</p>
                    <p>{`Registers with Provider: ${data.successCountWithProvider}`}</p>
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
                    <p>{`Average Time: ${data.averageRegistrationTime}`}</p>
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
                marginBottom: '20px',
                marginTop: '60px'
            }}>
                Registrations Per Day
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
                                value: 'Registrations',
                                angle: -90,
                                position: 'insideLeft',
                                offset: 10,
                                fill: '#b6b4b4',
                                fontSize: 20,
                                dy: 60
                            }}
                        />
                        <Tooltip content={<RegisterTooltip/>} cursor={{fill: 'transparent'}} active={registerBarHovered}/>
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
                             onMouseEnter={() => setRegisterBarHovered(true)}
                             onMouseLeave={() => setRegisterBarHovered(false)}
                        />
                        <Bar dataKey="failureCount" fill="#ff6347" stackId="a" name="Failures"
                             onMouseEnter={() => setRegisterBarHovered(true)}
                             onMouseLeave={() => setRegisterBarHovered(false)}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
                <h2 style={{
                    textAlign: 'center',
                    color: '#b6b4b4',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '20px',
                    marginTop: '60px'
                }}>
                    Registrations vs Registrations with provider Per Day
                </h2>

                <div style={{width: '100%', height: 400}}>
                    <ResponsiveContainer>
                        <BarChart data={chartWithProviderData} margin={{top: 20, right: 30, left: 20, bottom: 40}}>
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
                                    value: 'Successful Registrations',
                                    angle: -90,
                                    position: 'insideLeft',
                                    offset: 10,
                                    fill: '#b6b4b4',
                                    fontSize: 20,
                                    dy: 100
                                }}
                            />
                            <Tooltip content={<RegisterWithProviderTooltip/>} cursor={{fill: 'transparent'}} active={registerWithProviderBarHovered}/>
                            <Legend
                                layout="vertical"
                                align="right"
                                verticalAlign="bottom"
                                wrapperStyle={{padding: '20px'}}
                                iconSize={20}
                                iconType="square"
                                payload={[
                                    {value: 'Register', type: 'square', color: '#82ca9d'},
                                    {value: 'Register with provider', type: 'square', color: '#4797ff'}
                                ]}
                            />
                            {}
                            <Bar dataKey="successCount" fill="#82ca9d" stackId="b" name="Registers"
                                 onMouseEnter={() => setRegisterWithProviderBarHovered(true)}
                                 onMouseLeave={() => setRegisterWithProviderBarHovered(false)}
                            />
                            <Bar dataKey="successCountWithProvider" fill="#4797ff" stackId="a" name="Registers with providers"
                                 onMouseEnter={() => setRegisterWithProviderBarHovered(true)}
                                 onMouseLeave={() => setRegisterWithProviderBarHovered(false)}
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
                        marginTop: '60px'
                    }}
                >
                    Average Registration Time Per Day
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
                            <Line type="monotone" dataKey="averageRegistrationTime" stroke="#82ca9d" dot={true}/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            );
            };

export default Page;
