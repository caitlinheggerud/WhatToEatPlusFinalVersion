import fetch from 'node-fetch';
import FormData from 'form-data';

const DEEPAI_API_KEY = process.env.DEEPAI_API_KEY;
const BASE_URL = 'https://api.deepai.org/api';

if (!DEEPAI_API_KEY) {
  console.error('DEEPAI_API_KEY environment variable is not set');
}

/**
 * Enhance an image using DeepAI's image colorization
 * @param imageUrl URL of the image to enhance
 * @returns URL of the enhanced image
 */
export async function enhanceImage(imageUrl: string): Promise<string> {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('image', imageUrl);
    
    // Call DeepAI API to enhance the image
    const response = await fetch(`${BASE_URL}/colorizer`, {
      method: 'POST',
      body: formData,
      headers: {
        'api-key': DEEPAI_API_KEY as string,
      }
    });
    
    if (!response.ok) {
      throw new Error(`DeepAI API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Return the URL of the enhanced image
    return data.output_url;
  } catch (error) {
    console.error('Error enhancing image with DeepAI:', error);
    // Return the original image URL if enhancement fails
    return imageUrl;
  }
}

/**
 * Enhance an image using DeepAI's image super resolution
 * @param imageUrl URL of the image to enhance
 * @returns URL of the enhanced image
 */
export async function enhanceImageResolution(imageUrl: string): Promise<string> {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('image', imageUrl);
    
    // Call DeepAI API to enhance the image resolution
    const response = await fetch(`${BASE_URL}/torch-srgan`, {
      method: 'POST',
      body: formData,
      headers: {
        'api-key': DEEPAI_API_KEY as string,
      }
    });
    
    if (!response.ok) {
      throw new Error(`DeepAI API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Return the URL of the enhanced image
    return data.output_url;
  } catch (error) {
    console.error('Error enhancing image resolution with DeepAI:', error);
    // Return the original image URL if enhancement fails
    return imageUrl;
  }
}
