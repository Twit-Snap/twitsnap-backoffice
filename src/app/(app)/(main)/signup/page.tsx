"use client";

import { useAtomValue } from "jotai";
import form from "@/styles/signup/form.module.css";
import styles from "@/styles/signup/signup.module.css";
import form_input from "@/styles/signup/input.module.css";
import Image from "next/image";
import logo from "@/assets/icon.ico";
import { authenticatedAtom } from "@/types/authTypes";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { useState } from "react";

const TIMEOUT_MSECONDS = 5000;

const INPUT_MAX_LENGTH: number = 50;

export default function SignUp() {
	const [username, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordAlt, setPasswordAlt] = useState("");

	const [usernameValidation, setUsernameValidation] = useState("");
	const [emailValidation, setEmailValidation] = useState("");
	const [emailErrorMessage, setEmailErrorMessage] = useState("");
	const [passwordValidation, setPasswordValidation] = useState("");

	const [statusMessage, setStatusMessage] = useState(<></>);

	const token: string | undefined = useAtomValue(authenticatedAtom)?.token;

	const [progress, setProgress] = useState(false);

	const isEmailValid = (email: string) => {
		const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		if (!emailPattern.test(email)) {
			setEmailErrorMessage("Please enter a valid email address");
			return false;
		}

		return true;
	};

	const clearValidators = () => {
		if (
			statusMessage ||
			usernameValidation ||
			emailValidation ||
			passwordValidation
		) {
			setStatusMessage(<></>);
			setUsernameValidation("");
			setEmailValidation("");
			setEmailErrorMessage("");
			setPasswordValidation("");
		}
	};

	const isValid = () => {
		const emailIsValid: boolean = isEmailValid(email);
		const passwordIsValid: boolean = password === passwordAlt;

		if (!emailIsValid) {
			setEmailValidation(form_input.error);
		}

		if (!passwordIsValid) {
			setPasswordValidation(form_input.error);
		}

		return emailIsValid && passwordIsValid;
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!isValid()) {
			return;
		}

		const data: FormData = new FormData(e.currentTarget);
		data.delete("passwordAlt");

		setProgress(true);

		await axios
			.post(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/admins/register`,
				data,
				{
					headers: {
						"Content-type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					timeout: TIMEOUT_MSECONDS,
				}
			)
			.then((response) => {
				setProgress(false);
				setUserName("");
				setEmail("");
				setPassword("");
				setPasswordAlt("");
				console.log(response.data);
			})
			.catch((error) => {
				setProgress(false);

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
						switch (error.response.data.detail) {
							case "Username is already in use": {
								setUsernameValidation(form_input.error);
								break;
							}

							case "Email is already in use": {
								setEmailValidation(form_input.error);
								setEmailErrorMessage("Email is already in use");
								break;
							}
						}
					}
				}
			});
	};

	return (
		<div id={styles.signup}>
			<Image src={logo} alt="asdas" width={70} height={70} />
			<form
				onSubmit={handleSubmit}
				className={`${form.form} text-center`}>
				<h1 className={form.title}>Sign up a new admin</h1>
				<div className="space-y-8 max-w-[30rem]">
					<div className={`${form_input.textbox} text-gray-400`}>
						<input
							id={form_input.input}
							name="username"
							className={usernameValidation}
							maxLength={INPUT_MAX_LENGTH}
							onChange={(
								e: React.ChangeEvent<HTMLInputElement>
							) => {
								clearValidators();
								setUserName(e.target.value);
							}}
							value={username}
							required={true}></input>
						<label
							id={form_input.placeholder}
							className={`text-gray-400 ${usernameValidation} ${
								username.length == 0
									? ""
									: ` ${form_input.fill}`
							}`}>
							User name
						</label>
						<label
							id={form_input.len}
							className={`${form_input.len}`}>{`${username.length} / ${INPUT_MAX_LENGTH}`}</label>
						<label
							id={form_input.error_label}
							className={usernameValidation}>
							Username already in use
						</label>
					</div>
					<div className={`${form_input.textbox} text-gray-400`}>
						<input
							id={form_input.input}
							className={emailValidation}
							type="email"
							name="email"
							maxLength={INPUT_MAX_LENGTH}
							onChange={(
								e: React.ChangeEvent<HTMLInputElement>
							) => {
								clearValidators();
								setEmail(e.target.value);
							}}
							value={email}
							required={true}></input>
						<label
							id={form_input.placeholder}
							className={`text-gray-400 ${emailValidation} ${
								email.length == 0 ? "" : ` ${form_input.fill}`
							}`}>
							E-mail
						</label>
						<label
							id={form_input.len}
							className={`${form_input.len}`}>{`${email.length} / ${INPUT_MAX_LENGTH}`}</label>
						<label
							id={form_input.error_label}
							className={emailValidation}>
							{emailErrorMessage}
						</label>
					</div>
					<div className={`${form_input.textbox} text-gray-400`}>
						<input
							id={form_input.input}
							className={passwordValidation}
							type="password"
							name="password"
							maxLength={INPUT_MAX_LENGTH}
							onChange={(
								e: React.ChangeEvent<HTMLInputElement>
							) => {
								clearValidators();
								setPassword(e.target.value);
							}}
							value={password}
							required={true}></input>
						<label
							id={form_input.placeholder}
							className={`text-gray-400 ${passwordValidation} ${
								password.length == 0
									? ""
									: ` ${form_input.fill}`
							}`}>
							Password
						</label>
						<label
							id={form_input.len}
							className={`${form_input.len}`}>{`${password.length} / ${INPUT_MAX_LENGTH}`}</label>
					</div>
					<div className={`${form_input.textbox} text-gray-400`}>
						<input
							id={form_input.input}
							type="password"
							name="passwordAlt"
							className={passwordValidation}
							maxLength={INPUT_MAX_LENGTH}
							onChange={(
								e: React.ChangeEvent<HTMLInputElement>
							) => {
								clearValidators();
								setPasswordAlt(e.target.value);
							}}
							value={passwordAlt}
							required={true}></input>
						<label
							id={form_input.placeholder}
							className={`text-gray-400 ${passwordValidation} ${
								passwordAlt.length == 0
									? ""
									: ` ${form_input.fill}`
							}`}>
							Confirm password
						</label>
						<label
							id={form_input.len}
							className={`${form_input.len} `}>{`${passwordAlt.length} / ${INPUT_MAX_LENGTH}`}</label>
						<label
							id={form_input.error_label}
							className={passwordValidation}>
							Both passwords must match
						</label>
						<div className="mt-1">{statusMessage}</div>
					</div>
				</div>
				<button
					type="submit"
					onClick={clearValidators}
					className={`${form.submit} flex place-items-center place-content-center`}>
					{progress ? <CircularProgress color="primary" /> : "Submit"}
				</button>
			</form>
		</div>
	);
}
