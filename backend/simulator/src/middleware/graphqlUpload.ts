import { graphqlUploadExpress } from "graphql-upload";

export function graphQLUpload() {
	return graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1})
}
