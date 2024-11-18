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
} from "recharts";
import { TooltipBlockProps } from "@/types/metric";

interface LoginData {
	date: string;
	blockedUsers: number;
}

const Page: React.FC = () => {
	const [data, setData] = useState<LoginData[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [statusMessage, setStatusMessage] = useState(
		<CircularProgress size="10rem" />
	);
	const [barHovered, setBarHovered] = useState(false);

	const fetchData = async () => {
		axios
			.get(`${process.env.NEXT_PUBLIC_METRICS_SERVER_URL}/metrics`, {
				params: { type: "blocked" },
			})
			.then((response) => {
				setData(response.data.data);
				console.log(response.data.data);
			})
			.catch((error) => {
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

	const chartData = data.map((item) => ({
		date: new Date(item.date).toLocaleDateString(),
		blockedUsersCount: item.blockedUsers,
	}));
	const BlockedTooltip: React.FC<TooltipBlockProps> = ({
		active,
		payload,
	}) => {
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
					<p>{`Blocked users: ${data.blockedUsersCount}`}</p>
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
				}}>
				Blocked Users Per Day
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
								value: "Blocked Users",
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
								<BlockedTooltip
									active={false}
									payload={undefined}
								/>
							}
							cursor={{ fill: "transparent" }}
							active={barHovered}
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
									value: "Blocked",
									type: "square",
									color: "#82ca9d",
								},
							]}
						/>
						{}
						<Bar
							dataKey="blockedUsersCount"
							fill="#82ca9d"
							name="Blocked"
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
