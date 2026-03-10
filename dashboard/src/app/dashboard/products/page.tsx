'use client';

import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '@/utils/apiConfig';
import toast from 'react-hot-toast';
import { 
  MdAdd, 
  MdEdit, 
  MdDelete, 
  MdImage, 
  MdTitle, 
  MdVisibility, 
  MdRefresh, 
  MdCategory, 
  MdBrandingWatermark,
  MdCloudUpload,
  MdDescription,
  MdDateRange,
  MdPeople,
  MdNumbers
} from 'react-icons/md';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Modal from '@/components/ui/Modal';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

// Types
interface ProductItem {
  _id: string;
  productId: string;
  name: string;
  description: string;
  bannerImage: string;
  images: string[];
  category: { _id: string; name: string } | null;
  subCategory: { _id: string; name: string } | null;
  brand: { _id: string; name: string } | null;
  isActive: boolean;
  variation: Variation[];
  createdBy?: { name: string };
  createdAt?: string;
}

interface Variation {
  _id?: string;
  size: string;
  color: string;
  basePrice: string;
  discountPrice: string;
  stock: string;
}

interface Option {
  id: string;
  name: string;
}

export default function ProductManagement() {
  // Data State
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('');

  // Dropdown Data
  const [categories, setCategories] = useState<Option[]>([]);
  const [subCategories, setSubCategories] = useState<Option[]>([]);
  const [brands, setBrands] = useState<Option[]>([]);

  // Modal Visibility State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Operation State
  const [editingItem, setEditingItem] = useState<ProductItem | null>(null);
  const [detailsItem, setDetailsItem] = useState<ProductItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    subCategory: '',
    brand: '',
    isActive: true,
  });

  const [variations, setVariations] = useState<Variation[]>([
    { size: '', color: '', basePrice: '', discountPrice: '', stock: '' }
  ]);

  // Image State
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  
  // Refs
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // --- Initial Data Loading ---
  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/product`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to fetch products');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDependencies = async () => {
      try {
          const [catRes, brandRes, subCatRes] = await Promise.all([
              fetch(`${API_BASE_URL}/category`),
              fetch(`${API_BASE_URL}/brand`),
              fetch(`${API_BASE_URL}/sub-category`)
          ]);

          if (catRes.ok) {
              const data = await catRes.json();
              setCategories(data.map((item: any) => ({ id: item._id, name: item.name })));
          }
          if (brandRes.ok) {
              const data = await brandRes.json();
              setBrands(data.map((item: any) => ({ id: item._id, name: item.name })));
          }
          if (subCatRes.ok) {
             const data = await subCatRes.json();
             setSubCategories(data.map((item: any) => ({ id: item._id, name: item.name })));
          }
      } catch (error) {
          console.error('Failed to load dependencies');
      }
  };

  useEffect(() => {
    fetchItems();
    fetchDependencies();
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            setUserRole(user.role);
        } catch (e) {
            console.error('Failed to parse user', e);
        }
    }
  }, []);

  // --- Handlers: Modal Open/Close ---

  const handleOpenFormModal = (item?: ProductItem) => {
    if (userRole !== 'admin') return toast.error('Access Denied');
    
    if (item) {
        // Edit Mode
        setEditingItem(item);
        setFormData({
            name: item.name,
            description: item.description,
            category: item.category?._id || '',
            subCategory: item.subCategory?._id || '',
            brand: item.brand?._id || '',
            isActive: item.isActive,
        });

        // Set Variations
        if (item.variation && Array.isArray(item.variation)) {
             setVariations(item.variation.map((v: any) => ({
                size: v.size || '',
                color: v.color || '',
                basePrice: v.basePrice || '',
                discountPrice: v.discountPrice || '',
                stock: v.stock || ''
            })));
        } else {
            setVariations([{ size: '', color: '', basePrice: '', discountPrice: '', stock: '' }]);
        }

        // Set Images
        setBannerPreview(item.bannerImage);
        setGalleryPreviews(item.images || []);
        
        // Reset file inputs
        setBannerImage(null);
        setGalleryImages([]);
    } else {
        // Add Mode
        setEditingItem(null);
        setFormData({
            name: '',
            description: '',
            category: '',
            subCategory: '',
            brand: '',
            isActive: true,
        });
        setVariations([{ size: '', color: '', basePrice: '', discountPrice: '', stock: '' }]);
        setBannerImage(null);
        setBannerPreview('');
        setGalleryImages([]);
        setGalleryPreviews([]);
    }

    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
      setIsFormModalOpen(false);
      setEditingItem(null);
  };

  const handleViewDetails = (item: ProductItem) => {
      setDetailsItem(item);
      setIsDetailsModalOpen(true);
  };

  // --- Handlers: Form Inputs ---

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerImage(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (!editingItem && files.length + galleryImages.length > 5) {
          toast.error('Maximum 5 images allowed');
          return;
      }
      setGalleryImages(files); // Replace strategy for simplicity/consistency
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setGalleryPreviews(newPreviews);
    }
  };

  const handleVariationChange = (index: number, field: keyof Variation, value: string) => {
      const newVariations = [...variations];
      newVariations[index] = { ...newVariations[index], [field]: value };
      setVariations(newVariations);
  };

  const addVariation = () => {
      setVariations([...variations, { size: '', color: '', basePrice: '', discountPrice: '', stock: '' }]);
  };

  const removeVariation = (index: number) => {
      if (variations.length > 1) {
          setVariations(variations.filter((_, i) => i !== index));
      }
  };

  // --- Handlers: Submit & Delete ---

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const token = localStorage.getItem('token');
      if (!token) return toast.error('Not authenticated');

      // Validation
      if (!formData.name || !formData.description || !formData.category || !formData.brand || !formData.subCategory) {
          return toast.error('Please fill all required fields');
      }
      if (!editingItem && !bannerImage) return toast.error('Banner image is required');
      if (!editingItem && galleryImages.length === 0 && galleryPreviews.length === 0) return toast.error('At least one gallery image is required');

       // Validate Variations
      for (const v of variations) {
          if (!v.size && !v.color) return toast.error('Variation must have size or color');
          if (!v.basePrice || !v.stock) return toast.error('Variation price and stock are required');
      }

      setIsSubmitting(true);

      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('subCategory', formData.subCategory);
      data.append('brand', formData.brand);
      data.append('isActive', formData.isActive.toString());
      
      if (bannerImage) data.append('bannerImage', bannerImage);
      if (galleryImages.length > 0) {
          galleryImages.forEach(file => data.append('images', file));
      }

      data.append('variation', JSON.stringify(variations));

      try {
          const url = editingItem 
            ? `${API_BASE_URL}/product/${editingItem.productId || editingItem._id}` 
            : `${API_BASE_URL}/product`;
          
          const method = editingItem ? 'PUT' : 'POST';

          const res = await fetch(url, {
              method: method,
              headers: { Authorization: `Bearer ${token}` },
              body: data
          });

          if (!res.ok) {
              const err = await res.json();
              throw new Error(err.message || 'Operation failed');
          }

          toast.success(editingItem ? 'Product updated' : 'Product created');
          fetchItems();
          handleCloseFormModal();
      } catch (error: any) {
          toast.error(error.message);
      } finally {
          setIsSubmitting(false);
      }
  };

  const confirmDelete = (id: string) => {
      if (userRole !== 'admin') return toast.error('Access Denied');
      setItemToDelete(id);
      setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`${API_BASE_URL}/product/${itemToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to delete');

      toast.success('Product deleted');
      fetchItems();
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error('Failed to delete product');
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  if (loading && !items.length) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
             Product Management
           </h1>
           <p className="text-gray-400 mt-1">Manage your catalog, inventory, and variations</p>
        </div>

        <div className="flex items-center gap-3">
            <Button 
                className='cursor-pointer shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300' 
                onClick={() => { fetchItems(); toast.success('Product list refreshed'); }}
            >
                <MdRefresh size={20} className="mr-1" /> Refresh
            </Button>

            {userRole === 'admin' && (
            <button
              onClick={() => handleOpenFormModal()}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl transition-all shadow-lg hover:shadow-purple-500/25 active:scale-95 text-white font-medium"
            >
              <MdAdd size={20} /> Add Product
            </button>
            )}
        </div>
      </div>

      {/* Product List Table */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <MdImage size={16} /> Asset
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2"><MdTitle size={16} /> Name & Ref</div>
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                     <div className="flex items-center gap-2"><MdCategory size={16} /> Category/Brand</div>
                </th>
                 <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                     <div className="flex items-center gap-2">Variations</div>
                </th>
                <th className="px-6 py-5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <motion.tr 
                    key={item._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 shadow-sm group-hover:shadow-md transition-all">
                        <img src={item.bannerImage} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex flex-col">
                            <span className="font-semibold text-white text-base group-hover:text-purple-300 transition-colors">{item.name}</span>
                            <span className="text-xs font-mono text-purple-400 mt-1">{item.productId}</span>
                            <div className="mt-2">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${item.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                    {item.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex flex-col text-sm text-gray-400 gap-1">
                            <span className="flex items-center gap-1"><MdCategory size={14} className="text-gray-500"/> {item.category?.name || 'N/A'}</span>
                            <span className="flex items-center gap-1"><MdBrandingWatermark size={14} className="text-gray-500"/> {item.brand?.name || 'N/A'}</span>
                        </div>
                    </td>
                     <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {item.variation?.length || 0} Variants
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                           <button 
                             onClick={() => handleViewDetails(item)}
                             className="p-2 bg-purple-500/10 hover:bg-purple-500 text-purple-500 hover:text-white rounded-lg transition-all duration-200"
                             title="View Details"
                           >
                             <MdVisibility size={18} />
                           </button>
                           {userRole === 'admin' && (
                           <>
                           <button 
                             onClick={() => handleOpenFormModal(item)}
                             className="p-2 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white rounded-lg transition-all duration-200"
                             title="Edit"
                           >
                             <MdEdit size={18} />
                           </button>
                           <button 
                             onClick={() => confirmDelete(item.productId)}
                             className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all duration-200"
                             title="Delete"
                           >
                             <MdDelete size={18} />
                           </button>
                           </>
                           )}
                       </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
         isOpen={isDeleteModalOpen}
         onClose={() => setIsDeleteModalOpen(false)}
         onConfirm={handleDelete}
         isLoading={isDeleting}
         title="Delete Product"
         message="Are you sure you want to delete this product? All images will be removed."
      />

      {/* Add / Edit Form Modal */}
      <Modal isOpen={isFormModalOpen} onClose={handleCloseFormModal} title={editingItem ? "Edit Product" : "Add New Product"} maxWidth="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1.5 ml-1">Product Name</label>
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"
                        placeholder="Product Name"
                    />
                </div>

                {/* Dropdowns */}
                <div>
                     <label className="block text-xs font-semibold uppercase text-gray-500 mb-1.5 ml-1">Category</label>
                     <select 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"
                     >
                         <option value="">Select Category</option>
                         {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                     </select>
                </div>
                <div>
                     <label className="block text-xs font-semibold uppercase text-gray-500 mb-1.5 ml-1">Sub-Category</label>
                     <select 
                        value={formData.subCategory}
                        onChange={e => setFormData({...formData, subCategory: e.target.value})}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"
                     >
                         <option value="">Select Sub-Category</option>
                         {subCategories.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                     </select>
                </div>
                <div>
                     <label className="block text-xs font-semibold uppercase text-gray-500 mb-1.5 ml-1">Brand</label>
                     <select 
                        value={formData.brand}
                        onChange={e => setFormData({...formData, brand: e.target.value})}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"
                     >
                         <option value="">Select Brand</option>
                         {brands.map(brand => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
                     </select>
                </div>
                 <div>
                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1.5 ml-1">Status</label>
                    <div className="flex items-center gap-3 mt-3">
                         <div className="relative">
                            <input 
                                type="checkbox" 
                                checked={formData.isActive} 
                                onChange={e => setFormData({...formData, isActive: e.target.checked})} 
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-purple-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </div>
                        <span className="text-sm font-medium text-gray-400">{formData.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1.5 ml-1">Description</label>
                <div className="bg-white text-black rounded-xl overflow-hidden">
                    <ReactQuill 
                        theme="snow" 
                        value={formData.description} 
                        onChange={val => setFormData({...formData, description: val})} 
                        className="h-64 mb-12"
                    />
                </div>
            </div>

            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                 <div>
                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-3 ml-1">Banner Image</label>
                    <div 
                        onClick={() => bannerInputRef.current?.click()}
                        className={`h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${bannerPreview ? 'border-purple-500/50 bg-purple-500/5' : 'border-white/10 hover:border-purple-500/50 hover:bg-white/5'}`}
                    >
                        {bannerPreview ? (
                            <img src={bannerPreview} alt="Banner" className="h-full w-full object-cover rounded-xl" />
                        ) : (
                            <div className="text-center text-gray-500">
                                <MdCloudUpload size={32} className="mx-auto mb-2" />
                                <span className="text-sm">Click to upload banner</span>
                            </div>
                        )}
                        <input type="file" ref={bannerInputRef} hidden accept="image/*" onChange={handleBannerChange} />
                    </div>
                 </div>

                 <div>
                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-3 ml-1">Gallery Images (Replace All)</label>
                    <div className="grid grid-cols-3 gap-2">
                        {galleryPreviews.map((src, idx) => (
                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border border-white/10">
                                <img src={src} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                         <div 
                            onClick={() => galleryInputRef.current?.click()}
                            className="aspect-square border-2 border-dashed border-white/10 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-500/50 hover:bg-white/5 text-gray-500 hover:text-purple-500 transition-colors"
                         >
                            <MdAdd size={24} />
                         </div>
                    </div>
                     <p className="text-[10px] text-gray-500 mt-2">* Uploading new images will replace all existing gallery images.</p>
                    <input type="file" ref={galleryInputRef} hidden multiple accept="image/*" onChange={handleGalleryChange} />
                 </div>
            </div>

            {/* Variations */}
            <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <label className="block text-xs font-semibold uppercase text-gray-500 ml-1">Variations</label>
                    <button type="button" onClick={addVariation} className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                        <MdAdd /> Add Variation
                    </button>
                </div>
                
                <div className="space-y-3">
                    {variations.map((variation, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-2 p-3 bg-white/5 rounded-xl items-end relative group">
                            <div className="col-span-2">
                                <label className="text-[10px] text-gray-500 uppercase">Size</label>
                                <input 
                                    type="text" 
                                    placeholder="Size"
                                    value={variation.size}
                                    onChange={e => handleVariationChange(idx, 'size', e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:border-purple-500 outline-none" 
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-[10px] text-gray-500 uppercase">Color</label>
                                <input 
                                    type="text" 
                                    placeholder="Color"
                                    value={variation.color}
                                    onChange={e => handleVariationChange(idx, 'color', e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:border-purple-500 outline-none" 
                                />
                            </div>
                            <div className="col-span-3">
                                <label className="text-[10px] text-gray-500 uppercase">Price</label>
                                <input 
                                    type="number" 
                                    placeholder="Price"
                                    value={variation.basePrice}
                                    onChange={e => handleVariationChange(idx, 'basePrice', e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:border-purple-500 outline-none" 
                                />
                            </div>
                             <div className="col-span-3">
                                <label className="text-[10px] text-gray-500 uppercase">Stock</label>
                                <input 
                                    type="number" 
                                    placeholder="Stock"
                                    value={variation.stock}
                                    onChange={e => handleVariationChange(idx, 'stock', e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:border-purple-500 outline-none" 
                                />
                            </div>
                            <div className="col-span-2 flex justify-end pb-1">
                                <button type="button" onClick={() => removeVariation(idx)} className="text-red-500 hover:text-red-400 p-1">
                                    <MdDelete size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
                <button 
                    type="button" 
                    onClick={handleCloseFormModal}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-medium"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold shadow-lg shadow-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Processing...' : (editingItem ? 'Update Product' : 'Create Product')}
                </button>
            </div>
        </form>
      </Modal>

      {/* Details View Modal */}
      <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title="Product Details" maxWidth="max-w-3xl">
        {detailsItem && (
        <div className="space-y-8 text-gray-300">
            {/* Header & Banner */}
            <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/10">
                <div className="w-full max-h-64 rounded-xl overflow-hidden border border-white/10 shadow-xl mb-4 relative">
                     <img src={detailsItem.bannerImage} alt={detailsItem.name} className="w-full h-full object-contain" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{detailsItem.name}</h2>
                <div className="flex gap-3">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold border ${detailsItem.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                        {detailsItem.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold border bg-purple-500/10 text-purple-400 border-purple-500/20">
                        {detailsItem.productId}
                    </span>
                </div>
            </div>

            {/* Gallery */}
            {detailsItem.images && detailsItem.images.length > 0 && (
                <div>
                     <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Gallery</h4>
                     <div className="grid grid-cols-4 gap-2">
                         {detailsItem.images.map((img: string, idx: number) => (
                             <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-white/10">
                                 <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                             </div>
                         ))}
                     </div>
                </div>
            )}

            {/* Basic Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                     <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2"><MdCategory /> Category</h4>
                     <p className="font-medium text-white">{detailsItem.category?.name || 'N/A'}</p>
                     <p className="text-sm text-gray-400">{detailsItem.subCategory?.name || 'N/A'}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                     <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2"><MdBrandingWatermark /> Brand</h4>
                     <p className="font-medium text-white">{detailsItem.brand?.name || 'N/A'}</p>
                </div>
            </div>

            {/* Description (Rich Text) */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <MdDescription /> Description
                </h4>
                <div 
                    className="prose prose-invert prose-sm max-w-none text-gray-300"
                    dangerouslySetInnerHTML={{ __html: detailsItem.description }} 
                />
            </div>

            {/* Variations */}
            <div>
                 <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Variations</h4>
                 <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                     <table className="w-full text-sm text-left">
                         <thead className="text-xs text-gray-500 uppercase bg-white/5">
                             <tr>
                                 <th className="px-4 py-3">Size</th>
                                 <th className="px-4 py-3">Color</th>
                                 <th className="px-4 py-3">Price</th>
                                 <th className="px-4 py-3">Stock</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-white/5 text-gray-300">
                             {detailsItem.variation?.map((v: any, idx: number) => (
                                 <tr key={idx} className="hover:bg-white/5">
                                     <td className="px-4 py-2">{v.size || '-'}</td>
                                     <td className="px-4 py-2">{v.color || '-'}</td>
                                     <td className="px-4 py-2 font-mono text-purple-400 font-medium">${v.basePrice}</td>
                                     <td className="px-4 py-2">{v.stock}</td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 px-2 border-t border-white/10">
                 <span className="flex items-center gap-2">
                    <MdDateRange /> Created: {detailsItem.createdAt ? new Date(detailsItem.createdAt).toLocaleDateString() : 'N/A'}
                 </span>
                 {detailsItem.createdBy && (
                    <span className="flex items-center gap-2">
                        <MdPeople /> Created By: <span className="text-purple-400 font-medium">{detailsItem.createdBy.name}</span>
                    </span>
                 )}
            </div>
        </div>
        )}
      </Modal>
    </div>
  );
}
