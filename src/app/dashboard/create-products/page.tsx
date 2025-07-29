"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  DollarSign,
  Tag,
  FileText,
  Image as ImageIcon,
  Save,
  Eye,
  Loader2,
  CloudUpload,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  useGetCategoriesQuery,
  useCreateProductMutation,
  useUploadImageMutation,
} from "@/lib/service/product/productApi";

interface CreateProductForm {
  title: string;
  price: number | "";
  description: string;
  categoryId: number | "";
  images: string[];
}

interface ImageUploadItem {
  url: string;
  isUploading: boolean;
  uploadError?: string;
}

const CreateProductPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateProductForm>({
    title: "",
    price: "",
    description: "",
    categoryId: "",
    images: [""],
  });

  const [imageUploadItems, setImageUploadItems] = useState<ImageUploadItem[]>([
    { url: "", isUploading: false },
  ]);

  const [errors, setErrors] = useState<{
    title?: string;
    price?: string;
    description?: string;
    categoryId?: string;
    images?: string;
  }>({});

  // RTK Query hooks
  const {
    data: categories,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useGetCategoriesQuery();

   console.log("Categories data:", categories);
  console.log("Available category IDs:", categories?.map(cat => cat.id));
  const [
    createProduct,
    { isLoading: isCreating, error: createError, isSuccess },
  ] = useCreateProductMutation();

  const [uploadImage] = useUploadImageMutation();

  // Sync imageUploadItems with formData.images
  useEffect(() => {
    const syncedImages = imageUploadItems.map((item) => item.url);
    setFormData((prev) => ({
      ...prev,
      images: syncedImages,
    }));
  }, [imageUploadItems]);

  // FIXED: Complete the handleFileUpload function with proper URL extraction
  const handleFileUpload = async (file: File, index: number) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a valid image file (JPEG, PNG, GIF, WebP)");
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("Image size must be less than 5MB");
      return;
    }

    // Update upload state
    setImageUploadItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, isUploading: true, uploadError: undefined }
          : item
      )
    );

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("Uploading file:", file.name);
      const result = await uploadImage(formData).unwrap();
      console.log("Upload result:", result);

      // FIXED: Complete the URL extraction with ALL possible fallbacks
      const uploadedUrl =
        result.location ||
        result.url ||
        result.secure_url ||
        result.link ||
        result.data?.location ||
        result.data?.url ||
        result.data?.secure_url ||
        result.originalname ||
        result.filename ||
        (typeof result === "string" ? result : null);

      console.log("Extracted URL:", uploadedUrl);
      console.log("Result object keys:", Object.keys(result));
      console.log(
        "URL validation result:",
        uploadedUrl ? isValidImageUrl(uploadedUrl) : false
      );

      if (!uploadedUrl) {
        console.error("No URL found in upload response:", result);
        throw new Error(
          `No URL returned from upload. Response: ${JSON.stringify(result)}`
        );
      }

      // Update the specific upload item
      setImageUploadItems((prev) =>
        prev.map((item, i) =>
          i === index ? { url: uploadedUrl, isUploading: false } : item
        )
      );

      console.log("Image uploaded successfully:", uploadedUrl);
    } catch (error: any) {
      console.error("Upload failed:", error);

      setImageUploadItems((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
                ...item,
                isUploading: false,
                uploadError:
                  error?.data?.message || error?.message || "Upload failed",
              }
            : item
        )
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: any = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Product title is required";
    }

    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Product description is required";
    }

    if (!formData.categoryId || Number(formData.categoryId) === 0) {
      newErrors.categoryId = "Please select a category";
    } else {
      // Validate that the selected category exists in the available categories
      const selectedCategoryExists = categories?.find(
        (cat) => cat.id === Number(formData.categoryId)
      );
      if (!selectedCategoryExists) {
        newErrors.categoryId = `Category ID ${formData.categoryId} not found. Please select a valid category.`;
      }
    }

    // Check if at least one image URL exists and is valid
    const validImages = formData.images.filter(
      (img) => img && img.trim() !== "" && isValidImageUrl(img)
    );
    if (validImages.length === 0) {
      newErrors.images = "At least one valid image is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      console.log("Validation errors:", newErrors);
      return;
    }

    try {
      // Validate that the category exists before creating the product
      const selectedCategory = categories?.find(
        (cat) => cat.id === Number(formData.categoryId)
      );

      let finalCategoryId = Number(formData.categoryId);

      if (!selectedCategory && categories && categories.length > 0) {
        // Fallback to first available category
        const fallbackCategory = categories[0];
        console.warn(
          `Category ID ${formData.categoryId} not found. Using fallback category: ${fallbackCategory.name} (ID: ${fallbackCategory.id})`
        );
        finalCategoryId = fallbackCategory.id;
      }

      const productData = {
        title: formData.title.trim(),
        price: Number(formData.price),
        description: formData.description.trim(),
        categoryId: finalCategoryId,
        images: validImages,
      };

      console.log("Creating product with data:", productData);
      console.log("Available categories:", categories?.map(cat => ({ id: cat.id, name: cat.name })));

      const result = await createProduct(productData).unwrap();

      console.log("Product created successfully:", result);

      alert(
        `Product "${result.title}" created successfully with ID: ${result.id}`
      );

      // Reset form
      setFormData({
        title: "",
        price: "",
        description: "",
        categoryId: "",
        images: [""],
      });

      setImageUploadItems([{ url: "", isUploading: false }]);

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error creating product:", error);
      
      // Enhanced error handling
      let errorMessage = "Failed to create product";
      
      if (error?.data?.message?.includes("Category")) {
        errorMessage = `Category error: ${error.data.message}. Please try selecting a different category.`;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      // Log available categories for debugging
      console.log("Available categories for debugging:", categories);
      
      alert(`Error creating product: ${errorMessage}`);
    }
  };

  const handleInputChange = (
    field: keyof CreateProductForm,
    value: string | number
  ) => {
    let processedValue: string | number = value;
    
    // Convert numeric fields to numbers when they have valid values
    if (field === "price" && typeof value === "string" && value.trim() !== "") {
      const numValue = parseFloat(value);
      processedValue = isNaN(numValue) ? "" : numValue;
    } else if (field === "categoryId" && typeof value === "string" && value.trim() !== "") {
      const numValue = parseInt(value);
      processedValue = isNaN(numValue) ? "" : numValue;
    }
    
    setFormData((prev) => ({
      ...prev,
      [field]: processedValue,
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleImageUrlChange = (index: number, value: string) => {
    // Update both imageUploadItems and clear any upload errors
    setImageUploadItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, url: value, uploadError: undefined } : item
      )
    );

    if (errors.images && value.trim()) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }
  };

  const addImageField = () => {
    setImageUploadItems((prev) => [...prev, { url: "", isUploading: false }]);
  };

  const removeImageField = (index: number) => {
    if (imageUploadItems.length === 1) return;

    setImageUploadItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Enhanced image validation function
  const isValidImageUrl = (url: string) => {
    if (!url || !url.trim()) return false;

    try {
      const urlObj = new URL(url);

      // Check if it's a valid image URL
      const isImageExtension = url.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i);
      const isKnownImageHost =
        url.includes("placehold") ||
        url.includes("placeholder") ||
        url.includes("unsplash") ||
        url.includes("api.escuelajs.co") ||
        url.includes("imgur") ||
        url.includes("cloudinary") ||
        url.startsWith("data:image/") ||
        url.includes("picsum.photos") ||
        url.includes("images.unsplash.com") ||
        url.includes("via.placeholder.com");

      const isValid = isImageExtension || isKnownImageHost;
      console.log(`URL validation for "${url}": ${isValid}`);
      return isValid;
    } catch (error) {
      console.log(`URL validation failed for "${url}":`, error);
      return false;
    }
  };

  const getCurrentCategoryName = () => {
    if (!categories || !Array.isArray(categories)) return "Category";
    const category = categories.find(
      (cat) => cat.id === Number(formData.categoryId)
    );
    const categoryName = category?.name || "Category";
    console.log("Current category name:", categoryName);
    return categoryName;
  };

  // Loading state
  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (categoriesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-red-500 mb-4">
            <X className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Error Loading Categories</h3>
            <p className="text-gray-600 mt-2">
              Unable to load categories. Please try again later.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Add this test function after the other handlers
  const handleTestImage = (index: number) => {
    const testUrls = [
      "https://api.escuelajs.co/api/v1/files/c1e9.jpeg",
      "https://picsum.photos/400/400",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      "https://via.placeholder.com/400x400/0066CC/FFFFFF?text=Test+Product",
    ];

    const randomUrl = testUrls[Math.floor(Math.random() * testUrls.length)];
    handleImageUrlChange(index, randomUrl);
  };

// const {data : ca } = useGetCategoriesQuery();

// console.log("Categories data:", ca);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back to Dashboard
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Create New Product
              </h1>
              <p className="text-gray-600 mt-2">
                Add a new product with image upload
              </p>
            </div>
          </div>

          {/* RTK Query Status */}
          {createError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">
                Error: {JSON.stringify(createError)}
              </p>
            </div>
          )}

          {/* Debug: Available Categories */}
          {categories && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">
                🔍 Available Categories (for debugging):
              </h4>
              <div className="text-xs text-blue-700">
                {categories.map((cat) => (
                  <span key={cat.id} className="inline-block mr-3 mb-1">
                    ID: {cat.id} - {cat.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {isSuccess && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">
                Product created successfully!
              </p>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-lg p-6 space-y-6"
            >
              {/* Product Title */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 mr-2" />
                  Product Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter product title..."
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Price and Category Row */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Price *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 mr-2" />
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      handleInputChange("categoryId", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.categoryId ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories &&
                      Array.isArray(categories) &&
                      categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name} (ID: {category.id})
                        </option>
                      ))}
                  </select>
                  
                  {/* Quick category selection */}
                  {categories && categories.length > 0 && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          const firstCategory = categories[0];
                          handleInputChange("categoryId", firstCategory.id.toString());
                        }}
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        🎯 Use First Available: {categories[0].name}
                      </button>
                    </div>
                  )}
                  {errors.categoryId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.categoryId}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Description *
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter product description..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Images with Upload */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Product Images *
                </label>
                <div className="mb-3 text-sm text-gray-500">
                  Upload images directly or paste URLs. Supported formats: JPEG,
                  PNG, GIF, WebP (max 5MB)
                </div>

                <div className="space-y-4">
                  {imageUploadItems.map((item, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium text-gray-600">
                          Image {index + 1}
                        </span>
                        {imageUploadItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImageField(index)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        {/* Add Test Image Button */}
                        <button
                          type="button"
                          onClick={() => handleTestImage(index)}
                          className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                        >
                          🎲 Test URL
                        </button>
                      </div>

                      {/* File Upload */}
                      <div className="mb-3">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {item.isUploading ? (
                              <>
                                <Loader2 className="w-8 h-8 mb-2 text-blue-600 animate-spin" />
                                <p className="text-sm text-blue-600">
                                  Uploading...
                                </p>
                              </>
                            ) : (
                              <>
                                <CloudUpload className="w-8 h-8 mb-2 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">
                                    Click to upload
                                  </span>{" "}
                                  or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG, GIF (MAX. 5MB)
                                </p>
                              </>
                            )}
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(file, index);
                              }
                            }}
                            disabled={item.isUploading}
                          />
                        </label>
                      </div>

                      {/* URL Input with better styling */}
                      <div className="mb-3">
                        <label className="text-xs text-gray-500 font-medium mb-1 block">
                          Or paste image URL:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={item.url}
                            onChange={(e) =>
                              handleImageUrlChange(index, e.target.value)
                            }
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="https://example.com/image.jpg"
                            disabled={item.isUploading}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (item.url) {
                                // Test if URL works by triggering validation
                                console.log("Testing URL:", item.url);
                                console.log(
                                  "Is valid:",
                                  isValidImageUrl(item.url)
                                );
                              }
                            }}
                            className="px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                            disabled={!item.url || item.isUploading}
                          >
                            🔍 Test
                          </button>
                        </div>
                      </div>

                      {/* Common Test URLs */}
                      <div className="mb-3">
                        <label className="text-xs text-gray-500 font-medium mb-1 block">
                          Quick test URLs:
                        </label>
                        <div className="flex gap-1 flex-wrap">
                          {[
                            {
                              name: "API",
                              url: "https://api.escuelajs.co/api/v1/files/c1e9.jpeg",
                            },
                            {
                              name: "Picsum",
                              url: "https://picsum.photos/400/400",
                            },
                            {
                              name: "Unsplash",
                              url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
                            },
                            {
                              name: "Placeholder",
                              url: "https://via.placeholder.com/400x400/0066CC/FFFFFF?text=Product",
                            },
                          ].map((testUrl) => (
                            <button
                              key={testUrl.name}
                              type="button"
                              onClick={() =>
                                handleImageUrlChange(index, testUrl.url)
                              }
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                              disabled={item.isUploading}
                            >
                              {testUrl.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Enhanced Debug Info */}
                      <div className="mb-2 p-3 bg-gray-50 rounded-lg text-xs border">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <strong>URL:</strong>{" "}
                            {item.url
                              ? `${item.url.substring(0, 30)}...`
                              : "None"}
                          </div>
                          <div>
                            <strong>Valid:</strong>{" "}
                            {item.url
                              ? isValidImageUrl(item.url)
                                ? "✅ Yes"
                                : "❌ No"
                              : "N/A"}
                          </div>
                          <div>
                            <strong>Length:</strong> {item.url?.length || 0}{" "}
                            chars
                          </div>
                          <div>
                            <strong>Status:</strong>{" "}
                            {item.isUploading
                              ? "🔄 Uploading"
                              : item.uploadError
                              ? "❌ Error"
                              : item.url
                              ? "✅ Ready"
                              : "⭕ Empty"}
                          </div>
                        </div>

                        {/* Show full URL on hover */}
                        {item.url && (
                          <div className="mt-2 p-2 bg-white rounded border text-xs break-all">
                            <strong>Full URL:</strong> {item.url}
                          </div>
                        )}
                      </div>

                      {/* Upload Error */}
                      {item.uploadError && (
                        <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
                          <strong className="text-red-600">
                            ❌ Upload Error:
                          </strong>
                          <div className="text-red-600 mt-1">
                            {item.uploadError}
                          </div>
                        </div>
                      )}

                      {/* Enhanced Image Preview */}
                      {item.url && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xs text-gray-500 font-medium">
                              🖼️ Preview:{" "}
                              {isValidImageUrl(item.url)
                                ? "✅ Valid URL"
                                : "❌ Invalid URL"}
                            </div>
                            {item.url && (
                              <button
                                type="button"
                                onClick={() => window.open(item.url, "_blank")}
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                🔗 Open in new tab
                              </button>
                            )}
                          </div>

                          <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                            {isValidImageUrl(item.url) ? (
                              <Image
                                src={item.url}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="object-cover transition-opacity duration-200"
                                unoptimized
                                crossOrigin="anonymous"
                                onError={(e) => {
                                  console.error(
                                    "❌ Image load error for:",
                                    item.url
                                  );
                                  // You could set an error state here if needed
                                }}
                                onLoad={() => {
                                  console.log(
                                    "✅ Image loaded successfully:",
                                    item.url
                                  );
                                }}
                              />
                            ) : (
                              <div className="h-full flex items-center justify-center">
                                <div className="text-center">
                                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                  <p className="text-sm text-gray-500">
                                    {item.url
                                      ? "Invalid image URL format"
                                      : "No image"}
                                  </p>
                                  {item.url && (
                                    <p className="text-xs text-gray-400 mt-1">
                                      URL might not be a direct image link
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addImageField}
                    className="w-full inline-flex items-center justify-center px-4 py-3 text-blue-600 border-2 border-blue-600 border-dashed rounded-xl hover:bg-blue-50 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Image
                  </button>
                </div>

                {errors.images && (
                  <p className="mt-1 text-sm text-red-600">
                    ❌ {errors.images}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={
                    isCreating ||
                    imageUploadItems.some((item) => item.isUploading)
                  }
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isCreating ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Save className="w-5 h-5 mr-2" />
                  )}
                  {isCreating ? "Creating Product..." : "Create Product"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Enhanced Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🔍 Live Preview
              </h3>

              {/* Debug Info */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg text-xs border">
                <div className="font-semibold mb-2">📊 Debug Info:</div>
                <div>
                  <strong>Form Images:</strong> {formData.images.length}
                </div>
                <div>
                  <strong>Upload Items:</strong> {imageUploadItems.length}
                </div>
                <div>
                  <strong>First URL:</strong> {formData.images[0] || "None"}
                </div>
                <div>
                  <strong>Valid URL:</strong>{" "}
                  {formData.images[0]
                    ? isValidImageUrl(formData.images[0])
                      ? "✅ Yes"
                      : "❌ No"
                    : "N/A"}
                </div>
              </div>

              {/* Upload Status */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg text-xs border border-blue-200">
                <div className="font-semibold mb-2">📤 Upload Status:</div>
                {imageUploadItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center mb-1"
                  >
                    <span>Image {index + 1}:</span>
                    <span
                      className={`font-medium ${
                        item.isUploading
                          ? "text-blue-600"
                          : item.uploadError
                          ? "text-red-600"
                          : item.url
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      {item.isUploading
                        ? "🔄 Uploading..."
                        : item.uploadError
                        ? "❌ Error"
                        : item.url
                        ? "✅ Ready"
                        : "⭕ Empty"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Product Card Preview */}
              <div className="border border-black rounded-xl overflow-hidden shadow-sm">
                {/* Image */}
                <div className="relative h-48 bg-gray-100">
                  {formData.images[0] && isValidImageUrl(formData.images[0]) ? (
                    <>
                      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-10">
                        🔍 Preview
                      </div>
                      <Image
                        src={formData.images[0]}
                        alt={formData.title || "Product preview"}
                        fill
                        className="object-cover"
                        unoptimized
                        crossOrigin="anonymous"
                        onError={(e) => {
                          console.error("❌ Preview image error:", e);
                        }}
                        onLoad={() => {
                          console.log(
                            "✅ Preview image loaded:",
                            formData.images[0]
                          );
                        }}
                      />
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No valid image</p>
                        {formData.images[0] && (
                          <p className="text-xs text-red-500 mt-1">
                            ❌ Invalid URL format
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {getCurrentCategoryName()}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {formData.title || "Product Title"}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {formData.description ||
                      "Product description will appear here..."}
                  </p>
                  <div className="text-xl font-bold text-gray-900">
                    $
                    {formData.price
                      ? Number(formData.price).toFixed(2)
                      : "0.00"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProductPage;
