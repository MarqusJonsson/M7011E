import * as fs from 'fs';
import { NotFound } from './error';

export function getProfilePicturePath(directory: string): Promise<string> {
	return new Promise((resolve, reject) => {
		fs.promises.readdir(directory)
			.then((files) => {
				for (const file of files) {
					if (trimFilenameExtension(file) === 'profile-picture') {
						resolve(directory + '/' + file);
						break;
					}
				}
			})
			.catch((error) => {
				reject();
			});
	});
}

export function createDir(directory: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		fs.promises.mkdir(directory, { recursive: true })
			.then((createdDirectory: string | undefined) => {
				if (createdDirectory !== undefined) {
					resolve(true);
				} else {
					resolve(false);
				}
			})
			.catch(() => {
				reject();
			})
	});
}

// Removes file with given filename (excluding extension) from given directory if it exists
export function removeFileFromDir(dir: string, filename: string): Promise<void> {
	return new Promise((resolve, reject) => {
		fs.promises.readdir(dir)
			.then((files) => {
				let fileToBeRemoved;
				files.forEach(file => {
					if (trimFilenameExtension(file) === filename) {
						fileToBeRemoved = dir + '/' + file;
						return;
					}
				});
				if (fileToBeRemoved === undefined) {
					reject(new NotFound('File to be removed not found'));
				} else {
					removeFile(fileToBeRemoved)
						.then(() => {
							resolve();
						})
						.catch((error) => {
							reject(error);
						});
				}
			})
			.catch((error) => {
				reject(error);
			});
	});
}

function removeFile(filePath: string) {
	return fs.promises.unlink(filePath)
}

// Return filename excluding filename extension
function trimFilenameExtension(fullFilename: string) {
	return fullFilename.split('.').slice(0, -1).join('.');
}


export function getFileExtension(filename: string) {
	return filename.split('.').pop();
}