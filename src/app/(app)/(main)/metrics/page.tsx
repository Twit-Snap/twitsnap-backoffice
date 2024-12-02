"use client";

import React from 'react';
import {Grid, Card, CardActionArea, CardContent, Typography, Box} from '@mui/material';
import {useRouter} from 'next/navigation';

const chartOptions = [
    {
        id: 1,
        name: 'Register Charts',
        path: 'register-chart',
        description: 'Shows amount of successful and failed registers attempts, registers with and without provider and average time'
    },
    {
        id: 2,
        name: 'Login Charts',
        path: 'login-chart',
        description: 'Shows amount of successful and failed login attempts, logins with and without provider and average time'
    },
    {id: 3, name: 'Blocked users Charts', path: 'blocked-chart', description: 'Shows the number of blocked users.'},
    {
        id: 4,
        name: 'Location charts',
        path: 'location-chart',
        description: 'Shows the distribution of the users around the world'
    },
    {
        id: 5,
        name: 'Content charts',
        path: 'content-chart',
        description: 'Shows twits filtered by user vs time and total twits'
    }
];

const ChartList = () => {
    const router = useRouter();

    const handleClick = (path: string) => {
        router.push(`/metrics/${path}`);
    };

    return (
        <Box p={3}>
            <Typography variant="h4" align="center" color='#b6b4b4' gutterBottom sx={{marginBottom: 4}}>
                Aviable Metrics
            </Typography>
            <Grid container spacing={3}>
                {chartOptions.map((chart) => (
                    <Grid item xs={12} sm={6} md={4} key={chart.id}>
                        <Card sx={{backgroundColor: '#1e1d22'}}>
                            <CardActionArea onClick={() => handleClick(chart.path)}>
                                <CardContent>
                                    <Typography variant="h6" component="div" align="center" color='#b6b4b4'>
                                        {chart.name}
                                    </Typography>
                                    <Typography variant="body2" color='#b6b4b4' align="center" mt={1} mb={2}>
                                        {chart.description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ChartList;
