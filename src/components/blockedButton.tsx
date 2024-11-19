import { authenticatedAtom } from "@/types/authTypes";
import { LockOpenOutlined, LockOutlined } from "@mui/icons-material";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { useAtomValue } from "jotai";
import { MouseEvent, useState } from "react";

const TIMEOUT_MSECONDS = 5000;

interface BlockedButtonProps {
	identification: string;
	initIsBlocked: boolean;
	onClick: (isBlocked: boolean, identification: string) => Promise<boolean>;
}

export default function BlockedButton({
	identification,
	initIsBlocked,
	onClick,
}: BlockedButtonProps) {
	const [isBlocked, setIsBlocked] = useState<boolean>(initIsBlocked);
	const [loading, setLoading] = useState<boolean>(false);

	const handleClick = async (e: MouseEvent) => {
		e.stopPropagation();
		setLoading(true);
		setIsBlocked(await onClick(isBlocked, identification));
		setLoading(false);
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
					"Unblock"
				) : (
					"Block"
				)}
			</Button>
		</>
	);
}
