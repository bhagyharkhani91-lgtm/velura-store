import { useState } from 'react';
import { Button } from '../../../components/ui/Button/Button';
import { Plus, Search, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useCMSStore } from '../../../stores/cmsStore';
import type { CMSPage } from '../../../stores/cmsStore';

export function AdminPagesPage() {
  const { pages, addPage, updatePage, deletePage } = useCMSStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CMSPage | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    isPublished: true
  });

  const filteredPages = pages.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingPage(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      isPublished: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (page: CMSPage) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      isPublished: page.isPublished
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPage) {
      updatePage(editingPage.id, {
        title: formData.title,
        slug: formData.slug || editingPage.slug,
        content: formData.content,
        isPublished: formData.isPublished
      });
    } else {
      addPage({
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        isPublished: formData.isPublished
      });
    }
    
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="heading-3xl">Pages CMS</h1>
        <Button leftIcon={<Plus size={18} />} onClick={handleOpenAdd}>Create Page</Button>
      </div>

      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={18} />
            <input 
              type="text" 
              placeholder="Search pages..." 
              className="w-full bg-bg-secondary border border-border rounded-md pl-10 pr-4 py-2 text-primary focus:outline-none focus:border-accent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-secondary text-secondary text-sm border-b border-border">
              <th className="p-4 font-medium">Page Title</th>
              <th className="p-4 font-medium">URL Slug</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Last Updated</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPages.map(page => (
              <tr key={page.id} className="border-b border-border hover:bg-bg-hover transition-colors">
                <td className="p-4 font-medium text-primary">{page.title}</td>
                <td className="p-4 text-secondary">/p/{page.slug}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded ${page.isPublished ? 'bg-success-muted text-success' : 'bg-bg-secondary text-secondary'}`}>
                    {page.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="p-4 text-secondary text-sm">
                  {new Date(page.updatedAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <a href={`/p/${page.slug}`} target="_blank" rel="noreferrer" className="inline-flex text-secondary hover:text-primary mr-3 transition-colors">
                    <ExternalLink size={18} />
                  </a>
                  <button onClick={() => handleOpenEdit(page)} className="text-secondary hover:text-accent mr-3 transition-colors">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => deletePage(page.id)} className="text-secondary hover:text-error transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            
            {filteredPages.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-secondary">
                  No pages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black-80 flex items-center justify-center z-100 p-4">
          <div className="bg-surface border border-border rounded-xl w-full max-w-3xl p-6 max-h-90vh flex flex-col">
            <h2 className="heading-2xl mb-6">{editingPage ? 'Edit Page' : 'Create New Page'}</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 overflow-y-auto pr-2">
              <div className="flex gap-4">
                <div className="flex-[2]">
                  <label className="block text-sm font-medium text-secondary mb-1">Page Title</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2 text-primary focus:outline-none focus:border-accent"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-secondary mb-1">URL Slug</label>
                  <input 
                    type="text" 
                    placeholder="e.g. about-us"
                    className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2 text-primary focus:outline-none focus:border-accent"
                    value={formData.slug}
                    onChange={e => setFormData({...formData, slug: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Status</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={e => setFormData({...formData, isPublished: e.target.checked})}
                    className="w-4 h-4 accent-accent"
                  />
                  <label htmlFor="isPublished" className="text-primary cursor-pointer">Publish this page immediately</label>
                </div>
              </div>
              
              <div className="flex-1 min-h-[300px] flex flex-col">
                <label className="block text-sm font-medium text-secondary mb-1">Page Content (HTML supported)</label>
                <textarea 
                  required
                  className="w-full flex-1 min-h-[300px] bg-bg-secondary border border-border rounded-md px-4 py-3 text-primary focus:outline-none focus:border-accent font-mono text-sm"
                  placeholder="<h2>Heading</h2><p>Your paragraph text here...</p>"
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">Save Page</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
