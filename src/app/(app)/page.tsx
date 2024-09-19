"use client";

import { useAtomValue } from "jotai";
import { redirect } from "next/navigation";
import { authenticatedAtom } from "../../../types/authTypes";

export default function GoHome() {
	if (!useAtomValue(authenticatedAtom)) {
		redirect("/login");
	}

	redirect("/signup");
}
