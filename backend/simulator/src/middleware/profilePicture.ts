import express from "express";
import { Identifier } from "../identifiable";
import { Simulator } from "../simulator";
import { UserRole } from "../userRole";
import { Manager } from "../users/manager";
import { Prosumer } from "../users/prosumer";
import { BadRequest, Forbidden, NotFound } from "../utils/error";
import { getProfilePicturePath } from "../utils/fileSystem";

export function profilePicture(simulator: Simulator) {
	return (request: express.Request, response: express.Response, next: express.NextFunction) => {
	const requester = (<any> request).payload.user;
	const resourceOwner = { id: +request.params.userId, role: +request.params.roleId };
	// Make sure requester should be allowed to obtain the resource
	switch (requester.role) {
		case UserRole.PROSUMER:
			if (requester.id !== resourceOwner.id) {
				throw new Forbidden('Access denied');
			}
			break;
		case UserRole.MANAGER:
			const requestingManager = simulator.managers.uGet(new Identifier(Manager.name, requester.id));
			if (requestingManager === undefined) {
				throw new NotFound('Requesting user not found');
			}
			if (requester.role === resourceOwner.role) {
				// All managers can request other managers resource
				break;
			}
			if (requestingManager.prosumers.uGet(new Identifier(Prosumer.name, resourceOwner.id)) === undefined) {
				// Manager does not have a reference to the resource owner
				throw new Forbidden('Access denied'); 
			}
			break;
		default:
			throw new BadRequest('Invalid user role of requesting user');
	}
	// Get the role name of the resource owner
	let roleName: string;
	switch (resourceOwner.role) {
		case UserRole.PROSUMER:
			roleName = Prosumer.name;
			break;
		case UserRole.MANAGER:
			roleName = Manager.name;
			break;
		default:
			throw new BadRequest('Invalid user role of resource owner');
	}
	getProfilePicturePath(`${process.cwd()}/user-files/pictures/${roleName}/${resourceOwner.id}`)
		.then((profilePicturePath) => {
			response.sendFile(profilePicturePath, (error) => {
				if (error !== undefined) {
					console.error(error);
				}
			});
		})
		.catch((error) => {
			response.sendStatus(204); // TODO: Replace status code with exported constant
		});
	}
}
