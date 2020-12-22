import { createWriteStream, existsSync, mkdirSync, readdirSync, unlinkSync } from "fs";
import { FileUpload } from "graphql-upload";
import { Identifier } from "../../identifiable";
import { Simulator } from "../../simulator";
import { BadRequest } from "../../utils/error";

const profilePictureFilename = 'profile-picture';
const ALLOWED_MIME_TYPES_REGEX = /^image\/(apng|avif|gif|jpeg|png|svg|webp)$/;

class PictureResolver {
	public uploadProfilePicture = (simulator: Simulator, userIdentifier: Identifier, file: FileUpload) => {
		return new Promise<boolean>(async (resolve, reject) => {
			if (file.mimetype.match(ALLOWED_MIME_TYPES_REGEX) === null) {
				reject(new BadRequest("Invalid file type"));
			}
			const dir = `user-files/pictures/${userIdentifier.type}/${userIdentifier.id}`;
			// Make sure directory exists
			if (!createDir(dir)) {
				// Remove previous profile-picture
				removeFileFromDir(dir, profilePictureFilename);
			}
			// Store the new profile-picture
			file.createReadStream()
				.pipe(createWriteStream(dir + '/' + profilePictureFilename + '.' + getFileExtension(file.filename)))
				.on("finish", () => resolve(true))
				.on("error", reject)
		});
	}
}


// Removes file with given filename (excluding extension) from given directory if it exists
function removeFileFromDir(dir: string, filename: string) {
	readdirSync(dir).forEach(file => {
		if (file.split('.').slice(0, -1).join('.') === filename) {
			unlinkSync(dir + '/' + file);
			return;
		}
	});
}

// Creates a directory and returns true if created
// returns false if directory already exists
function createDir(dir: string): boolean {
	if (!existsSync(dir)) {
		mkdirSync(dir);
		return true;
	}
	return false;
}

function getFileExtension(filename: string) {
	return filename.split('.').pop();
}


export const pictureResolver = new PictureResolver();
