'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getLocalData, setLocalData } from '@/lib/local-storage';
import { processImages, validateImageData, getImageInfo } from '@/lib/image-utils';

export default function CreatePostPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    goal: '',
    acceptContracts: false
  });
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  // Cleanup image preview URLs on unmount
  useEffect(() => {
    return () => {
      imagePreview.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreview]);

  // Enhanced console logging
  const logUserActivity = (action: string, metadata: any) => {
    const userMetadata = {
      userId: 'demo_user_123',
      handle: 'demo_user',
      trustScore: 85,
      verificationStatus: 'verified',
      accountAge: '2 years',
      totalPledges: 12,
      totalDonated: 2500,
      reputation: 'excellent',
      riskLevel: 'low',
      timestamp: new Date().toISOString(),
      action,
      metadata
    };
    
    console.log('🔍 GoLoanMe User Activity:', userMetadata);
    console.log('📊 Trust Score Analysis:', {
      score: userMetadata.trustScore,
      level: userMetadata.trustScore >= 80 ? 'HIGH' : userMetadata.trustScore >= 60 ? 'MEDIUM' : 'LOW',
      factors: {
        verificationStatus: userMetadata.verificationStatus,
        accountAge: userMetadata.accountAge,
        totalPledges: userMetadata.totalPledges,
        reputation: userMetadata.reputation
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    logUserActivity('POST_CREATION_STARTED', { formData });

    try {
      // Convert images to data URLs for storage
      const imageDataUrls = await convertImagesToDataUrls(selectedImages);
      
      // Create new post
      const newPost = {
        id: `post_${Date.now()}`,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        goal: parseInt(formData.goal),
        totalRaised: 0,
        pledgeCount: 0,
        commentCount: 0,
        status: 'OPEN',
        acceptContracts: formData.acceptContracts,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: {
          id: 'demo_user_123',
          handle: 'demo_user',
          avatarUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=DU',
          verified: true,
        },
        images: imageDataUrls,
        links: [],
        pledges: [],
        _count: { pledges: 0, comments: 0 }
      };

      // Add to local storage
      const localData = getLocalData();
      localData.posts.unshift(newPost);
      setLocalData(localData);

      logUserActivity('POST_CREATED', {
        postId: newPost.id,
        title: newPost.title,
        category: newPost.category,
        goal: newPost.goal,
        acceptContracts: newPost.acceptContracts,
        imageCount: imageDataUrls.length
      });

      console.log('📝 New Post Created:', {
        id: newPost.id,
        title: newPost.title,
        category: newPost.category,
        goal: newPost.goal,
        acceptContracts: newPost.acceptContracts,
        imageCount: imageDataUrls.length,
        images: imageDataUrls.map((url, index) => ({
          index,
          size: url.length,
          type: url.split(',')[0]
        })),
        timestamp: newPost.createdAt
      });

      alert('Post created successfully!');
      router.push('/explore');
      
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        alert(`${file.name} is not a valid image file.`);
        return false;
      }
      if (!isValidSize) {
        alert(`${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setSelectedImages(prev => [...prev, ...validFiles]);
      
      // Create preview URLs
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setImagePreview(prev => [...prev, ...newPreviews]);
      
      logUserActivity('IMAGES_SELECTED', {
        fileCount: validFiles.length,
        fileNames: validFiles.map(f => f.name),
        totalSize: validFiles.reduce((sum, f) => sum + f.size, 0)
      });
      
      console.log('📸 Images Selected:', {
        count: validFiles.length,
        files: validFiles.map(f => ({ name: f.name, size: f.size, type: f.type }))
      });
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
    
    logUserActivity('IMAGE_REMOVED', { index });
    console.log('🗑️ Image Removed:', { index });
  };

  const convertImagesToDataUrls = async (files: File[]): Promise<string[]> => {
    console.log('🔄 Processing images with compression:', {
      fileCount: files.length,
      files: files.map(f => ({ name: f.name, size: f.size, type: f.type }))
    });
    
    try {
      const processedImages = await processImages(files);
      const dataUrls = processedImages.map(img => img.dataUrl);
      
      console.log('✅ All images processed:', {
        count: dataUrls.length,
        totalSize: dataUrls.reduce((sum, url) => sum + url.length, 0),
        images: processedImages.map(img => ({
          name: img.name,
          size: img.size,
          compressed: img.compressed
        }))
      });
      
      return dataUrls;
    } catch (error) {
      console.error('❌ Error processing images:', error);
      // Fallback to original method if compression fails
      const dataUrls: string[] = [];
      
      for (const file of files) {
        const reader = new FileReader();
        const promise = new Promise<string>((resolve, reject) => {
          reader.onload = (e) => {
            const result = e.target?.result as string;
            console.log('📸 File converted (fallback):', {
              name: file.name,
              size: file.size,
              dataUrlLength: result.length,
              isValid: validateImageData(result)
            });
            resolve(result);
          };
          reader.onerror = (e) => {
            console.error('❌ FileReader error:', e);
            reject(e);
          };
        });
        reader.readAsDataURL(file);
        dataUrls.push(await promise);
      }
      
      return dataUrls;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Create Funding Request
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What do you need funding for?"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell your story. What's your situation? How will the funds be used?"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  <option value="Medical">Medical</option>
                  <option value="Education">Education</option>
                  <option value="Business">Business</option>
                  <option value="Personal">Personal</option>
                  <option value="Community">Community</option>
                  <option value="Creative">Creative</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Goal Amount */}
              <div>
                <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">
                  Funding Goal (GLM) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="goal"
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Terms */}
              <div>
                <label htmlFor="terms" className="block text-sm font-medium text-gray-700 mb-2">
                  Repayment Terms *
                </label>
                <textarea
                  id="terms"
                  name="terms"
                  rows={3}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your repayment terms (e.g., '12 month repayment, 5% interest' or 'Gift-based, no repayment required')"
                />
              </div>

              {/* Accept Contracts */}
              <div className="flex items-center">
                <input
                  id="acceptContracts"
                  name="acceptContracts"
                  type="checkbox"
                  checked={formData.acceptContracts}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="acceptContracts" className="ml-2 block text-sm text-gray-900">
                  Accept contract pledges (allows sponsors to attach their own terms)
                </label>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images (Optional)
                </label>
                
                {/* Image Previews */}
                {imagePreview.length > 0 && (
                  <div className="mb-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {imagePreview.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                            {selectedImages[index]?.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="mt-2">
                    <label htmlFor="images" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-500 font-medium">
                        {selectedImages.length > 0 ? 'Add more images' : 'Upload images'}
                      </span>
                      <input 
                        id="images" 
                        name="images" 
                        type="file" 
                        className="sr-only" 
                        multiple 
                        accept="image/*" 
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="text-gray-500 text-sm">or drag and drop</p>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">PNG, JPG, GIF up to 10MB each</p>
                  {selectedImages.length > 0 && (
                    <p className="text-green-600 text-sm mt-2">
                      {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>
              </div>

              {/* Legal Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Important Notice
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        This platform uses simulated currency (GLM credits) for demonstration purposes only. 
                        No real money transactions occur. This is not financial or legal advice.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Save Draft
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium"
                >
                  {loading ? 'Creating...' : 'Create Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
