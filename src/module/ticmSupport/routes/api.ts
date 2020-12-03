
/**
 * api
 * Copyright(c) 2019 Alejandro Villén
 * MIT Licensed
 */

import { Request, Response, Router } from "express";
const api: Router = Router();
import { settingsInstance } from "../../../core/Settings";
import { coreInstance } from "../../../core/Core";

/**
 * POST Support Issue
 * @description Insert a support issue into GLPI
 */
api.post("/set", async (req: Request, res: Response) => {

	const response: ResponseDT = {
		status: false,
		data: [],
		message: "",
		size: 0,
		time: new Date().toLocaleString()
	};

	const settings: any = await settingsInstance.getModuleSettings(req, "ticmSupport");
	const user: SettingsUserDT = settingsInstance.getUser(req);

	// Check form params
	if (req.body.description === "") {
		response.message = "ERROR: Code 001:  Description not defined.";
	} else if (req.body.category === "" || parseInt(req.body.category) <= 0) {
		response.message = "ERROR: Code 002:  Category not selected.";
	} else if (user === undefined) {
		response.message = "ERROR: Code 003:  User not exist or can't send messages.";
	} else if (Object.keys(settings).length === 0) {
		response.message = "";
	} else {
		const ticket: GLPIClientTicket = {
			category: req.body.category,
			description: req.body.description,
			email: user.profile.email,
			entityId: settings.entities[user.entityActivated],
			entityName: user.entity[user.entityActivated].name,
			name: user.profile.name,
			surname: user.profile.surname
		};


		const data: ResponseDT = await coreInstance.service.glpiClient.set(ticket);
		if (data.status) {
			response.status = true;
			response.message = "INFO: Message was send successfully.";
		} else {
			response.message = `ERROR: Code 004: Please contact with your administrator and report this issue directly with next info. ${JSON.stringify(data)}`;
		}
	}

	return res.json(response);
});

/**
 * GET Support Issue
 * @description Get a support issue from GLPI
 */
api.get("/get/ticket/count", async (req: Request, res: Response) => {

	const response: ResponseDT = {
		status: true,
		data: [],
		message: "",
		size: 0,
		time: new Date().toLocaleString()
	};

	const ticketStatus = {
		"pending": 0,
		"inprogress": 0,
		"done": 0
	};


	const settings: any = await settingsInstance.getModuleSettings(req, "ticmSupport");
	const user: SettingsUserDT = settingsInstance.getUser(req);

	// Check form params
	if (user === undefined) {
		response.message = "ERROR: Code 004:  User not exist.";
	} else if (Object.keys(settings).length > 0) {
		const data: ResponseDT = await coreInstance.service.glpiClient.getUserTicketsOfEntity(user.profile.email, settings.entities[user.entityActivated]);
		if (data.status) {
			const ticket = data.data;

			for (const element in ticket) {
				switch (ticket[element][12]) { // Ticket status
					case 1: // New
						ticketStatus.pending += 1;
						break;
					case 2: // Assigned
						ticketStatus.pending += 1;
						break;
					case 3: // Planned
						ticketStatus.inprogress += 1;
						break;
					case 4: // Waiting
						ticketStatus.inprogress += 1;
						break;
					case 5: // Done but not closed
						ticketStatus.inprogress += 1;
						break;
					case 6: // Closed
						ticketStatus.done += 1;
						break;
					default:
						break;
				}
			}
		}
		response.data.push(ticketStatus);
		response.size = response.data.length;
		response.message = data.message;
	}
	return res.json(response);
});

export const ticmSupportController: Router = api;