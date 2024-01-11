import cloudinary from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
export default async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'karmaLeadsFlow',
        });
        return result.url;
    }
    catch (error) {
        console.error('Error uploading file to Cloudinary:', error);
        throw error;
    }
};

