// Upload file to Hostinger
const UPLOAD_API_URL = process.env.NEXT_PUBLIC_UPLOAD_API_URL || 'https://yourdomain.com/api/upload.php'
const UPLOAD_SECRET_KEY = process.env.UPLOAD_SECRET_KEY || ''

export async function uploadToHostinger(
  file: File,
  folder: 'categories' | 'designs',
  filename?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)
    if (filename) {
      formData.append('filename', filename)
    }

    const response = await fetch(UPLOAD_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${UPLOAD_SECRET_KEY}`,
      },
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.error || 'Upload failed' }
    }

    return { success: true, url: data.url }
  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, error: 'Network error' }
  }
}
