'use client';

import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '@/utils/apiConfig';
import toast from 'react-hot-toast';
import { MdAdd, MdEdit, MdDelete, MdCloudUpload, MdImage, MdTitle, MdVisibility, MdDateRange, MdDescription, MdNumbers, MdCategory, MdBrandingWatermark, MdPeople } from 'react-icons/md';
import Modal from '@/components/ui/Modal';
import { motion } from 'framer-motion';
import ConfirmModal from '@/components/ui/ConfirmModal';

interface BrandItem {
  _id: string;
  brandId: string;
  image: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdBy?: {
      name: string;
  };
  createdAt?: string;
}

export default function BrandManagement() {
  const [items, setItems] = useState<BrandItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BrandItem | null>(null);

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Details State
  const [detailsItem, setDetailsItem] = useState<BrandItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userRole, setUserRole] = useState<string>('');

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/brand`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        setItems([]);
      }
    } catch (error) {
      toast.error('Failed to fetch brands');
    } finally {
      setLoading(false);
    }
  };

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

  const handleOpenModal = (item?: BrandItem) => {
    if (userRole !== 'admin') {
        toast.error('Access Denied: Admins only');
        return;
    }
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name || '',
        description: item.description || '',
        isActive: item.isActive !== undefined ? item.isActive : true,
      });
      setPreviewUrl(item.image);
      setSelectedFile(null);
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        isActive: true,
      });
      setPreviewUrl('');
      setSelectedFile(null);
    }
    setIsModalOpen(true);
  };

  const handleViewDetails = (item: BrandItem) => {
     setDetailsItem(item);
     setIsDetailsModalOpen(true);
  };

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

    if (!editingItem && !selectedFile) {
        toast.error('Please select an image for the brand.');
        return;
    }

    if (!formData.name.trim()) {
         toast.error('Name is required.');
         return; 
    }

    setIsSubmitting(true);

    try {
      const url = editingItem
        ? `${API_BASE_URL}/brand/${editingItem.brandId}`
        : `${API_BASE_URL}/brand`;
      const method = editingItem ? 'PUT' : 'POST';

      const data = new FormData();
      if (selectedFile) {
          data.append('image', selectedFile);
      }
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('isActive', formData.isActive.toString());

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'An error occurred');
      }

      toast.success(editingItem ? 'Brand updated successfully' : 'Brand created successfully');
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
      setItemToDelete(id);
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
      const res = await fetch(`${API_BASE_URL}/brand/${itemToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to delete');

      toast.success('Brand deleted');
      fetchItems();
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error('Failed to delete brand');
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
             Brand Management
           </h1>
           <p className="text-gray-400 mt-1">Manage your product brands</p>
        </div>
        
        {userRole === 'admin' && (
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl transition-all shadow-lg hover:shadow-purple-500/25 active:scale-95 text-white font-medium"
        >
          <MdAdd size={20} /> Add New Brand
        </button>
        )}
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <MdImage size={16} /> Image
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2"><MdTitle size={16} /> ID & Name</div>
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2"><MdDescription size={16} /> Description</div>
                </th>
                <th className="px-6 py-5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No brands found. Add your first brand above.
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
                      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 shadow-sm group-hover:shadow-md transition-all group-hover:border-purple-500/30">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex flex-col">
                            <span className="text-xs font-mono text-purple-400 mb-1">{item.brandId}</span>
                            <span className="font-semibold text-white text-base group-hover:text-purple-300 transition-colors">{item.name}</span>
                            <div className="mt-2">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${item.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                    {item.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <p className="text-sm text-gray-400 line-clamp-2 max-w-xs">{item.description || '-'}</p>
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
                             onClick={() => confirmDelete(item.brandId)}
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
         title="Delete Brand"
         message="Are you sure you want to delete this brand? This action cannot be undone."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${editingItem ? 'Edit' : 'Add'} Brand`}
      >
        <form onSubmit={handleSubmit} className="space-y-5 text-gray-300">
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
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-purple-500/50">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full">
                             <MdEdit className="text-white" size={24} />
                        </div>
                    </div>
                 ) : (
                    <div className="py-8 text-center">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white mx-auto mb-3">
                            <MdCloudUpload size={24} />
                        </div>
                        <p className="font-medium text-white">Upload Icon</p>
                    </div>
                 )}
            </div>

            <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1.5 ml-1">Brand Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                       className="w-full bg-[#1a1a1a] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 outline-none transition-colors text-white placeholder-gray-600" 
                       placeholder="e.g. Nike"
                />
            </div>

            <div className="flex items-center justify-start mt-2">
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
            
            <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1.5 ml-1">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} 
                          className="w-full bg-[#1a1a1a] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 outline-none transition-colors text-white placeholder-gray-600 min-h-[100px]" 
                          placeholder="Brief description..."
                />
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
                        <span>{editingItem ? 'Update Brand' : 'Create Brand'}</span>
                    </>
                )}
            </button>
        </form>
      </Modal>

      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Brand Details"
      >
        {detailsItem && (
            <div className="space-y-6 text-gray-300">
                <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/10">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500/30 shadow-xl mb-4">
                        <img src={detailsItem.image} alt={detailsItem.name} className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">{detailsItem.name}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${detailsItem.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                        {detailsItem.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <MdNumbers /> Brand ID
                        </h4>
                        <p className="font-mono text-white text-lg">{detailsItem.brandId}</p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <MdDescription /> Description
                        </h4>
                        <p className="text-gray-300 leading-relaxed">{detailsItem.description || 'No description provided.'}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 px-2">
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
        )}
      </Modal>
    </div>
  );
}
