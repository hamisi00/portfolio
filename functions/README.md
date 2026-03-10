# Firebase Cloud Functions - Portfolio Website

Automatic Cloudinary image deletion when activities are deleted from the dashboard.

## Setup

### 1. Install Dependencies

```bash
cd functions
npm install
```

### 2. Configure Cloudinary Credentials

Set your Cloudinary API credentials using Firebase CLI:

```bash
firebase functions:config:set \
  cloudinary.cloud_name="dnmp1jys0" \
  cloudinary.api_key="YOUR_CLOUDINARY_API_KEY" \
  cloudinary.api_secret="YOUR_CLOUDINARY_API_SECRET"
```

**Where to find these values:**
- Log in to [Cloudinary Dashboard](https://cloudinary.com/console)
- Go to Settings → Security → API Keys
- Copy: Cloud Name, API Key, and API Secret

### 3. Build the Functions

```bash
npm run build
```

### 4. Deploy to Firebase

```bash
# Deploy only functions
npm run deploy

# Or from project root
firebase deploy --only functions
```

## Functions

### `deleteCloudinaryImages`

Deletes multiple images from Cloudinary when an activity is deleted.

**Parameters:**
- `photoUrls`: Array of Cloudinary image URLs

**Returns:**
```json
{
  "success": true,
  "deleted": {
    "image1_public_id": "deleted",
    "image2_public_id": "deleted"
  },
  "notFound": []
}
```

**Security:**
- Requires user authentication
- Only callable by authenticated users

## Testing

### Local Emulation

```bash
npm run serve
```

### View Logs

```bash
npm run logs
```

## Troubleshooting

### Function not found
- Ensure functions are deployed: `firebase deploy --only functions`
- Check Firebase Console → Functions tab

### Authentication error
- Verify user is logged in before deleting activities
- Check Firebase Authentication is enabled

### Cloudinary errors
- Verify API credentials are set correctly
- Check Cloudinary dashboard for API usage limits
- Ensure public IDs are being extracted correctly from URLs

## Cost Considerations

- **Firebase Functions**: Free tier includes 2M invocations/month
- **Cloudinary API**: Free tier includes 25k API calls/month
- Estimated cost for typical usage: **$0/month**
