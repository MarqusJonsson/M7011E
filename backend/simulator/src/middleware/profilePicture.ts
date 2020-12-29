import express from "express";
import { UserRole } from "../userRole";
import { Manager } from "../users/manager";
import { Prosumer } from "../users/prosumer";
import { BadRequest, Forbidden } from "../utils/error";
import { getProfilePicturePath } from "../utils/fileSystem";

export function profilePicture(request: express.Request, response: express.Response, next: express.NextFunction) {
	const user = (<any> request).payload.user;
	let roleName: string;
	switch (user.role) {
		case UserRole.PROSUMER:
			roleName = Prosumer.name;	
			break;
		case UserRole.MANAGER:
			roleName = Manager.name;
			break;
		default:
			throw new BadRequest('Invalid user role');
	}
	const resourceOwnerId = +request.params.userId;
	if (user.id !== resourceOwnerId) {
		throw new Forbidden('Access denied');
	}
	getProfilePicturePath(`${process.cwd()}/user-files/pictures/${roleName}/${resourceOwnerId}`)
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