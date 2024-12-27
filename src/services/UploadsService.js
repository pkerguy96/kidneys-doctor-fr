import { APIClient } from "./Http";
export const UploadServiceApiClient = new APIClient("/Filesupload");
const ShowUploadsServiceApiClient = new APIClient("/uploadsInfo");
export const DeleteUploadServiceClient = new APIClient("/Filesupload");
export const DownloadClusterApiClient = new APIClient("/downloadZip");
export default ShowUploadsServiceApiClient;
