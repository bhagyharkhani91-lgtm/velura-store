import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/Button/Button';
import { Modal } from '../../../components/ui/Modal/Modal';
import { Input } from '../../../components/ui/Input/Input';
import { Search, Loader2 } from 'lucide-react';
import { DEFAULT_ROLES } from '../../../rbac/roles';
import { useUsersStore } from '../../../stores/usersStore';

export function AdminUsersPage() {
  const { users, isLoading, fetchUsers, updateUser, deleteUser, addUser } = useUsersStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<'customer' | 'admin'>('customer');
  const [isSaving, setIsSaving] = useState(false);

  // Add state
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'customer' | 'admin'>('customer');
  const [isAddingUser, setIsAddingUser] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (user.email?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    
    const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  const handleEditClick = (user: any) => {
    setEditingId(user.id);
    setEditingRole(user.role);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async (id: string) => {
    setIsSaving(true);
    await updateUser(id, { role: editingRole });
    setIsSaving(false);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user profile? This action cannot be undone.')) {
      await deleteUser(id);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    setIsAddingUser(true);
    await addUser({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
    });
    
    setIsAddingUser(false);
    setIsAddUserModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('customer');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="heading-3xl">Users Management</h1>
        <Button onClick={() => setIsAddUserModalOpen(true)}>Add User</Button>
      </div>

      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-secondary border border-border rounded-md pl-10 pr-4 py-2 text-primary focus:outline-none focus:border-accent"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-bg-secondary border border-border rounded-md px-4 py-2 text-primary focus:outline-none focus:border-accent"
            >
              <option value="All Roles">All Roles</option>
              {DEFAULT_ROLES.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-bg-secondary text-secondary text-sm border-b border-border">
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Joined</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-secondary">
                    <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                    <p>Loading users...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-secondary">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  const isEditing = editingId === user.id;

                  return (
                    <tr key={user.id} className="border-b border-border hover:bg-bg-hover transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-accent-subtle text-accent rounded-full flex items-center justify-center flex-shrink-0 font-display font-bold">
                            {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-medium text-primary">{user.name || 'Unknown User'}</p>
                            <p className="text-xs text-secondary">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {isEditing ? (
                          <select 
                            value={editingRole}
                            onChange={(e) => setEditingRole(e.target.value as 'customer' | 'admin')}
                            className="bg-bg-secondary border border-border rounded-md px-2 py-1 text-primary focus:outline-none focus:border-accent text-sm"
                          >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <span className={`text-xs px-2 py-1 rounded capitalize ${user.role === 'admin' ? 'bg-accent-subtle text-accent' : 'bg-bg-secondary text-secondary'}`}>
                            {user.role}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-secondary">{formatDate(user.created_at)}</td>
                      <td className="p-4">
                        <span className="text-xs bg-success-muted text-success px-2 py-1 rounded">Active</span>
                      </td>
                      <td className="p-4 text-right">
                        {isEditing ? (
                          <div className="flex justify-end gap-2">
                            <Button variant="primary" size="sm" onClick={() => handleSaveEdit(user.id)} disabled={isSaving}>
                              Save
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={isSaving}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditClick(user)}>
                              Edit
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>
                              Delete
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title="Add New User"
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          <Input
            label="Name"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="Enter full name"
            required
          />
          
          <Input
            label="Email Address"
            type="email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            placeholder="Enter email address"
            required
          />
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Role
            </label>
            <select
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value as 'customer' | 'admin')}
              className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2 text-primary focus:outline-none focus:border-accent"
              required
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddUserModalOpen(false)}
              disabled={isAddingUser}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isAddingUser || !newUserName.trim() || !newUserEmail.trim()}
            >
              {isAddingUser ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Saving...
                </>
              ) : (
                'Add User'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
