/**
 * module
 * Copyright(c) 2019 Alejandro Villén
 * MIT Licensed
 */

import { coreInstance } from "../../core/Core";
import settings from "./settings.json";
export class Module {

	private configuration: SettingsModuleDT;
	constructor() {
		console.log("* Module TicM Support Instantiated at " + new Date().toLocaleString() + " *");
	}
	async init(user: SettingsUserDT) {
		this.configuration = JSON.parse(JSON.stringify(settings));

		for (const i in this.configuration.language) {
			const lang = await require("./language/" + i + ".json");
			this.configuration.language[i] = lang;
		}

		const glpiCategories = await coreInstance.service.glpiClient.getCategories();
		if (glpiCategories) this.configuration.settings.categories = glpiCategories.data;

	}
	public getSettings() {
		return this.configuration;
	}
}
