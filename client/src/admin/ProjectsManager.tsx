import { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { apiFetch, uploadFile } from './api'

type Project = { 
  _id: string; 
  title: string; 
  description: string; 
  category: 'Web App'|'CMS'|'Cybersecurity'|'Cloud'; 
  image?: string; 
  images?: string[];
  link?: string; 
  clientName?: string;
  clientEmail?: string;
  timeline?: string;
  status: 'Draft' | 'In Progress' | 'Completed' | 'Archived';
  featured: boolean;
  startDate?: string;
  endDate?: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES: Project['category'][] = ['Web App','CMS','Cybersecurity','Cloud']
const STATUSES: Project['status'][] = ['Draft', 'In Progress', 'Completed', 'Archived']

export default function ProjectsManager() {
  const { token } = useAuth()
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState<'All' | Project['category']>('All')
  const [statusFilter, setStatusFilter] = useState<'All' | Project['status']>('All')
  const [featuredFilter, setFeaturedFilter] = useState<'All' | 'Featured' | 'Not Featured'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 6

  // Form state
  const [form, setForm] = useState<Partial<Project>>({ 
    title: '', 
    description: '', 
    category: 'Web App', 
    link: '',
    clientName: '',
    clientEmail: '',
    timeline: '',
    status: 'Draft',
    featured: false
  })
  const [file, setFile] = useState<File | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [removeImage, setRemoveImage] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  async function load() {
    setLoading(true)
    try {
      const data = await apiFetch<Project[]>('/projects')
      setItems(data)
    } catch (e: any) {
      setError(e.message || 'Failed to load')
    } finally { 
      setLoading(false) 
    }
  }
  
  useEffect(() => { load() }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    try {
      let payload: any = { ...form }
      
      // Handle single image upload
      if (file) {
        const upload = await uploadFile('/uploads', file, token || undefined)
        payload.image = upload.filename
      }
      
      // Handle multiple images upload
      if (files.length > 0) {
        const uploads = await Promise.all(
          files.map(f => uploadFile('/uploads', f, token || undefined))
        )
        payload.images = uploads.map(u => u.filename)
      }
      
      if (!file && removeImage) {
        payload.image = ''
      }
      
      if (editingId) {
        await apiFetch(`/projects/${editingId}`, { 
          method: 'PUT', 
          token: token || undefined, 
          body: payload 
        })
        setSuccess('Project updated successfully!')
      } else {
        await apiFetch('/projects', { 
          method: 'POST', 
          token: token || undefined, 
          body: payload 
        })
        setSuccess('Project created successfully!')
      }
      
      resetForm()
      await load()
    } catch (e: any) {
      setError(e.message || 'Save failed')
    }
  }

  function resetForm() {
    setForm({ 
      title: '', 
      description: '', 
      category: 'Web App',
      link: '',
      clientName: '',
      clientEmail: '',
      timeline: '',
      status: 'Draft',
      featured: false
    })
    setFile(null)
    setFiles([])
    setEditingId(null)
    setRemoveImage(false)
  }

  function edit(project: Project) {
    setEditingId(project._id)
    setForm({ 
      title: project.title, 
      description: project.description, 
      category: project.category,
      link: project.link,
      clientName: project.clientName,
      clientEmail: project.clientEmail,
      timeline: project.timeline,
      status: project.status,
      featured: project.featured
    })
    setRemoveImage(false)
  }

  async function remove(id: string) {
    if (!confirm('Delete this project?')) return
    try {
      await apiFetch(`/projects/${id}`, { method: 'DELETE', token: token || undefined })
      setSuccess('Project deleted successfully!')
      await load()
    } catch (e: any) { 
      setError(e.message || 'Delete failed') 
    }
  }

  async function toggleFeatured(id: string, featured: boolean) {
    try {
      await apiFetch(`/projects/${id}`, { 
        method: 'PUT', 
        token: token || undefined, 
        body: { featured } 
      })
      setSuccess(`Project ${featured ? 'featured' : 'unfeatured'} successfully!`)
      await load()
    } catch (e: any) {
      setError(e.message || 'Update failed')
    }
  }

  async function bulkUpdateFeatured(featured: boolean) {
    if (selectedItems.length === 0) return
    try {
      await apiFetch('/projects/featured/bulk', {
        method: 'PUT',
        token: token || undefined,
        body: { ids: selectedItems, featured }
      })
      setSuccess(`${selectedItems.length} projects ${featured ? 'featured' : 'unfeatured'} successfully!`)
      setSelectedItems([])
      await load()
    } catch (e: any) {
      setError(e.message || 'Bulk update failed')
    }
  }

  async function bulkUpdateStatus(status: Project['status']) {
    if (selectedItems.length === 0) return
    try {
      await apiFetch('/projects/status/bulk', {
        method: 'PUT',
        token: token || undefined,
        body: { ids: selectedItems, status }
      })
      setSuccess(`${selectedItems.length} projects status updated to ${status}!`)
      setSelectedItems([])
      await load()
    } catch (e: any) {
      setError(e.message || 'Bulk update failed')
    }
  }

  function move(id: string, dir: number) { 
    setItems(prev => reorder(prev, id, dir)) 
  }

  async function saveOrder() {
    try { 
      const body = items.map((p, idx) => ({ id: p._id, order: idx }))
      await apiFetch('/projects/reorder/bulk', { 
        method: 'PUT', 
        token: token || undefined, 
        body 
      })
      setSuccess('Project order saved successfully!')
    } catch (e: any) {
      setError(e.message || 'Save order failed')
    }
  }

  function toggleSelect(id: string) {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(x => x !== id)
        : [...prev, id]
    )
  }

  function selectAll() {
    const filtered = getFilteredItems()
    setSelectedItems(filtered.map(p => p._id))
  }

  function clearSelection() {
    setSelectedItems([])
  }

  function getFilteredItems(): Project[] {
    return items.filter(project => {
      const matchesCategory = categoryFilter === 'All' || project.category === categoryFilter
      const matchesStatus = statusFilter === 'All' || project.status === statusFilter
      const matchesFeatured = featuredFilter === 'All' || 
        (featuredFilter === 'Featured' && project.featured) ||
        (featuredFilter === 'Not Featured' && !project.featured)
      const matchesSearch = searchQuery === '' || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.clientName && project.clientName.toLowerCase().includes(searchQuery.toLowerCase()))
      
      return matchesCategory && matchesStatus && matchesFeatured && matchesSearch
    })
  }

  const filteredItems = getFilteredItems()
  const paginatedItems = paginate(filteredItems, page, pageSize)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-orbitron">Projects Manager</h1>
        <div className="flex items-center gap-2 text-sm text-white/60">
          <span>Total: {items.length}</span>
          <span>•</span>
          <span>Featured: {items.filter(p => p.featured).length}</span>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400">
          {success}
        </div>
      )}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400">
          {error}
        </div>
      )}

      {/* Advanced Filters */}
      <div className="glass-dark rounded-xl p-4 space-y-4">
        <h3 className="text-lg font-semibold">Filters & Search</h3>
        
        {/* Search Bar */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 rounded bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {/* Category Filter */}
          <div className="flex gap-1">
            <span className="text-sm text-white/60 px-2 py-1">Category:</span>
            {(['All', ...CATEGORIES] as const).map(cat => (
              <button
                key={cat}
                onClick={() => { setCategoryFilter(cat as any); setPage(1) }}
                className={`px-3 py-1 rounded text-sm ${
                  categoryFilter === cat 
                    ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-400' 
                    : 'bg-white/10 border border-white/20 hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex gap-1">
            <span className="text-sm text-white/60 px-2 py-1">Status:</span>
            {(['All', ...STATUSES] as const).map(status => (
              <button
                key={status}
                onClick={() => { setStatusFilter(status as any); setPage(1) }}
                className={`px-3 py-1 rounded text-sm ${
                  statusFilter === status 
                    ? 'bg-purple-500/20 border border-purple-400 text-purple-400' 
                    : 'bg-white/10 border border-white/20 hover:bg-white/20'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Featured Filter */}
          <div className="flex gap-1">
            <span className="text-sm text-white/60 px-2 py-1">Featured:</span>
            {(['All', 'Featured', 'Not Featured'] as const).map(featured => (
              <button
                key={featured}
                onClick={() => { setFeaturedFilter(featured as any); setPage(1) }}
                className={`px-3 py-1 rounded text-sm ${
                  featuredFilter === featured 
                    ? 'bg-yellow-500/20 border border-yellow-400 text-yellow-400' 
                    : 'bg-white/10 border border-white/20 hover:bg-white/20'
                }`}
              >
                {featured}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="glass-dark rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">
              {selectedItems.length} project(s) selected
            </span>
            <div className="flex gap-2">
              <select
                onChange={(e) => bulkUpdateStatus(e.target.value as Project['status'])}
                className="px-3 py-1 rounded bg-black/40 border border-white/10 text-sm"
              >
                <option value="">Update Status</option>
                {STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <button
                onClick={() => bulkUpdateFeatured(true)}
                className="px-3 py-1 rounded bg-yellow-500/20 border border-yellow-400 text-yellow-400 text-sm hover:bg-yellow-500/30"
              >
                Feature
              </button>
              <button
                onClick={() => bulkUpdateFeatured(false)}
                className="px-3 py-1 rounded bg-gray-500/20 border border-gray-400 text-gray-400 text-sm hover:bg-gray-500/30"
              >
                Unfeature
              </button>
              <button
                onClick={clearSelection}
                className="px-3 py-1 rounded bg-red-500/20 border border-red-400 text-red-400 text-sm hover:bg-red-500/30"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Form */}
      <form onSubmit={save} className="glass-dark rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold">
          {editingId ? 'Edit Project' : 'Create New Project'}
        </h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          {/* Basic Info */}
          <input
            value={form.title || ''}
            onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Project Title *"
            required
            className="px-3 py-2 rounded bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none"
          />
          
          <select
            value={form.category || 'Web App'}
            onChange={(e) => setForm(f => ({ ...f, category: e.target.value as Project['category'] }))}
            className="px-3 py-2 rounded bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Client Info */}
          <input
            value={form.clientName || ''}
            onChange={(e) => setForm(f => ({ ...f, clientName: e.target.value }))}
            placeholder="Client Name"
            className="px-3 py-2 rounded bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none"
          />
          
          <input
            type="email"
            value={form.clientEmail || ''}
            onChange={(e) => setForm(f => ({ ...f, clientEmail: e.target.value }))}
            placeholder="Client Email"
            className="px-3 py-2 rounded bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none"
          />

          {/* Timeline & Status */}
          <input
            value={form.timeline || ''}
            onChange={(e) => setForm(f => ({ ...f, timeline: e.target.value }))}
            placeholder="Timeline (e.g., 3 months, 6 weeks)"
            className="px-3 py-2 rounded bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none"
          />
          
          <select
            value={form.status || 'Draft'}
            onChange={(e) => setForm(f => ({ ...f, status: e.target.value as Project['status'] }))}
            className="px-3 py-2 rounded bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none"
          >
            {STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          {/* External Link */}
          <input
            value={form.link || ''}
            onChange={(e) => setForm(f => ({ ...f, link: e.target.value }))}
            placeholder="External Link (GitHub/Live Site)"
            className="md:col-span-2 px-3 py-2 rounded bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none"
          />

          {/* Description */}
          <textarea
            value={form.description || ''}
            onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Project Description *"
            required
            rows={3}
            className="md:col-span-2 px-3 py-2 rounded bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none"
          />

          {/* Featured Toggle */}
          <div className="md:col-span-2 flex items-center gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.featured || false}
                onChange={(e) => setForm(f => ({ ...f, featured: e.target.checked }))}
                className="w-4 h-4 text-cyan-400 bg-black/40 border-white/10 rounded focus:ring-cyan-400"
              />
              <span className="text-sm">Featured on homepage</span>
            </label>
          </div>

          {/* Image Uploads */}
          <div className="md:col-span-2 space-y-3">
            <label className="block text-sm font-medium">Main Image</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept="image/*"
              className="w-full px-3 py-2 rounded bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none"
            />
            
            <label className="block text-sm font-medium">Additional Images (Gallery)</label>
            <input
              type="file"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              accept="image/*"
              className="w-full px-3 py-2 rounded bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none"
            />
            
            {editingId && (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={removeImage}
                  onChange={(e) => setRemoveImage(e.target.checked)}
                />
                Remove current main image
              </label>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-6 py-2 rounded bg-prism-gradient text-black font-semibold hover:opacity-90"
          >
            {editingId ? 'Update Project' : 'Create Project'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 rounded border border-white/20 hover:bg-white/10"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Projects Grid */}
      {loading ? (
        <div className="text-center py-8">Loading projects...</div>
      ) : (
        <div className="space-y-4">
          {/* Select All */}
          {filteredItems.length > 0 && (
            <div className="flex items-center justify-between">
              <button
                onClick={selectAll}
                className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm"
              >
                Select All ({filteredItems.length})
              </button>
              <button
                onClick={saveOrder}
                className="px-4 py-2 rounded bg-prism-gradient text-black font-semibold text-sm"
              >
                Save Order
              </button>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedItems.map(project => (
              <div key={project._id} className="glass-dark rounded-xl p-4 card-hover">
                {/* Project Image */}
                <div className="aspect-video rounded-lg bg-black/40 border border-white/10 mb-3 overflow-hidden relative">
                  {project.image && (
                    <img 
                      src={`/uploads/${project.image}`} 
                      alt={project.title} 
                      className="w-full h-full object-cover" 
                    />
                  )}
                  {project.featured && (
                    <div className="absolute top-2 right-2 px-2 py-1 rounded bg-yellow-500/20 border border-yellow-400 text-yellow-400 text-xs">
                      Featured
                    </div>
                  )}
                  <div className="absolute top-2 left-2 px-2 py-1 rounded bg-purple-500/20 border border-purple-400 text-purple-400 text-xs">
                    {project.status}
                  </div>
                </div>

                {/* Project Info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{project.title}</h4>
                      <p className="text-xs text-white/60">{project.category}</p>
                      {project.clientName && (
                        <p className="text-xs text-cyan-400">Client: {project.clientName}</p>
                      )}
                      {project.timeline && (
                        <p className="text-xs text-green-400">Timeline: {project.timeline}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(project._id)}
                        onChange={() => toggleSelect(project._id)}
                        className="w-4 h-4"
                      />
                    </div>
                  </div>

                  <p className="text-sm text-white/70 line-clamp-2">{project.description}</p>
                  
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-400 underline hover:text-cyan-300"
                    >
                      View Project →
                    </a>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-1">
                      <button
                        onClick={() => edit(project)}
                        className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleFeatured(project._id, !project.featured)}
                        className={`px-2 py-1 rounded text-xs ${
                          project.featured 
                            ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                            : 'bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        {project.featured ? 'Unfeature' : 'Feature'}
                      </button>
                      <button
                        onClick={() => remove(project._id)}
                        className="px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={() => move(project._id, -1)}
                        className="px-1 py-1 rounded bg-white/10 hover:bg-white/20 text-xs"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => move(project._id, 1)}
                        className="px-1 py-1 rounded bg-white/10 hover:bg-white/20 text-xs"
                        title="Move down"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {filteredItems.length > 0 && (
            <div className="flex items-center justify-center">
              <PaginationControls 
                items={filteredItems} 
                page={page} 
                pageSize={pageSize} 
                onPageChange={setPage} 
              />
            </div>
          )}

          {filteredItems.length === 0 && !loading && (
            <div className="text-center py-8 text-white/60">
              No projects found matching your filters.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function reorder(list: Project[], id: string, dir: number): Project[] {
  const idx = list.findIndex(x => x._id === id)
  if (idx < 0) return list
  const to = idx + dir
  if (to < 0 || to >= list.length) return list
  const copy = list.slice()
  const [item] = copy.splice(idx, 1)
  copy.splice(to, 0, item)
  return copy
}

function paginate<T>(arr: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize
  return arr.slice(start, start + pageSize)
}

function PaginationControls({ 
  items, 
  page, 
  pageSize, 
  onPageChange 
}: { 
  items: any[]
  page: number
  pageSize: number
  onPageChange: (p: number) => void 
}) {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  
  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span className="text-white/60 px-3">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  )
}