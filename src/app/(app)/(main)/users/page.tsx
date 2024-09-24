"use client";

import {
	Avatar,
	CircularProgress,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
} from "@mui/material";
import Link from "next/link";
import { useAtomValue } from "jotai";
import { authenticatedAtom } from "@/types/authTypes";
import axios from "axios";
import { useEffect, useState } from "react";
import { UserType } from "@/types/user";

const TIMEOUT_MSECONDS = 5000;

export default function Users() {
	const [users, setUsers] = useState<UserType[] | null>(null);
	const token = useAtomValue(authenticatedAtom)?.token;
	const [statusMessage, setStatusMessage] = useState(
		<CircularProgress size="20rem" />
	);

	useEffect(() => {
		if (!token) {
			return;
		}

		axios
			.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/admins/users`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				timeout: TIMEOUT_MSECONDS,
			})
			.then((response) => setUsers(response.data.data))
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
	}, [token, setStatusMessage, setUsers]);

	if (!users) {
		return (
			<div className="w-full h-full flex justify-center place-items-center">
				{statusMessage}
			</div>
		);
	}

	return (
		<div className="flex place-content-center min-h-full min-w-full">
			<div className="w-1/2 border-[rgb(81,81,81)] border-l border-r">
				<List>
					{users.map((user) => (
						<Link
							key={`${user.username}`}
							className={`w-full`}
							href={`/users/${user.username}`}>
							<ListItem alignItems="flex-start">
								<div className="flex place-content-center w-[100%]">
									<ListItemAvatar>
										<Avatar
											alt={`@${user.username}`}
											src=""
										/>
									</ListItemAvatar>
									<ListItemText
										secondary={
											<span className="flex flex-col space-y-1">
												<label className="cursor-pointer text-white text-base font-bold hover:underline truncate">
													{user.name}
												</label>
												<label className="cursor-pointer text-[rgb(181,181,181)] truncate">
													@{user.username}
												</label>
												<label className="cursor-pointer text-[rgb(181,181,181)] whitespace-wrap text-pretty">
													{/* {user.description} */}
													Lorem ipsum dolor sit amet,
													consectetur adipiscing elit.
													Vivamus ultricies fringilla
													tortor, in elementum nunc
													fermentum ornare. Etiam
													hendrerit libero elementum
													pulvinar tempus. Mauris at
													risus risus. Phasellus in
													nunc urna. Quisque et
													pellentesque elit, in
													ullamcorper lorem. Sed
													ornare in metus at
													consequat. Phasellus at nisi
													sed sem mattis egestas sed
													quis risus. Mauris hendrerit
													mattis metus, sed sodales
													libero blandit at.
												</label>
											</span>
										}></ListItemText>
								</div>
							</ListItem>
							<hr className="border-[rgb(81,81,81)]" />
						</Link>
					))}
				</List>
			</div>
		</div>
	);
}
