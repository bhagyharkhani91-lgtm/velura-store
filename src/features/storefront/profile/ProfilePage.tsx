import { useState } from 'react';
import { Container } from '../../../components/layout/Container/Container';
import { useAuthStore } from '../../../stores/authStore';
import { Input } from '../../../components/ui/Input/Input';
import { Button } from '../../../components/ui/Button/Button';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

export function ProfilePage() {
  const { user, isAuthenticated, isLoading, updateProfile } = useAuthStore();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dateOfBirth: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form data when user is loaded
  if (user && formData.name === '' && !isEditing) {
    setFormData({
      name: user.name || '',
      phone: user.phone || '',
      dateOfBirth: user.dateOfBirth || ''
    });
  }

  if (isLoading) {
    return <Container className="py-24 text-center"><div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div></Container>;
  }

  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  const handleEditClick = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData({
      name: user.name || '',
      phone: user.phone || '',
      dateOfBirth: user.dateOfBirth || ''
    });
    setError(null);
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    setError(null);
    const result = await updateProfile(formData);
    setIsSaving(false);
    
    if (result.error) {
      setError(result.error.message || 'Failed to update profile');
    } else {
      setIsEditing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Container className="py-16">
      <div className="profile-page-header mb-12">
        <h1 className="heading-4xl">My Profile</h1>
        <p className="text-secondary text-lg mt-3">Manage your personal information and preferences.</p>
      </div>

      <div className="profile-content grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1">
          <div className="profile-card">
            <div className="profile-avatar-large">
              {user.name?.charAt(0) || 'U'}
            </div>
            <h3 className="text-2xl font-bold mt-6">{user.name}</h3>
            <p className="text-secondary text-base mt-2">{user.email}</p>
            <span className="badge mt-5" style={{ background: 'var(--color-accent-subtle)', color: '#fff', padding: '6px 16px', borderRadius: '6px', fontSize: '14px' }}>
              {user.role === 'admin' ? 'Administrator' : 'Customer'}
            </span>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="profile-details-card">
            <h3 className="text-2xl font-semibold mb-8 border-b border-border pb-4">Personal Details</h3>
            
            {error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md text-lg">
                {error}
              </div>
            )}

            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input 
                  label="Full Name" 
                  name="name"
                  inputSize="lg"
                  value={isEditing ? formData.name : (user.name || '')} 
                  onChange={handleChange}
                  disabled={!isEditing} 
                />
                <Input 
                  label="Email Address" 
                  type="email" 
                  inputSize="lg"
                  value={user.email} 
                  disabled 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input 
                  label="Phone Number" 
                  name="phone"
                  inputSize="lg"
                  value={isEditing ? formData.phone : (user.phone || 'Not provided')} 
                  onChange={handleChange}
                  disabled={!isEditing} 
                />
                <Input 
                  label="Date of Birth" 
                  type="date"
                  name="dateOfBirth"
                  inputSize="lg"
                  value={isEditing ? formData.dateOfBirth : (user.dateOfBirth || 'Not provided')} 
                  onChange={handleChange}
                  disabled={!isEditing} 
                />
              </div>

              <div className="pt-6 mt-8 border-t border-border flex gap-4">
                {isEditing ? (
                  <>
                    <Button 
                      variant="primary" 
                      size="lg"
                      onClick={handleSaveClick}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={handleCancelClick}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="lg" onClick={handleEditClick}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
}
