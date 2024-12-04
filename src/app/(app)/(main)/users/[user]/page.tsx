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
import default_avatar from "@/assets/no-profile-picture.png";

const TIMEOUT_MSECONDS = 5000;

export default function User({ params }: { params: { user: string } }) {
	const [user, setUser] = useState<UserType | null>(null);
	const token = useAtomValue(authenticatedAtom)?.token;
	const [statusMessage, setStatusMessage] = useState(
		<CircularProgress size="10rem" />
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
		<div className="mx-10 py-6 h-full flex flex-row rounded-full">
			<div className="pr-10 mr-10 h-full rounded-full overflow-hidden">
				<Avatar
					src={user.profilePicture? user.profilePicture: default_avatar.src}
					className="lg:h-[10rem] lg:w-[10rem] md:h-[7.5rem] md:w-[7.5rem] sm:h-[5rem] sm:w-[5rem]"
				/>
			</div>
			<div className="w-full bg-[#868686] shadow rounded-r-md border-gray border-l-2">
				<List
					style={{ backgroundColor: "#25252b", color: "#b6b4b4" }}
					className="w-full overflow-auto max-h-full">
					{Object.entries(user).map(([k, v]) => (
						<div className="px-2" key={`${k}`}>
							<ListItem>
								<ListItemText
									primary={
										<>
											<label className="font-bold capitalize cursor-text text-customTextColor">
												{k}
											</label>
											<hr className="border-t border-customBorder my-4 " />
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
