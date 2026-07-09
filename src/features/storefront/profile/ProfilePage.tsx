import { useState, useRef } from 'react';
import { Container } from '../../../components/layout/Container/Container';
import { useAuthStore } from '../../../stores/authStore';
import { Input } from '../../../components/ui/Input/Input';
import { Button } from '../../../components/ui/Button/Button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
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
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      const result = await updateProfile({ avatarUrl: data.publicUrl });
      if (result.error) throw result.error;
      
    } catch (err: any) {
      setError(err.message || 'Error uploading avatar. Make sure the "avatars" storage bucket exists.');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Container className="py-16">
      <div className="profile-page-header mb-12">
        <h1 className="heading-4xl">Hi, {user.name || 'User'}</h1>
      </div>

      <div className="profile-content grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24 max-w-6xl mx-auto mt-8">
        <div className="md:col-span-1">
          <div className="profile-card h-full justify-start pt-16 pb-16">
            <div className="profile-avatar-large relative">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover rounded-full" />
              ) : null}
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-8" 
              onClick={triggerFileInput}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Change Photo'}
            </Button>

            <p className="text-secondary text-base mt-8">{user.email}</p>
            <p className="text-secondary text-base mt-4 capitalize">{user.role === 'admin' ? 'administrator' : 'customer'}</p>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="profile-details-card">
            <h3 className="text-lg font-medium text-secondary mb-8">Personal Details</h3>
            
            {error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md text-lg">
                {error}
              </div>
            )}

            <form className="space-y-8 max-w-xl" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-6">
                <Input 
                  label="Full Name" 
                  name="name"
                  inputSize="lg"
                  value={isEditing ? formData.name : (user.name || '')} 
                  onChange={handleChange}
                  disabled={!isEditing} 
                />
                <Input 
                  label="Email" 
                  type="email" 
                  inputSize="lg"
                  value={user.email} 
                  disabled 
                />
                <Input 
                  label="Phone" 
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

              <div className="pt-8 flex justify-center">
                {isEditing ? (
                  <div className="flex gap-4">
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
                  </div>
                ) : (
                  <Button variant="outline" size="lg" onClick={handleEditClick}>
                    Edit Details
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
