// Image utility functions for GoLoanMe
// Handles image compression and storage optimization

export interface ImageData {
  id: string;
  name: string;
  dataUrl: string;
  size: number;
  type: string;
  compressed: boolean;
}

export const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      
      console.log('🖼️ Image Compressed:', {
        originalSize: file.size,
        compressedSize: compressedDataUrl.length,
        compressionRatio: (1 - compressedDataUrl.length / file.size) * 100,
        dimensions: `${width}x${height}`
      });
      
      resolve(compressedDataUrl);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const processImages = async (files: File[]): Promise<ImageData[]> => {
  const processedImages: ImageData[] = [];
  
  console.log('🔄 Processing images:', {
    count: files.length,
    files: files.map(f => ({ name: f.name, size: f.size, type: f.type }))
  });

  for (const file of files) {
    try {
      // Compress the image
      const compressedDataUrl = await compressImage(file);
      
      const imageData: ImageData = {
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        dataUrl: compressedDataUrl,
        size: compressedDataUrl.length,
        type: file.type,
        compressed: true
      };

      processedImages.push(imageData);
      
      console.log('✅ Image processed:', {
        id: imageData.id,
        name: imageData.name,
        originalSize: file.size,
        compressedSize: imageData.size,
        compressionRatio: ((1 - imageData.size / file.size) * 100).toFixed(1) + '%'
      });
      
    } catch (error) {
      console.error('❌ Error processing image:', file.name, error);
    }
  }

  return processedImages;
};

export const validateImageData = (imageUrl: string): boolean => {
  if (!imageUrl) return false;
  
  // Check if it's a data URL (user uploaded images)
  if (imageUrl.startsWith('data:image/')) {
    if (imageUrl.length < 100) return false; // Too short to be a valid image
    return true;
  }
  
  // Check if it's a file path (demo images)
  if (imageUrl.startsWith('/images/') || imageUrl.startsWith('./images/')) {
    return true;
  }
  
  // Check if it's a full URL
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return true;
  }
  
  return false;
};

export const getImageInfo = (imageUrl: string) => {
  if (!validateImageData(imageUrl)) {
    return {
      valid: false,
      reason: 'Invalid image URL'
    };
  }

  // Handle data URLs (user uploaded images)
  if (imageUrl.startsWith('data:image/')) {
    const [header, data] = imageUrl.split(',');
    const mimeType = header.match(/data:([^;]+)/)?.[1];
    
    return {
      valid: true,
      type: 'dataUrl',
      mimeType,
      dataLength: data.length,
      headerLength: header.length,
      totalLength: imageUrl.length,
      estimatedSize: Math.round(data.length * 0.75) // Base64 is ~33% larger than binary
    };
  }
  
  // Handle file paths (demo images)
  if (imageUrl.startsWith('/images/') || imageUrl.startsWith('./images/')) {
    return {
      valid: true,
      type: 'filePath',
      path: imageUrl,
      filename: imageUrl.split('/').pop()
    };
  }
  
  // Handle full URLs
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return {
      valid: true,
      type: 'url',
      url: imageUrl
    };
  }
  
  return {
    valid: false,
    reason: 'Unknown image format'
  };
};
