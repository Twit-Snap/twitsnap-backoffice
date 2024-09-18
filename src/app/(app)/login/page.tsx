"use client";

import { atom, useAtom } from "jotai";
import form from "@/styles/login/form.module.css";
import styles from "@/styles/login/login.module.css";
import form_input from "@/styles/login/input.module.css";
import { themedStyleClass } from "@/utils/utils";

const identificationAtom = atom("");
const passwordAtom = atom("");

const INPUT_MAX_LENGTH: number = 50;

const handleSubmit = (e: any) => {
	e.preventDefault();

	const data: FormData = new FormData(e.target);

	console.log(data.get("usernames"));
};

export default function SignUp() {
	const [identification, setIdentification] = useAtom(identificationAtom);
	const [password, setPassword] = useAtom(passwordAtom);

	return (
		<div id={styles.signup}>
			{/* <Image src={logo} alt="asdas" width={70} height={70} /> */}
			<form onSubmit={handleSubmit} className={`${form.form}`}>
				<h1 className={form.title}>Welcome to TwitSnap Back Office!</h1>
				<div className="space-y-8 flex flex-col place-items-center">
					<h2 className={form.h2}>Login as administrator</h2>
					<div
						className={`${themedStyleClass(
							form_input,
							"textbox"
						)} text-gray-400`}>
						<input
							className={themedStyleClass(form_input, "")}
							id={form_input.input}
							maxLength={INPUT_MAX_LENGTH}
							type="text"
							onChange={(e: any) =>
								setIdentification(e.target.value)
							}></input>
						<label
							id={form_input.placeholder}
							className={`text-gray-400" + ${themedStyleClass(
								form_input,
								""
							)} + ${
								identification.length == 0
									? ""
									: ` ${themedStyleClass(form_input, "fill")}`
							}`}>
							Emal, or user name
						</label>
						<label
							id={form_input.len}
							className={`${themedStyleClass(
								form_input,
								"len"
							)}`}>{`${identification.length} / ${INPUT_MAX_LENGTH}`}</label>
					</div>
					<div
						className={`${themedStyleClass(
							form_input,
							"textbox"
						)} text-gray-400`}>
						<input
							className={themedStyleClass(form_input, "")}
							id={form_input.input}
							type="password"
							maxLength={INPUT_MAX_LENGTH}
							onChange={(e: any) =>
								setPassword(e.target.value)
							}></input>
						<label
							id={form_input.placeholder}
							className={`text-gray-400" + ${themedStyleClass(
								form_input,
								""
							)} + ${
								password.length == 0
									? ""
									: ` ${themedStyleClass(form_input, "fill")}`
							}`}>
							Password
						</label>
						<label
							id={form_input.len}
							className={`${themedStyleClass(
								form_input,
								"len"
							)}`}>{`${password.length} / ${INPUT_MAX_LENGTH}`}</label>
					</div>
				</div>
				<button type="submit" className={`${form.submit} `}>
					Submit
				</button>
			</form>
		</div>
	);
}
