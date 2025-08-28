/**
 * Extracts the file ID from a Google Drive share link
 * @param driveLink - The Google Drive share URL
 * @returns The extracted file ID or null if not found
 *
 * @example
 * extractGoogleDriveId('https://drive.google.com/file/d/1zoX_KqDkyt3OeBnSMsPptafMRUwsfUkP/view?usp=drive_link')
 * // Returns: '1zoX_KqDkyt3OeBnSMsPptafMRUwsfUkP'
 */
export const extractGoogleDriveId = (driveLink: string): string | null => {
  if (!driveLink || typeof driveLink !== "string") {
    return null;
  }

  // Pattern to match Google Drive file URLs
  const patterns = [
    // Standard sharing link: https://drive.google.com/file/d/{id}/view
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    // Open link: https://drive.google.com/open?id={id}
    /[?&]id=([a-zA-Z0-9_-]+)/,
    // Direct link: https://drive.google.com/uc?id={id}
    /\/uc\?id=([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = driveLink.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

/**
 * Validates if a string is a valid Google Drive link
 * @param url - The URL to validate
 * @returns True if it's a valid Google Drive link
 */
export const isGoogleDriveLink = (url: string): boolean => {
  if (!url || typeof url !== "string") {
    return false;
  }

  return url.includes("drive.google.com") && extractGoogleDriveId(url) !== null;
};

/**
 * Converts a Google Drive share link to a direct download link
 * @param driveLink - The Google Drive share URL
 * @returns Direct download URL or null if invalid
 */
export const convertToDirectDownloadLink = (
  driveLink: string
): string | null => {
  const fileId = extractGoogleDriveId(driveLink);

  if (!fileId) {
    return null;
  }

  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

/**
 * Converts a Google Drive share link to an embeddable preview link
 * @param driveLink - The Google Drive share URL
 * @returns Preview URL or null if invalid
 */
export const convertToPreviewLink = (driveLink: string): string | null => {
  const fileId = extractGoogleDriveId(driveLink);

  if (!fileId) {
    return null;
  }

  return `https://drive.google.com/file/d/${fileId}/preview`;
};
