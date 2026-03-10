import * as functions from 'firebase-functions/v1';
import { defineSecret } from 'firebase-functions/params';
import { v2 as cloudinary } from 'cloudinary';

// Define individual secrets
const cloudinaryCloudName = defineSecret('CLOUDINARY_CLOUD_NAME');
const cloudinaryApiKey = defineSecret('CLOUDINARY_API_KEY');
const cloudinaryApiSecret = defineSecret('CLOUDINARY_API_SECRET');

/**
 * Delete images from Cloudinary
 * Callable Cloud Function - requires authentication
 */
export const deleteCloudinaryImages = functions
  .runWith({ secrets: [cloudinaryCloudName, cloudinaryApiKey, cloudinaryApiSecret] })
  .https.onCall(async (data, context) => {
  // Configure Cloudinary with secret values
  cloudinary.config({
    cloud_name: cloudinaryCloudName.value(),
    api_key: cloudinaryApiKey.value(),
    api_secret: cloudinaryApiSecret.value()
  });

  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to delete images'
    );
  }

  const { photoUrls } = data;

  if (!photoUrls || !Array.isArray(photoUrls) || photoUrls.length === 0) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'photoUrls must be a non-empty array'
    );
  }

  try {
    const publicIds: string[] = [];

    // Extract public IDs from URLs
    photoUrls.forEach((url: string) => {
      const urlParts = url.split('/');
      const uploadIndex = urlParts.indexOf('upload');

      if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
        const pathParts = urlParts.slice(uploadIndex + 2);
        const fullPath = pathParts.join('/');
        const publicId = fullPath.replace(/\.[^/.]+$/, '');
        publicIds.push(publicId);
      }
    });

    if (publicIds.length === 0) {
      throw new Error('No valid public IDs extracted from URLs');
    }

    // Delete from Cloudinary
    const result = await cloudinary.api.delete_resources(publicIds, {
      resource_type: 'image'
    });

    console.log('Cloudinary deletion result:', result);

    return {
      success: true,
      deleted: result.deleted,
      notFound: result.not_found || []
    };

  } catch (error: any) {
    console.error('Error deleting from Cloudinary:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to delete images from Cloudinary: ' + error.message
    );
  }
});
