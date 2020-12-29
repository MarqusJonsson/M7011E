import { createWriteStream, existsSync, mkdirSync, readdirSync, unlinkSync } from "fs";
import { FileUpload } from "graphql-upload";
import { Identifier } from "../../identifiable";
import { Simulator } from "../../simulator";
import { BadRequest } from "../../utils/error";
import { createDir, getFileExtension, removeFileFromDir } from "../../utils/fileSystem";

const profilePictureFilename = 'profile-picture';
const ALLOWED_MIME_TYPES_REGEX = /^image\/(apng|avif|gif|jpeg|png|svg|webp)$/;

class PictureResolver {
	public uploadProfilePicture = (simulator: Simulator, userIdentifier: Identifier, file: FileUpload) => {
		return new Promise<boolean>((resolve, reject) => {
			if (file.mimetype.match(ALLOWED_MIME_TYPES_REGEX) === null) {
				reject(new BadRequest("Invalid file type"));
			}
			const directory = `${process.cwd()}/user-files/pictures/${userIdentifier.type}/${userIdentifier.id}/`;
			// Make sure directory exists
			createDir(directory)
				.then((directoryCreated) => {
					if (!directoryCreated) {
						// Remove previous profile-picture if there was one
						removeFileFromDir(directory, profilePictureFilename)
							.then(() => {
								// Store the new profile-picture
								file.createReadStream()
								.pipe(createWriteStream(directory + profilePictureFilename + '.' + getFileExtension(file.filename)))
								.on("finish", () => resolve(true))
								.on("error", () => reject(false))
							})
							.catch((error) => {
								reject(false);
							})
					} else {
						// Store the new profile-picture
						file.createReadStream()
							.pipe(createWriteStream(directory + profilePictureFilename + '.' + getFileExtension(file.filename)))
							.on("finish", () => resolve(true))
							.on("error", () => reject(false))
					}
				})
				.catch((error) => {
					reject(false);
				})
		});
	}
}

export const pictureResolver = new PictureResolver();
