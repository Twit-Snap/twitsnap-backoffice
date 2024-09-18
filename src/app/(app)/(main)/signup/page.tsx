"use client";

import { atom, useAtom } from "jotai";
import form from "@/styles/signup/form.module.css";
import styles from "@/styles/signup/signup.module.css";
import form_input from "@/styles/signup/input.module.css";
import Image from "next/image";
import logo from "@/assets/icon.ico";
import { themedStyleClass } from "@/utils/utils";

const usernameAtom = atom("");
const emailAtom = atom("");
const nameAtom = atom("");
const passwordAtom = atom("");
const passwordAltAtom = atom("");

const INPUT_MAX_LENGTH: number = 50;

const handleSubmit = (e: any) => {
	e.preventDefault();

	const data: FormData = new FormData(e.target);

	console.log(data.get("usernames"));
};

export default function SignUp() {
	const [username, setUserName] = useAtom(usernameAtom);
	const [email, setEmail] = useAtom(emailAtom);
	const [name, setName] = useAtom(nameAtom);
	const [password, setPassword] = useAtom(passwordAtom);
	const [passwordAlt, setPasswordAlt] = useAtom(passwordAltAtom);

	return (
		<div id={styles.signup}>
			<Image src={logo} alt="asdas" width={70} height={70} />
			<form onSubmit={handleSubmit} className={`${form.form}`}>
				<h1 className={form.title}>Sign up a new admin</h1>
				<div className="space-y-8">
					<div
						className={`${themedStyleClass(
							form_input,
							"textbox"
						)} text-gray-400`}
					>
						<input
							className={themedStyleClass(form_input, "")}
							id={form_input.input}
							maxLength={INPUT_MAX_LENGTH}
							onChange={(e: any) => setUserName(e.target.value)}
						></input>
						<label
							id={form_input.placeholder}
							className={`text-gray-400" + ${themedStyleClass(
								form_input,
								""
							)} + ${
								username.length == 0
									? ""
									: ` ${themedStyleClass(form_input, "fill")}`
							}`}
						>
							User name
						</label>
						<label
							id={form_input.len}
							className={`${themedStyleClass(form_input, "len")}`}
						>{`${username.length} / ${INPUT_MAX_LENGTH}`}</label>
					</div>
					<div
						className={`${themedStyleClass(
							form_input,
							"textbox"
						)} text-gray-400`}
					>
						<input
							className={themedStyleClass(form_input, "")}
							id={form_input.input}
							type="email"
							maxLength={INPUT_MAX_LENGTH}
							onChange={(e: any) => setEmail(e.target.value)}
						></input>
						<label
							id={form_input.placeholder}
							className={`text-gray-400" + ${themedStyleClass(
								form_input,
								""
							)} + ${
								email.length == 0
									? ""
									: ` ${themedStyleClass(form_input, "fill")}`
							}`}
						>
							E-mail
						</label>
						<label
							id={form_input.len}
							className={`${themedStyleClass(form_input, "len")}`}
						>{`${email.length} / ${INPUT_MAX_LENGTH}`}</label>
					</div>
					<div
						className={`${themedStyleClass(
							form_input,
							"textbox"
						)} text-gray-400`}
					>
						<input
							className={themedStyleClass(form_input, "")}
							id={form_input.input}
							maxLength={INPUT_MAX_LENGTH}
							onChange={(e: any) => setName(e.target.value)}
						></input>
						<label
							id={form_input.placeholder}
							className={`text-gray-400" + ${themedStyleClass(
								form_input,
								""
							)} + ${
								name.length == 0
									? ""
									: ` ${themedStyleClass(form_input, "fill")}`
							}`}
						>
							Name
						</label>
						<label
							id={form_input.len}
							className={`${themedStyleClass(form_input, "len")}`}
						>{`${name.length} / ${INPUT_MAX_LENGTH}`}</label>
					</div>
					<div
						className={`${themedStyleClass(
							form_input,
							"textbox"
						)} text-gray-400`}
					>
						<input
							className={themedStyleClass(form_input, "")}
							id={form_input.input}
							type="password"
							maxLength={INPUT_MAX_LENGTH}
							onChange={(e: any) => setPassword(e.target.value)}
						></input>
						<label
							id={form_input.placeholder}
							className={`text-gray-400" + ${themedStyleClass(
								form_input,
								""
							)} + ${
								password.length == 0
									? ""
									: ` ${themedStyleClass(form_input, "fill")}`
							}`}
						>
							Password
						</label>
						<label
							id={form_input.len}
							className={`${themedStyleClass(form_input, "len")}`}
						>{`${password.length} / ${INPUT_MAX_LENGTH}`}</label>
					</div>
					<div
						className={`${themedStyleClass(
							form_input,
							"textbox"
						)} text-gray-400`}
					>
						<input
							className={themedStyleClass(form_input, "")}
							id={form_input.input}
							type="password"
							maxLength={INPUT_MAX_LENGTH}
							onChange={(e: any) =>
								setPasswordAlt(e.target.value)
							}
						></input>
						<label
							id={form_input.placeholder}
							className={`text-gray-400" + ${themedStyleClass(
								form_input,
								""
							)} + ${
								passwordAlt.length == 0
									? ""
									: ` ${themedStyleClass(form_input, "fill")}`
							}`}
						>
							Confirm password
						</label>
						<label
							id={form_input.len}
							className={`${themedStyleClass(form_input, "len")}`}
						>{`${passwordAlt.length} / ${INPUT_MAX_LENGTH}`}</label>
					</div>
				</div>
				<button type="submit" className={`${form.submit} `}>
					Submit
				</button>
			</form>
		</div>
	);
}
