import {vs as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        console.log("File is uploaded on cloudinary", response.url);
        console.log(`Asim you wanted to print and see the response ${response}`)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved file temporary file
        //  as the upload operation got failed
        return null;
    }
}

export {uploadOnCloudinary}