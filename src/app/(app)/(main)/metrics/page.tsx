"use client";

import React from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';

const chartOptions = [
    { id: 1, name: 'Register Chart', path: 'register-chart', description: 'Shows amount of users register, with success rate and average time vs time' },
    { id: 2, name: 'Login Chart', path: 'login-chart', description: 'Shows amount of successfull logins, failed login attemps and average time vs time ' },
    { id: 3, name: 'Register with provider Chart', path: 'register-with-provider-chart', description: 'Muestra el número de registros con identidad federada.' },
    { id: 4, name: 'Login with provider Chart ', path: 'login-with-provider-chart', description: 'Muestra el número de inicios de sesión a través de proveedores federados.' },
    { id: 5, name: 'Locks users Chart ', path: 'locked-chart', description: 'Muestra el número de usuarios bloqueados o suspendidos.' },
    //{ id: 6, name: 'Radar Chart', path: '/radar-chart', description: 'Muestra métricas de actividad por zona geográfica.' },
];

const ChartList = () => {
    const router = useRouter();

    const handleClick = (path: string) => {
        router.push(`/metrics/${path}`);
    };

    return (
        <Box p={3}>
            <Typography variant="h4" align="center" color='#b6b4b4' gutterBottom sx={{ marginBottom: 4 }} >
                Aviable Graphics
            </Typography>
            <Grid container spacing={3}>
                {chartOptions.map((chart) => (
                    <Grid item xs={12} sm={6} md={4} key={chart.id}>
                        <Card sx={{backgroundColor: '#1e1d22'}}>
                            <CardActionArea onClick={() => handleClick(chart.path)}>
                                <CardContent>
                                    <Typography variant="h6" component="div" align="center" color='#b6b4b4' >
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
