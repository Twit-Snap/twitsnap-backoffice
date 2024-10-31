import { authenticatedAtom } from "@/types/authTypes";
import {
	LockOpenOutlined,
	LockOutlined,
	LockPerson,
	LockPersonOutlined,
	LockResetOutlined,
} from "@mui/icons-material";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { useAtomValue } from "jotai";
import { MouseEvent, useState } from "react";

const TIMEOUT_MSECONDS = 5000;

interface BlockedButtonProps {
	username: string;
	initIsBlocked: boolean;
}

export default function BlockedButton({
	username,
	initIsBlocked,
}: BlockedButtonProps) {
	const [isBlocked, setIsBlocked] = useState<boolean>(initIsBlocked);
	const [loading, setLoading] = useState<boolean>(false);
	const token = useAtomValue(authenticatedAtom)?.token;

	const sendModification = async () => {
		axios
			.patch(
				`${process.env.NEXT_PUBLIC_USER_SERVER_URL}/users/${username}`,
				{
					isBlocked: !isBlocked,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
					timeout: TIMEOUT_MSECONDS,
				}
			)
			.then(({ data }) => {
				console.log(
					"Blocked user '",
					data.username,
					"' block state: ",
					data.isBlocked
				);
				setLoading(false);
				setIsBlocked(data.isBlocked);
			});
	};

	const handleClick = async (e: MouseEvent) => {
		e.stopPropagation();
		setLoading(true);
		await sendModification();
	};

	return (
		<>
			<Button
				className="min-w-[12rem]"
				onClick={handleClick}
				endIcon={
					loading ? (
						<></>
					) : isBlocked ? (
						<LockOpenOutlined />
					) : (
						<LockOutlined />
					)
				}
				variant={isBlocked ? "outlined" : "contained"}>
				{loading ? (
					<CircularProgress size="2rem" color="inherit" />
				) : isBlocked ? (
					"Unblock user"
				) : (
					"Block user"
				)}
			</Button>
		</>
	);
}
