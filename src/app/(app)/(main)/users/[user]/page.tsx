import { Avatar, Divider, List, ListItem, ListItemText } from "@mui/material";

export default function User() {
	const user: any = {};

	user["username"] = "username";
	user["name"] = "name";
	user["email"] = "example@email.com";

	return (
		<div className="mx-10 py-6 h-full flex flex-row">
			<div className="pr-10 h-full">
				<Avatar
					src=""
					className="lg:h-[10rem] lg:w-[10rem] md:h-[7.5rem] md:w-[7.5rem] sm:h-[5rem] sm:w-[5rem]"
					variant="square"></Avatar>
			</div>
			<div className="w-full bg-[#868686] shadow rounded-r-md border-gray border-l-2">
				<List className="w-full overflow-auto max-h-full">
					{Object.entries(user).map(([k, v]) => (
						<div className="px-2">
							<ListItem key={`${k}`}>
								<ListItemText
									primary={
										<>
											<label className="capitalize">
												{k}
											</label>
											<hr className="mb-1" />
										</>
									}
									secondary={
										<label className="pl-3">{`${v}`}</label>
									}></ListItemText>
							</ListItem>
						</div>
					))}
				</List>
			</div>
		</div>
	);
}
