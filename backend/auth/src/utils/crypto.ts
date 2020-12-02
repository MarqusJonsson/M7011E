import bcrypt from 'bcrypt';

const saltRounds = 10;
function hash(data: any): Promise<string> {
	return bcrypt.hash(data, saltRounds);
}

function verifyHash(data: any, encryptedData: string) {
	return bcrypt.compare(data, encryptedData);
}

export const crypto = {
	hash: hash,
	verifyHash: verifyHash
}