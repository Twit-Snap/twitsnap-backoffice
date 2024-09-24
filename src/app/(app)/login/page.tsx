"use client";

import { atom, useAtom, useSetAtom } from "jotai";
import form from "@/styles/login/form.module.css";
import styles from "@/styles/login/login.module.css";
import form_input from "@/styles/login/input.module.css";
import { authenticatedAtom } from "@/types/authTypes";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CircularProgress } from "@mui/material";

const identificationAtom = atom("");
const passwordAtom = atom("");
const loginErrorAtom = atom("");
const errorMessageAtom = atom(<></>);
const progressAtom = atom(false);

const INPUT_MAX_LENGTH: number = 50;
const TIMEOUT_MSECONDS = 5000;

export default function SignUp() {
	const [identification, setIdentification] = useAtom(identificationAtom);
	const [password, setPassword] = useAtom(passwordAtom);
	const [loginError, setLoginError] = useAtom(loginErrorAtom);
	const [errorMessage, setErrorMessage] = useAtom(errorMessageAtom);
	const [progress, setProgress] = useAtom(progressAtom);

	const setAuth = useSetAtom(authenticatedAtom);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const form_data: FormData = new FormData(e.currentTarget);

		setProgress(true);

		await axios
			.post(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/admins/login`,
				form_data,
				{
					headers: { "Content-type": "application/json" },
					timeout: TIMEOUT_MSECONDS,
				}
			)
			.then((response) => {
				localStorage.setItem(
					"auth",
					JSON.stringify(response.data.data)
				);
				setAuth(response.data.data);
				if (response.data) {
					setProgress(false);
					router.push("/signup");
				}
			})
			.catch((error) => {
				setProgress(false);
				if (error.code === "ECONNABORTED") {
					setErrorMessage(
						<label className="text-[1.1rem] text-[rgb(255,75,75)] font-[500]">
							Looks like the server is taking to long to respond,
							please try again in sometime
						</label>
					);
				} else {
					if ((error.status & 400) === 400) {
						setLoginError(`${form_input.error}`);
						setErrorMessage(
							<label className="text-[1.1rem] text-[rgb(255,75,75)] font-[500]">
								Incorrect password or email / username
							</label>
						);
					} else if ((error.status & 500) === 500) {
						setLoginError(`${form_input.server_error}`);
						setErrorMessage(
							<label className="text-[1.1rem] text-[rgb(255,75,75)] font-[500]">
								Server error occurred, please try again later
							</label>
						);
					}
				}
			});
	};

	return (
		<div>
			<div id={styles.signup}>
				<form onSubmit={handleSubmit} className={`${form.form}`}>
					<h1 className={form.title}>
						Welcome to TwitSnap Back Office!
					</h1>
					<div className="space-y-8 flex flex-col place-items-center max-w-[30rem]">
						<h2 className={form.h2}>Login as administrator</h2>
						<div className={`${form_input.textbox} text-gray-400 `}>
							<input
								name="emailOrUsername"
								className={`${loginError}`}
								id={form_input.input}
								maxLength={INPUT_MAX_LENGTH}
								required={true}
								type="text"
								onChange={(
									e: React.ChangeEvent<HTMLInputElement>
								) => {
									if (loginError) {
										setLoginError("");
										setErrorMessage(<></>);
									}
									setIdentification(e.target.value);
								}}></input>
							<label
								id={form_input.placeholder}
								className={`text-gray-400 ${
									identification.length == 0
										? ""
										: ` ${form_input.fill}`
								} ${loginError}`}>
								Email, or user name
							</label>
							<label
								id={form_input.len}
								className={`${form_input.len} ${loginError}`}>{`${identification.length} / ${INPUT_MAX_LENGTH}`}</label>
						</div>
						<div className="text-center">
							<div
								className={`${form_input.textbox} text-gray-400`}>
								<input
									name="password"
									className={`${loginError}`}
									id={form_input.input}
									type="password"
									maxLength={INPUT_MAX_LENGTH}
									required={true}
									onChange={(
										e: React.ChangeEvent<HTMLInputElement>
									) => {
										if (loginError) {
											setLoginError("");
											setErrorMessage(<></>);
										}
										setPassword(e.target.value);
									}}></input>
								<label
									id={form_input.placeholder}
									className={`text-gray-400" + + ${
										password.length == 0
											? ""
											: ` ${form_input.fill}`
									} ${loginError}`}>
									Password
								</label>
								<label
									id={form_input.len}
									className={`${form_input.len}`}>{`${password.length} / ${INPUT_MAX_LENGTH}`}</label>
							</div>
							<label
								id={form_input.error_label}
								className={`${loginError} place-self-center`}></label>
							<div className="mt-1">{errorMessage}</div>
						</div>
					</div>

					<button
						type="submit"
						className={`${form.submit} flex place-items-center place-content-center`}>
						{progress ? (
							<CircularProgress color="primary" />
						) : (
							"Submit"
						)}
					</button>
				</form>
			</div>
		</div>
	);
}
