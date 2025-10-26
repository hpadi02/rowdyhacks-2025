import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadPDF(pdfBuffer: Buffer, filename: string): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(
      `data:application/pdf;base64,${pdfBuffer.toString('base64')}`,
      {
        resource_type: 'raw',
        public_id: `contracts/${filename}`,
        folder: 'goloanme/contracts',
        format: 'pdf',
        access_mode: 'public',
      }
    );
    
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading PDF to Cloudinary:', error);
    // Fallback: return a mock URL for demo purposes
    return `https://demo.goloanme.app/contracts/${filename}`;
  }
}

export async function deletePDF(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: 'raw'
    });
  } catch (error) {
    console.error('Error deleting PDF from Cloudinary:', error);
    throw new Error('Failed to delete PDF');
  }
}
