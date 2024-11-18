"use client";

import { CircularProgress } from "@mui/material";
import { useAtomValue } from "jotai";
import { authenticatedAtom } from "@/types/authTypes";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TablePagination from "@mui/material/TablePagination";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TableFooter from "@mui/material/TableFooter";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useRouter } from "next/navigation";

import { TwitType } from "@/types/twit";
import SearchModel from "./searchModel";

const TIMEOUT_MSECONDS = 5000;

interface TablePaginationActionsProps {
	count: number;
	page: number;
	rowsPerPage: number;
	onPageChange: (
		event: React.MouseEvent<HTMLButtonElement>,
		newPage: number
	) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
	const theme = useTheme();
	const { count, page, rowsPerPage, onPageChange } = props;

	const handleFirstPageButtonClick = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		onPageChange(event, 0);
	};

	const handleBackButtonClick = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		onPageChange(event, page - 1);
	};

	const handleNextButtonClick = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		onPageChange(event, page + 1);
	};

	const handleLastPageButtonClick = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
	};

	return (
		<Box sx={{ flexShrink: 0, ml: 2.5 }}>
			<IconButton
				onClick={handleFirstPageButtonClick}
				disabled={page === 0}
				aria-label="first page">
				{theme.direction === "rtl" ? (
					<LastPageIcon />
				) : (
					<FirstPageIcon />
				)}
			</IconButton>
			<IconButton
				onClick={handleBackButtonClick}
				disabled={page === 0}
				aria-label="previous page">
				{theme.direction === "rtl" ? (
					<KeyboardArrowRight />
				) : (
					<KeyboardArrowLeft />
				)}
			</IconButton>
			<IconButton
				onClick={handleNextButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="next page">
				{theme.direction === "rtl" ? (
					<KeyboardArrowLeft />
				) : (
					<KeyboardArrowRight />
				)}
			</IconButton>
			<IconButton
				onClick={handleLastPageButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="last page">
				{theme.direction === "rtl" ? (
					<FirstPageIcon />
				) : (
					<LastPageIcon />
				)}
			</IconButton>
		</Box>
	);
}

export default function Twits() {
	const [twits, setTwits] = useState<TwitType[] | null>(null);
	const [totalTwits, setTotalTwits] = useState(0);
	const token = useAtomValue(authenticatedAtom)?.token;
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [statusMessage, setStatusMessage] = useState(
		<CircularProgress size="10rem" />
	);
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [showError, setShowError] = useState(false);

	const [searchTerm, setSearchTerm_] = useState("");
	const [selectedFilter, setSelectedFilter_] = useState("");

	const selectedSearchRef = useRef("");
	const selectedFilterRef = useRef("");

	const setSearchTerm = (newState: string) => {
		selectedSearchRef.current = newState;
		setSearchTerm_(newState);
	};

	const setSelectedFilter = (newState: string) => {
		selectedFilterRef.current = newState;
		setSelectedFilter_(newState);
	};

	const router = useRouter(); // Inicias el router

	// Función para manejar la navegación cuando se hace clic en una fila
	const handleRowClick = (twitId: string) => {
		router.push(`/twits/${twitId}`);
	};

	const handleChangePage = useCallback(
		(
			event: React.MouseEvent<HTMLButtonElement> | null,
			newPage: number
		) => {
			setPage(newPage);

			setLoading(true);
			const params = {
				createdAt:
					selectedFilterRef.current === "date"
						? selectedSearchRef.current
						: undefined,
				limit: rowsPerPage,
				offset: rowsPerPage * newPage,
				username:
					selectedFilterRef.current === "username"
						? selectedSearchRef.current
						: undefined,
				has:
					selectedFilterRef.current === "content"
						? selectedSearchRef.current
						: undefined,
				exactDate:
					selectedFilterRef.current === "date" ? true : undefined,
			};

			fetchData(params);

			setLoading(false);
		},
		[page, rowsPerPage]
	);

	const handleChangeRowsPerPage = useCallback(
		(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			setLoading(true);
			const newRowsPerPage = parseInt(event.target.value, 10);
			setRowsPerPage(newRowsPerPage);
			setPage(0);

			const params = {
				createdAt:
					selectedFilterRef.current === "date"
						? selectedSearchRef.current
						: undefined,
				limit: newRowsPerPage,
				offset: 0,
				username:
					selectedFilterRef.current === "username"
						? selectedSearchRef.current
						: undefined,
				has:
					selectedFilterRef.current === "content"
						? selectedSearchRef.current
						: undefined,
				exactDate:
					selectedFilterRef.current === "date" ? true : undefined,
			};
			fetchData(params);

			setLoading(false);
		},
		[page, rowsPerPage]
	);

	const fetchTotalAmountOfTwits = async (queryParams: object | undefined) => {
		if (!token) return;

		axios
			.get(`${process.env.NEXT_PUBLIC_TWIT_SERVER_URL}/snaps/amount`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				params: queryParams as object | undefined,
				timeout: TIMEOUT_MSECONDS,
			})
			.then((response) => {
				console.log("set total amount", response.data.data);
				setTotalTwits(response.data.data);
			})
			.catch((error) => {
				if (error.code === "ECONNABORTED") {
					setStatusMessage(
						<label className="text-[1.1rem] text-[rgb(255,75,75)] font-[500]">
							Looks like the server is taking to long to respond,
							please try again in sometime
						</label>
					);
				} else {
					if ((error.status & 500) === 500) {
						setStatusMessage(
							<label className="text-[1.1rem] text-[rgb(255,75,75)] font-[500]">
								Server error occurred, please try again later
							</label>
						);
					} else {
						setStatusMessage(
							<label className="text-[1.1rem] text-[rgb(255,75,75)] font-[500]">
								Oops!, this content does not exist!
							</label>
						);
					}
				}
			});
	};

	const fetchTwits = async (queryParams: object | undefined) => {
		if (!token) return;

		axios
			.get(`${process.env.NEXT_PUBLIC_TWIT_SERVER_URL}/snaps`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				params: queryParams as object | undefined,
				timeout: TIMEOUT_MSECONDS,
			})
			.then((response) => {
				setTwits(response.data.data);
				setErrorMessage(null);
				setShowError(false);
			})
			.catch((error) => {
				if (error.code === "ECONNABORTED") {
					setStatusMessage(
						<label className="text-[1.1rem] text-[rgb(255,75,75)] font-[500]">
							Looks like the server is taking to long to respond,
							please try again in sometime
						</label>
					);
				} else {
					if ((error.status & 500) === 500) {
						setStatusMessage(
							<label className="text-[1.1rem] text-[rgb(255,75,75)] font-[500]">
								Server error occurred, please try again later
							</label>
						);
					} else if ((error.status & 400) === 400) {
						setErrorMessage("Invalid filter parameters");
						setShowError(true);
					} else {
						setStatusMessage(
							<label className="text-[1.1rem] text-[rgb(255,75,75)] font-[500]">
								Oops!, this content does not exist!
							</label>
						);
					}
				}
			});
	};

	const fetchData = async (queryParams: object | undefined) => {
		setLoading(true);
		fetchTwits(queryParams);
		fetchTotalAmountOfTwits(queryParams);
		setLoading(false);
	};

	useEffect(() => {
		const params = {
			createdAt:
				selectedFilterRef.current === "date"
					? selectedSearchRef.current
					: undefined,
			limit: rowsPerPage,
			offset: rowsPerPage * page,
			username:
				selectedFilterRef.current === "username"
					? selectedSearchRef.current
					: undefined,
			has:
				selectedFilterRef.current === "content"
					? selectedSearchRef.current
					: undefined,
			exactDate: selectedFilterRef.current === "date" ? true : undefined,
		};
		fetchData(params);
	}, []);

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString();
	};

	if (!twits || loading) {
		return (
			<div className="w-full h-full flex justify-center place-items-center">
				{statusMessage}
			</div>
		);
	}

	return (
		<>
			<SearchModel
				fetchData={fetchData}
				rowsPerPage={rowsPerPage}
				setPage={setPage}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				selectedFilter={selectedFilter}
				setSelectedFilter={setSelectedFilter}
			/>
			<TableContainer
				component={Paper}
				sx={{
					height: "100%",
					width: "100%",
					overflowX: "auto",
					backgroundColor: "#25252b",
				}}>
				<Table
					stickyHeader
					sx={{ minWidth: "80%" }}
					aria-label="sticky table">
					<TableHead>
						<TableRow>
							<TableCell
								align="left"
								sx={{
									backgroundColor: "#191919",
									color: "#b6b4b4",
									borderColor: "#444444",
								}}>
								Id
							</TableCell>
							<TableCell
								align="left"
								sx={{
									backgroundColor: "#191919",
									color: "#b6b4b4",
									borderColor: "#444444",
								}}>
								Username
							</TableCell>
							<TableCell
								align="left"
								sx={{
									backgroundColor: "#191919",
									color: "#b6b4b4",
									borderColor: "#444444",
								}}>
								Date
							</TableCell>
							<TableCell
								align="left"
								sx={{
									backgroundColor: "#191919",
									color: "#b6b4b4",
									borderColor: "#444444",
								}}>
								Content
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{twits.map((twit) => (
							<TableRow
								key={twit.id}
								sx={{
									"&:last-child td, &:last-child th": {
										border: 0,
									},
									"&:hover": { backgroundColor: "#777676" },
								}}
								onClick={() => handleRowClick(twit.id)}
								className="hover:cursor-pointer">
								<TableCell
									component="th"
									scope="row"
									sx={{
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis",
										maxWidth: "50px",
										color: "#b6b4b4",
										borderColor: "#444444",
									}}>
									{twit.id}
								</TableCell>
								<TableCell
									align="left"
									sx={{
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis",
										color: "#b6b4b4",
										borderColor: "#444444",
									}}>
									{twit.user.username}
								</TableCell>
								<TableCell
									align="left"
									sx={{
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis",
										color: "#b6b4b4",
										borderColor: "#444444",
									}}>
									{formatDate(twit.createdAt)}
								</TableCell>
								<TableCell
									align="left"
									sx={{
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis",
										maxWidth: 200,
										color: "#b6b4b4",
										borderColor: "#444444",
									}}>
									{twit.content}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
					<TableFooter>
						<TableRow
							sx={{
								borderBottom: "1px solid #444444",
								width: "100%",
							}}>
							<TablePagination
								rowsPerPageOptions={[5, 10, 20]}
								colSpan={5}
								className="place-items-center"
								count={totalTwits || 0}
								rowsPerPage={rowsPerPage}
								page={page}
								slotProps={{
									select: {
										inputProps: {
											"aria-label": "rows per page",
										},
										native: true,
									},
								}}
								SelectProps={{
									sx: {
										"& .MuiSelect-select": {
											backgroundColor: "#444444", // Fondo del select
											color: "#ffffff", // Color del texto
										},
										"& .MuiSelect-icon": {
											color: "#b6b4b4", // Color del icono
										},
										"&:hover .MuiSelect-select": {
											backgroundColor: "#555555", // Fondo cuando pasa el mouse
										},
										"&:focus .MuiSelect-select": {
											backgroundColor: "#666666", // Fondo cuando está en foco
										},
										"& .MuiSelect-selectMenu": {
											backgroundColor: "#444444", // Fondo del menú del select
											color: "#ffffff", // Color del texto del menú
										},
									},
								}}
								sx={{
									borderColor: "#444444", // Color del borde superior de la barra
									"& .MuiTablePagination-selectRoot": {
										color: "#b6b4b4",
									},
									"& .MuiTablePagination-select": {
										color: "#b6b4b4",
									},
									"& .MuiTablePagination-toolbar": {
										color: "#b6b4b4",
									},
									"& .MuiTablePagination-displayedRows": {
										color: "#b6b4b4",
									},
									"& .MuiButtonBase-root": {
										color: "#b6b4b4",
										"&:hover": {
											backgroundColor: "#555555",
										},
									},
									"& .MuiInputBase-root": {
										backgroundColor: "#444444",
									},
									"& .MuiSelect-select": {
										backgroundColor: "#444444", // Cambia el fondo del select cuando está abierto
										color: "#ffffff", // Cambia el color del texto del select
									},
								}}
								onPageChange={handleChangePage}
								onRowsPerPageChange={handleChangeRowsPerPage}
								ActionsComponent={TablePaginationActions}
							/>
						</TableRow>
					</TableFooter>
				</Table>
			</TableContainer>
			<Snackbar
				open={showError}
				autoHideDuration={6000}
				onClose={() => setShowError(false)}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				style={{ right: "50px" }}>
				<Alert
					onClose={() => setShowError(false)}
					severity="error"
					sx={{
						width: "100%",
						backgroundColor: "rgba(255, 0, 0, 0.7)",
						color: "inherit",
						"& .MuiAlert-icon": {
							color: "inherit",
							opacity: 0.7,
						},
					}}>
					{errorMessage}
				</Alert>
			</Snackbar>
		</>
	);
}
