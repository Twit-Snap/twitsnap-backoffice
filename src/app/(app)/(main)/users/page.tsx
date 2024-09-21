"use client";

import {
	Avatar,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
} from "@mui/material";
import Link from "next/link";
import { atom, useAtom } from "jotai";

const u = [
	{
		username: "username",
		name: "nameeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
	},
];

for (let index = 0; index < 20; index++) {
	u.push({
		username: "username",
		name: "name",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
	});
}

const usersAtom = atom(u);

export default function Users() {
	const [users, setUsers] = useAtom(usersAtom);

	return (
		<div className="bg-[rgb(55,54,54)] flex place-content-center">
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
													{user.description}
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
