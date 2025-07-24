import React, { useState } from 'react';
import { uploadImage } from '../../services/adminService';
import {
  PlusIcon,
  TrashIcon,
  PhotoIcon,
  SwatchIcon
} from '@heroicons/react/24/outline';

const ColorVariantsManager = ({ colorVariants, onChange }) => {
  const [showColorPicker, setShowColorPicker] = useState(null);

  // Predefined colors with hex values
  const predefinedColors = [
    { name: 'Red', hex: '#FF0000' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Green', hex: '#008000' },
    { name: 'Yellow', hex: '#FFFF00' },
    { name: 'Orange', hex: '#FFA500' },
    { name: 'Purple', hex: '#800080' },
    { name: 'Pink', hex: '#FFC0CB' },
    { name: 'Brown', hex: '#A52A2A' },
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Gray', hex: '#808080' },
    { name: 'Navy', hex: '#000080' },
    { name: 'Tan', hex: '#D2B48C' },
    { name: 'Beige', hex: '#F5F5DC' },
    { name: 'Maroon', hex: '#800000' },
    { name: 'Olive', hex: '#808000' },
    { name: 'Lime', hex: '#00FF00' },
    { name: 'Aqua', hex: '#00FFFF' },
    { name: 'Teal', hex: '#008080' },
    { name: 'Silver', hex: '#C0C0C0' },
    { name: 'Gold', hex: '#FFD700' },
    { name: 'Rose Gold', hex: '#E8B4B8' },
    { name: 'Coral', hex: '#FF7F50' },
    { name: 'Mint', hex: '#98FB98' }
  ];

  const addColorVariant = () => {
    const newVariant = {
      name: '',
      hex: '#000000',
      images: [''],
      stock: 0
    };
    onChange([...colorVariants, newVariant]);
  };

  const removeColorVariant = (index) => {
    const updated = colorVariants.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateColorVariant = (index, field, value) => {
    const updated = colorVariants.map((variant, i) => 
      i === index ? { ...variant, [field]: value } : variant
    );
    onChange(updated);
  };

  const addImageToVariant = (variantIndex) => {
    const updated = colorVariants.map((variant, i) => 
      i === variantIndex 
        ? { ...variant, images: [...variant.images, ''] }
        : variant
    );
    onChange(updated);
  };

  const removeImageFromVariant = (variantIndex, imageIndex) => {
    const updated = colorVariants.map((variant, i) => 
      i === variantIndex 
        ? { ...variant, images: variant.images.filter((_, imgI) => imgI !== imageIndex) }
        : variant
    );
    onChange(updated);
  };

  const updateVariantImage = async (variantIndex, imageIndex, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await uploadImage(formData);
      const imageUrl = response.data.filePath;

      const updated = colorVariants.map((variant, i) => 
        i === variantIndex 
          ? { 
              ...variant, 
              images: variant.images.map((img, imgI) => imgI === imageIndex ? imageUrl : img)
            }
          : variant
      );
      onChange(updated);
    } catch (error) {
      console.error('Error uploading color variant image:', error);
      alert('Error uploading color variant image. Please try again.');
    }
  };

  const selectPredefinedColor = (variantIndex, color) => {
    updateColorVariant(variantIndex, 'name', color.name);
    updateColorVariant(variantIndex, 'hex', color.hex);
    setShowColorPicker(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Color Variants</h3>
        <button
          type="button"
          onClick={addColorVariant}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          Add Color
        </button>
      </div>

      {colorVariants.length === 0 ? (
        <div className="text-center py-8 text-indigo-200/60">
          <SwatchIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No color variants added yet</p>
          <p className="text-sm">Add color variants to enable color-specific images and stock</p>
        </div>
      ) : (
        <div className="space-y-6">
          {colorVariants.map((variant, variantIndex) => (
            <div key={variantIndex} className="bg-gray-800/30 rounded-lg p-4 border border-indigo-500/20">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-medium">Color Variant {variantIndex + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeColorVariant(variantIndex)}
                  className="text-rose-400 hover:text-rose-300 transition-colors"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Color Name */}
                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-1">
                    Color Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={variant.name}
                      onChange={(e) => updateColorVariant(variantIndex, 'name', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-indigo-500/20 rounded-lg text-white placeholder-indigo-200/40 focus:outline-none focus:border-indigo-500"
                      placeholder="Enter color name"
                    />
                    <button
                      type="button"
                      onClick={() => setShowColorPicker(showColorPicker === variantIndex ? null : variantIndex)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-indigo-400 hover:text-indigo-300"
                    >
                      <SwatchIcon className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* Predefined Colors Dropdown */}
                  {showColorPicker === variantIndex && (
                    <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-indigo-500/20 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      <div className="p-2">
                        <p className="text-xs text-indigo-200/60 mb-2">Select a predefined color:</p>
                        <div className="grid grid-cols-4 gap-2">
                          {predefinedColors.map((color) => (
                            <button
                              key={color.name}
                              type="button"
                              onClick={() => selectPredefinedColor(variantIndex, color)}
                              className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-left text-sm text-white"
                            >
                              <div 
                                className="w-4 h-4 rounded-full border border-gray-600"
                                style={{ backgroundColor: color.hex }}
                              />
                              <span className="truncate">{color.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Color Hex */}
                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-1">
                    Color Code (Hex)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={variant.hex}
                      onChange={(e) => updateColorVariant(variantIndex, 'hex', e.target.value)}
                      className="flex-1 px-4 py-2 bg-gray-800/50 border border-indigo-500/20 rounded-lg text-white placeholder-indigo-200/40 focus:outline-none focus:border-indigo-500"
                      placeholder="#000000"
                    />
                    <div 
                      className="w-10 h-10 rounded border border-gray-600"
                      style={{ backgroundColor: variant.hex }}
                    />
                  </div>
                </div>
              </div>

              {/* Stock for this color */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-indigo-200 mb-1">
                  Stock for {variant.name || 'this color'}
                </label>
                <input
                  type="number"
                  value={variant.stock}
                  onChange={(e) => updateColorVariant(variantIndex, 'stock', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-indigo-500/20 rounded-lg text-white placeholder-indigo-200/40 focus:outline-none focus:border-indigo-500"
                  placeholder="Enter stock quantity"
                  min="0"
                />
              </div>

              {/* Images for this color */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-indigo-200">
                    Images for {variant.name || 'this color'}
                  </label>
                  <button
                    type="button"
                    onClick={() => addImageToVariant(variantIndex)}
                    className="flex items-center gap-1 px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded text-sm hover:bg-indigo-500/30 transition-colors"
                  >
                    <PhotoIcon className="h-4 w-4" />
                    Add Image
                  </button>
                </div>

                <div className="space-y-2">
                  {variant.images.map((image, imageIndex) => (
                    <div key={imageIndex} className="flex gap-2">
                      <input
                        type="file"
                        onChange={(e) => updateVariantImage(variantIndex, imageIndex, e.target.files[0])}
                        className="flex-1 px-3 py-2 bg-gray-800/50 border border-indigo-500/20 rounded text-white placeholder-indigo-200/40 focus:outline-none focus:border-indigo-500 text-sm"
                      />
                      {variant.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageFromVariant(variantIndex, imageIndex)}
                          className="px-2 py-2 text-rose-400 hover:text-rose-300 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Image Preview */}
                {variant.images[0] && (
                  <div className="mt-2">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}${variant.images[0]}`}
                      alt={`${variant.name} preview`}
                      className="w-20 h-20 object-cover rounded border border-gray-600"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorVariantsManager;