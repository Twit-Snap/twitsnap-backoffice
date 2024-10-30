"use client";

import { authenticatedAtom } from "@/types/authTypes";
import {
	Avatar,
	CircularProgress,
	List,
	ListItem,
	ListItemText,
} from "@mui/material";
import axios from "axios";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { UserType } from "@/types/user";

const TIMEOUT_MSECONDS = 5000;

export default function User({ params }: { params: { user: string } }) {
	const [user, setUser] = useState<UserType | null>(null);
	const token = useAtomValue(authenticatedAtom)?.token;
	const [statusMessage, setStatusMessage] = useState(
		<CircularProgress size="20rem" />
	);

	useEffect(() => {
		if (!token || !params.user) {
			return;
		}

		axios
			.get(
				`${process.env.NEXT_PUBLIC_USER_SERVER_URL}/admins/users/${params.user}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
					timeout: TIMEOUT_MSECONDS,
				}
			)
			.then((response) => {
				setUser(response.data.data);
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
								Oops!. This user does not exist!
							</label>
						);
					}
				}
			});
	}, [token, params.user, setStatusMessage, setUser]);

	if (!user) {
		return (
			<div className="w-full h-full flex justify-center place-items-center">
				{statusMessage}
			</div>
		);
	}

	return (
		<div className="mx-10 py-6 h-full flex flex-row">
			<div className="pr-10 h-full">
				<Avatar
					src="data:image/webp;base64,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"
					className="lg:h-[10rem] lg:w-[10rem] md:h-[7.5rem] md:w-[7.5rem] sm:h-[5rem] sm:w-[5rem]"
					variant="square"
				/>
			</div>
			<div className="w-full bg-[#868686] shadow rounded-r-md border-gray border-l-2">
				<List style={{ backgroundColor: '#25252b', color: '#b6b4b4' }} className="w-full overflow-auto max-h-full">
					{Object.entries(user).map(([k, v]) => (
						<div className="px-2" key={`${k}`}>
							<ListItem>
								<ListItemText
									primary={
										<>
											<label className="font-bold capitalize cursor-text text-customTextColor">
												{k}
											</label>
											<hr className="border-t border-customBorder my-4 "/>
										</>
									}
									secondary={
										<label className="pl-3 cursor-text text-customTextColor">{`${v}`}</label>
									}></ListItemText>
							</ListItem>
						</div>
					))}
				</List>
			</div>
		</div>
	);
}
