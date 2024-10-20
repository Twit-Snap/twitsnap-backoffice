import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import React, { useState } from "react";

export default function YourComponent() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("");

    const handleApplyFilter = () => {
        console.log("Selected filter:", selectedFilter);
        // Aquí puedes manejar la lógica para aplicar el filtro
    };

    const styles = {
        box: {
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            marginTop: '24px',
            gap: '24px',
            marginBottom: '24px',
            paddingRight: '50px',
            paddingLeft: '50px',

        },
        textField: {
            marginRight: '10px',
            backgroundColor: '#191919', // Same appearance as the Select
            color: '#ffffff',
            borderRadius: '8px', // Rounded borders for all
            width: '700px'
        },
        formControl: {
            minWidth: 120,
        },
        select: {
            backgroundColor: '#191919',
            color: '#ffffff',
            borderRadius: '8px',
            paddingLeft: '30px',

            '& .MuiSelect-icon': {
                color: '#b6b4b4', // Color del icono
            },
            '&:hover': {
                backgroundColor: '#555555', // Fondo cuando pasa el mouse
            },
            '&:focus': {
                backgroundColor: '#666666', // Fondo cuando está en foco
            },

        },
        button: {
            backgroundColor: '#209CF4FF',
            color: '#ffffff',

        },
    };

    return (
        <Box style={styles.box}>
            <TextField
                label="Search"
                variant="outlined"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                style={styles.textField}
                sx={{
                    '& .MuiInputBase-input::placeholder': {
                        color: '#b6b4b4', // Placeholder color
                        fontWeight: 'bold', // Make placeholder bold
                    },
                    '& .MuiInputLabel-root': {
                        color: '#b6b4b4',
                    },
                }}
            />
            <FormControl variant="outlined" style={styles.formControl}>
                <InputLabel id="filter-label" style={{ color: '#b6b4b4' }}>Filter</InputLabel>
                <Select
                    labelId="filter-label"
                    value={selectedFilter}
                    onChange={(event) => setSelectedFilter(event.target.value)}
                    label="Filter"
                    style={styles.select}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value="filter1">Name</MenuItem>
                    <MenuItem value="filter2">Content</MenuItem>
                    <MenuItem value="filter3">Date</MenuItem>
                </Select>
            </FormControl>
            <Button
                variant="contained"
                style={styles.button}
                onClick={handleApplyFilter}
            >
                Apply Filter
            </Button>
        </Box>
    );
}

