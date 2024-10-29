import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import React, {useCallback} from "react";

interface SearchModelProps {
    fetchData: (queryParams: object | undefined) => void;
    rowsPerPage: number;
    setPage: (page: number) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedFilter: string;
    setSelectedFilter: (filter: string) => void;
}

export default function SearchModel({ fetchData, rowsPerPage, setPage, searchTerm, setSearchTerm, selectedFilter, setSelectedFilter }: SearchModelProps) {


    const handleApplyFilter = useCallback(() => {
        console.log("Selected filter:", selectedFilter);
        console.log("Selected term:", searchTerm);

        const params = {
            createdAt: selectedFilter === "date" ? searchTerm : undefined,
            limit: rowsPerPage,
            offset: 0,
            username: selectedFilter === "username" ? searchTerm : undefined,
            has: selectedFilter === "content" ? searchTerm : undefined,
            exactDate: selectedFilter === "date" ? true : undefined,
        };

        fetchData(params);
        setPage(0);
    }, [fetchData, rowsPerPage, searchTerm, selectedFilter, setPage]);

    const styles = {
        box: {
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            marginTop: '24px',
            gap: '24px',
            marginBottom: '24px',
            paddingRight: '50px',
            paddingLeft: '50px',

        },
        textField: {
            marginRight: '10px',
            backgroundColor: '#191919',
            color: '#ffffff',
            borderRadius: '8px',
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
                color: '#b6b4b4',
            },
            '&:hover': {
                backgroundColor: '#555555',
            },
            '&:focus': {
                backgroundColor: '#666666',
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
                autoComplete="off"
                style={styles.textField}
                sx={{
                    '& .MuiInputBase-input::placeholder': {
                        color: '#b6b4b4',
                        fontWeight: 'bold',
                    },
                    '& .MuiInputLabel-root': {
                        color: '#b6b4b4',
                    },
                    '& .MuiInputBase-input': {
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
                    <MenuItem value="username">Username</MenuItem>
                    <MenuItem value="content">Content</MenuItem>
                    <MenuItem value="date">Date</MenuItem>
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

