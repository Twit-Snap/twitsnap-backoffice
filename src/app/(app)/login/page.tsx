"use client";

import { atom, useAtom } from "jotai";
import form from "@/styles/login/form.module.css";
import styles from "@/styles/login/login.module.css";
import form_input from "@/styles/login/input.module.css";

const identificationAtom = atom("");
const passwordAtom = atom("");
const loginErrorAtom = atom("");
const errorMessageAtom = atom("");

const INPUT_MAX_LENGTH: number = 50;

export default function SignUp() {
	const [identification, setIdentification] = useAtom(identificationAtom);
	const [password, setPassword] = useAtom(passwordAtom);
	const [loginError, setLoginError] = useAtom(loginErrorAtom);
	const [errorMessage, setErrorMessage] = useAtom(errorMessageAtom);

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		const form_data: FormData = new FormData(e.target);

		await fetch("https://api.restful-api.dev/objects", {
			method: "post",
			headers: { "Content-type": "application/json" },
			body: form_data,
		})
			.then((response) => {
				if (!response.ok) {
					throw { code: response.status };
				}
			})
			.then((data) => {})
			.catch((error) => {
				if ((error.code & 400) === 400) {
					setLoginError(`${form_input.error}`);
					setErrorMessage("Incorrect password or email / username");
				} else if ((error.code & 500) === 500) {
					setLoginError(`${form_input.server_error}`);
					setErrorMessage(
						"Server error occurred, please try again later"
					);
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
					<div className="space-y-8 flex flex-col place-items-center">
						<h2 className={form.h2}>Login as administrator</h2>
						<div className={`${form_input.textbox} text-gray-400 `}>
							<input
								name="identification"
								className={`${loginError}`}
								id={form_input.input}
								maxLength={INPUT_MAX_LENGTH}
								required={true}
								type="text"
								onChange={(e: any) => {
									if (loginError) {
										setLoginError("");
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
									onChange={(e: any) => {
										if (loginError) {
											setLoginError("");
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
								className={`${loginError} place-self-center`}>
								{errorMessage}
							</label>
						</div>
					</div>
					<button type="submit" className={`${form.submit} `}>
						Submit
					</button>
				</form>
			</div>
		</div>
	);
}
