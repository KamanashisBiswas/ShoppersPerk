'use client';

import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '@/utils/apiConfig';
import toast from 'react-hot-toast';
import { MdAdd, MdEdit, MdDelete, MdLink, MdCloudUpload, MdClose, MdImage, MdTitle, MdSort, MdVisibility, MdLink as MdLinkIcon, MdDateRange, MdToggleOn, MdPeople } from 'react-icons/md';
import Modal from '@/components/ui/Modal';
import { motion } from 'framer-motion';
import ConfirmModal from '@/components/ui/ConfirmModal';

interface CarouselItem {
  _id: string;
  carouselId: string;
  image: string;
  title?: string;
  subtitle?: string;
  description?: string;
  href?: string;
  order: number;
  isActive: boolean;
  createdBy?: {
    name: string;
  };
  createdAt?: string;
}

export default function CarouselManagement() {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CarouselItem | null>(null);

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    href: '',
    order: 0,
    isActive: true,
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/carousel`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        setItems([]);
      }
    } catch (error) {
      toast.error('Failed to fetch carousel items');
    } finally {
      setLoading(false);
    }
  };

  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    fetchItems();
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

  const [detailsItem, setDetailsItem] = useState<CarouselItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleViewDetails = (item: CarouselItem) => {
     setDetailsItem(item);
     setIsDetailsModalOpen(true);
  };

  const handleOpenModal = (item?: CarouselItem) => {
    // ... existing handleOpenModal code ...
    if (userRole !== 'admin') {
        toast.error('Access Denied: Admins only');
        return;
    }
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title || '',
        subtitle: item.subtitle || '',
        description: item.description || '',
        href: item.href || '',
        order: item.order || 0,
        isActive: item.isActive !== undefined ? item.isActive : true,
      });
      setPreviewUrl(item.image); // Show existing image as preview
      setSelectedFile(null);
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        href: '',
        order: items.length + 1,
        isActive: true,
      });
      setPreviewUrl('');
      setSelectedFile(null);
    }
    setIsModalOpen(true);
  };

  // ... existing handlers ...

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole !== 'admin') {
         toast.error('Access Denied: Admins only');
         return;
    }
    const token = localStorage.getItem('token');
    
    if (!token) {
        toast.error('Not authenticated');
        return;
    }

    // 1. Validation Logic
    if (!editingItem && !selectedFile) {
        toast.error('Please select an image for the new slide.');
        return;
    }

    /* Additional Validations if needed */
    if (!formData.title.trim()) {
         toast.error('Title is required (for internal reference at least).');
         return; 
    }

    setIsSubmitting(true);

    try {
      // Use carouselId for Update URL if editing
      const url = editingItem
        ? `${API_BASE_URL}/carousel/${editingItem.carouselId}`
        : `${API_BASE_URL}/carousel`;
      const method = editingItem ? 'PUT' : 'POST';

      // 2. Prepare FormData
      const data = new FormData();
      if (selectedFile) {
          data.append('image', selectedFile);
      }
      data.append('title', formData.title);
      data.append('subtitle', formData.subtitle);
      data.append('description', formData.description);
      data.append('href', formData.href);
      data.append('order', formData.order.toString());
      data.append('isActive', formData.isActive.toString());

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = errorData.message || (errorData.errors && errorData.errors[0]?.msg) || 'An error occurred';
        throw new Error(errorMessage);
      }

      toast.success(editingItem ? 'Slide updated successfully' : 'Slide created successfully');
      setIsModalOpen(false);
      fetchItems();
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (id: string) => {
      if (userRole !== 'admin') {
         toast.error('Access Denied: Admins only');
         return;
      }
      setItemToDelete(id); // This MUST be carouselId
      setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    if (userRole !== 'admin') {
         toast.error('Access Denied: Admins only');
         return;
    }

    setIsDeleting(true);
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`${API_BASE_URL}/carousel/${itemToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to delete');

      toast.success('Slide deleted');
      fetchItems();
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error('Failed to delete slide');
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
             Carousel Management
           </h1>
           <p className="text-gray-400 mt-1">Manage your homepage slider content</p>
        </div>
        
        {userRole === 'admin' && (
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl transition-all shadow-lg hover:shadow-purple-500/25 active:scale-95 text-white font-medium"
        >
          <MdAdd size={20} /> Add New Slide
        </button>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <MdImage size={16} /> Image
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2"><MdTitle size={16} /> ID & Content</div>
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2"><MdSort size={16} /> Order</div>
                </th>
                 <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2"><MdLinkIcon size={16} /> Link</div>
                </th>
                <th className="px-6 py-5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No slides found. Add your first slide above.
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
                      <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-white/10 shadow-sm group-hover:shadow-md transition-all">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex flex-col">
                            <span className="text-xs font-mono text-purple-400 mb-1">{item.carouselId || '-'}</span>
                            <span className="font-semibold text-white text-base group-hover:text-purple-300 transition-colors">{item.title || 'Untitled'}</span>
                            <span className="text-sm text-gray-500">{item.subtitle}</span>
                            <span className="text-xs text-gray-600 mt-1 line-clamp-1">{item.description}</span>
                            <div className="mt-1">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${item.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                    {item.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-mono text-gray-400 border border-white/5">
                            #{item.order}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <span className="text-sm text-blue-400 hover:underline cursor-pointer truncate max-w-[150px] block">
                            {item.href || '-'}
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
                             onClick={() => handleOpenModal(item)}
                             className="p-2 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white rounded-lg transition-all duration-200"
                             title="Edit"
                           >
                             <MdEdit size={18} />
                           </button>
                           <button 
                             onClick={() => confirmDelete(item.carouselId)}
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
         title="Delete Slide"
         message="Are you sure you want to delete this slide? This action will permanently remove the slide and its image."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${editingItem ? 'Edit' : 'Add'} MakeOver Slide`}
      >
        <form onSubmit={handleSubmit} className="space-y-5 text-gray-300">
            {/* Form Content (same as before) */}
            {/* Image Upload Area */}
            <div className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-colors cursor-pointer relative ${previewUrl ? 'border-purple-500/50 bg-purple-500/5' : 'border-white/20 hover:border-purple-500/50 hover:bg-white/5'}`}
                 onClick={() => fileInputRef.current?.click()}>
                 
                 <input 
                    type="file" 
                    hidden 
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                 />

                 {previewUrl ? (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                             <p className="text-white font-medium flex items-center gap-2"><MdEdit /> Change Image</p>
                        </div>
                    </div>
                 ) : (
                    <div className="py-8 text-center">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white mx-auto mb-3">
                            <MdCloudUpload size={24} />
                        </div>
                        <p className="font-medium text-white">Click to upload slide image</p>
                        <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                    </div>
                 )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1.5 ml-1">Title</label>
                    <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} 
                           className="w-full bg-[#1a1a1a] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 outline-none transition-colors text-white placeholder-gray-600" 
                           placeholder="e.g. Summer Collection"
                    />
                </div>
                
                 <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1.5 ml-1">Subtitle</label>
                    <input type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} 
                           className="w-full bg-[#1a1a1a] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 outline-none transition-colors text-white placeholder-gray-600" 
                           placeholder="e.g. Up to 50% Off"
                    />
                </div>

                <div className="col-span-2 md:col-span-1">
                     <label className="block text-xs font-semibold uppercase text-gray-500 mb-1.5 ml-1">Sort Order</label>
                     <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} 
                            className="w-full bg-[#1a1a1a] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 outline-none transition-colors text-white placeholder-gray-600" 
                     />
                </div>

                <div className="col-span-2 md:col-span-2 flex items-center justify-start mt-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                            <input 
                                type="checkbox" 
                                checked={formData.isActive} 
                                onChange={e => setFormData({...formData, isActive: e.target.checked})} 
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-purple-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </div>
                        <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                            {formData.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </label>
                </div>
            </div>
            
            <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1.5 ml-1">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} 
                          className="w-full bg-[#1a1a1a] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 outline-none transition-colors text-white placeholder-gray-600 min-h-[100px]" 
                          placeholder="Brief description for the slide..."
                />
            </div>

            <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1.5 ml-1">Link URL</label>
                <div className="relative">
                    <input type="text" value={formData.href} onChange={e => setFormData({...formData, href: e.target.value})} 
                           className="w-full bg-[#1a1a1a] border border-white/10 focus:border-purple-500 rounded-xl pl-10 pr-4 py-3 outline-none transition-colors text-white placeholder-gray-600" 
                           placeholder="/collections/summer"
                    />
                    <MdLinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                </div>
            </div>

            <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl mt-4 font-bold text-white shadow-lg transform transition-all duration-300 relative overflow-hidden flex items-center justify-center gap-2
                    ${isSubmitting 
                        ? 'bg-gray-600 cursor-not-allowed scale-[0.98]' 
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 active:scale-[0.98] hover:shadow-purple-500/25'
                    }`}
            >
                {isSubmitting ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing...</span>
                    </>
                ) : (
                    <>
                        {editingItem ? <MdEdit size={20} /> : <MdAdd size={20} />}
                        <span>{editingItem ? 'Update Slide' : 'Create Slide'}</span>
                    </>
                )}
            </button>
        </form>
      </Modal>

      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Slide Details"
      >
        {detailsItem && (
            <div className="space-y-6 text-gray-300">
                <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg border border-white/10">
                    <img src={detailsItem.image} alt={detailsItem.title} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                        <span className={`text-xs font-semibold ${detailsItem.isActive ? 'text-green-400' : 'text-red-400'}`}>
                            {detailsItem.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                         <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Title & Subtitle</h4>
                         <p className="text-xl font-bold text-white mb-1">{detailsItem.title || 'No Title'}</p>
                         <p className="text-lg text-purple-400 italic">{detailsItem.subtitle || 'No Subtitle'}</p>
                    </div>

                    <div className="col-span-2 p-4 bg-white/5 rounded-xl border border-white/10">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <MdTitle /> Description
                        </h4>
                        <p className="text-gray-300 leading-relaxed">{detailsItem.description || 'No description provided.'}</p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                         <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <MdLinkIcon /> Link URL
                         </h4>
                         <p className="text-blue-400 truncate hover:underline cursor-pointer">{detailsItem.href || '-'}</p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                         <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <MdSort /> Order
                         </h4>
                         <span className="text-2xl font-mono text-white">#{detailsItem.order}</span>
                    </div>

                    <div className="col-span-2 flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-white/10">
                         <span>ID: <span className="font-mono text-gray-400">{detailsItem.carouselId}</span></span>
                         <div className="flex items-center gap-4">
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
                </div>
            </div>
        )}
      </Modal>
    </div>
  );
}
