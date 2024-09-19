"use client";

import { atom, useAtom } from "jotai";
import form from "@/styles/signup/form.module.css";
import styles from "@/styles/signup/signup.module.css";
import form_input from "@/styles/signup/input.module.css";
import Image from "next/image";
import logo from "@/assets/icon.ico";

const usernameAtom = atom("");
const emailAtom = atom("");
const passwordAtom = atom("");
const passwordAltAtom = atom("");
const usernameValidationAtom = atom("");
const emailValidationAtom = atom("");
const emailErrorMessageAtom = atom("");
const passwordValidationAtom = atom("");

const serverErrorAtom = atom("");

const INPUT_MAX_LENGTH: number = 50;

export default function SignUp() {
	const [username, setUserName] = useAtom(usernameAtom);
	const [email, setEmail] = useAtom(emailAtom);
	const [password, setPassword] = useAtom(passwordAtom);
	const [passwordAlt, setPasswordAlt] = useAtom(passwordAltAtom);

	const [usernameValidation, setUsernameValidation] = useAtom(
		usernameValidationAtom
	);
	const [emailValidation, setEmailValidation] = useAtom(emailValidationAtom);
	const [emailErrorMessage, setEmailErrorMessage] = useAtom(
		emailErrorMessageAtom
	);
	const [passwordValidation, setPasswordValidation] = useAtom(
		passwordValidationAtom
	);

	const [serverError, setServerError] = useAtom(serverErrorAtom);

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
			serverError ||
			usernameValidation ||
			emailValidation ||
			passwordValidation
		) {
			setServerError("");
			setUsernameValidation("");
			setEmailValidation("");
			setEmailErrorMessage("");
			setPasswordValidation("");
		}
	};

	const isValid = () => {
		let emailIsValid: boolean = isEmailValid(email);
		let passwordIsValid: boolean = password === passwordAlt;

		if (!emailIsValid) {
			setEmailValidation(form_input.error);
		}

		if (!passwordIsValid) {
			setPasswordValidation(form_input.error);
		}

		return emailIsValid && passwordIsValid;
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		const data: FormData = new FormData(e.target);

		if (!isValid()) {
			return;
		}

		fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}`, {
			method: "post",
			headers: {
				"Content-type": "application-json",
			},
			body: data,
		})
			.then((response) => {
				if (!response.ok) {
					throw { code: response.status, res: response.json() };
				}

				return response.json();
			})
			.then((data) => {})
			.catch((error) => {
				if ((error.code & 500) === 500) {
					setServerError(form_input.server_error);
				}

				switch (error.res.detail) {
					case "Email is already in use": {
						setEmailValidation(form_input.error);
						setEmailErrorMessage("Email is already in use");
					}

					case "Username is already in use": {
						setUsernameValidation(form_input.error);
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
				<div className="space-y-8">
					<div className={`${form_input.textbox} text-gray-400`}>
						<input
							id={form_input.input}
							className={usernameValidation}
							maxLength={INPUT_MAX_LENGTH}
							onChange={(e: any) => {
								clearValidators();
								setUserName(e.target.value);
							}}
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
							maxLength={INPUT_MAX_LENGTH}
							onChange={(e: any) => {
								clearValidators();
								setEmail(e.target.value);
							}}
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
							maxLength={INPUT_MAX_LENGTH}
							onChange={(e: any) => {
								clearValidators();
								setPassword(e.target.value);
							}}
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
							className={passwordValidation}
							maxLength={INPUT_MAX_LENGTH}
							onChange={(e: any) => {
								clearValidators();
								setPasswordAlt(e.target.value);
							}}
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
							className={`${form_input.len}`}>{`${passwordAlt.length} / ${INPUT_MAX_LENGTH}`}</label>
						<label
							id={form_input.error_label}
							className={passwordValidation}>
							Both passwords must match
						</label>
						<label
							id={form_input.error_label}
							className={serverError}>
							Server error occurred, please try again later
						</label>
					</div>
				</div>
				<button type="submit" className={`${form.submit}`}>
					Submit
				</button>
			</form>
		</div>
	);
}
