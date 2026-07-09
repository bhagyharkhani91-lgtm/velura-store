import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button/Button';
import { Input } from '../../../components/ui/Input/Input';
import { Save, Trash2, CloudUpload, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import { useSettingsStore, type HeroBanner } from '../../../stores/settingsStore';
import { useUIStore } from '../../../stores/uiStore';

export function AdminSettingsPage() {
  const { 
    promoMessages, 
    setPromoMessages,
    contactTitle,
    contactDescription,
    contactEmail,
    contactPhone,
    contactAddress,
    contactHours,
    setContactInfo,
    returnPolicy,
    setReturnPolicy,
    heroBanners,
    setHeroBanners
  } = useSettingsStore();
  const { addToast } = useUIStore();
  
  const [messagesText, setMessagesText] = useState(promoMessages.join('\n'));
  const [titleText, setTitleText] = useState(contactTitle);
  const [descriptionText, setDescriptionText] = useState(contactDescription);
  const [emailText, setEmailText] = useState(contactEmail);
  const [phoneText, setPhoneText] = useState(contactPhone);
  const [addressText, setAddressText] = useState(contactAddress);
  const [hoursText, setHoursText] = useState(contactHours);
  const [returnPolicyText, setReturnPolicyText] = useState(returnPolicy);
  const [heroBannersText, setHeroBannersText] = useState<HeroBanner[]>(heroBanners || []);

  useEffect(() => {
    if (heroBanners) {
      setHeroBannersText(heroBanners);
    }
  }, [heroBanners]);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroBannersText(prev => [...prev, {
          id: `banner-${Date.now()}-${index}`,
          url: reader.result as string,
          isActive: true
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const moveBanner = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === heroBannersText.length - 1) return;

    const newBanners = [...heroBannersText];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newBanners[index], newBanners[swapIndex]] = [newBanners[swapIndex], newBanners[index]];
    setHeroBannersText(newBanners);
  };

  const toggleBanner = (index: number) => {
    const newBanners = [...heroBannersText];
    newBanners[index].isActive = !newBanners[index].isActive;
    setHeroBannersText(newBanners);
  };

  const handleSave = () => {
    const newMessages = messagesText
      .split('\n')
      .map(m => m.trim())
      .filter(m => m.length > 0);
    
    setPromoMessages(newMessages);
    setContactInfo({
      contactTitle: titleText,
      contactDescription: descriptionText,
      contactEmail: emailText,
      contactPhone: phoneText,
      contactAddress: addressText,
      contactHours: hoursText
    });
    setReturnPolicy(returnPolicyText);
    setHeroBanners(heroBannersText);

    addToast({ 
      type: 'success', 
      title: 'Settings Saved', 
      message: 'Store settings and contact details have been updated successfully.' 
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="heading-3xl">Store Settings (CMS)</h1>
        <Button onClick={handleSave} leftIcon={<Save size={18} />}>Save Changes</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* General Information Card */}
          <div className="bg-surface rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4 text-primary">General Information</h2>
            <div className="flex flex-col gap-4">
              <Input label="Store Name" value="VELURA" disabled />
            </div>
          </div>

          {/* Contact Us Page Header Card */}
          <div className="bg-surface rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4 text-primary">Contact Us Page Header</h2>
            <div className="flex flex-col gap-4">
              <Input 
                label="Contact Title" 
                value={titleText} 
                onChange={(e) => setTitleText(e.target.value)} 
              />
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Contact Description</label>
                <textarea 
                  className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2 text-primary focus:outline-none focus:border-accent"
                  rows={3}
                  value={descriptionText}
                  onChange={(e) => setDescriptionText(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="bg-surface rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4 text-primary">Contact Details</h2>
            <div className="flex flex-col gap-4">
              <Input 
                label="Contact Email" 
                type="email" 
                value={emailText} 
                onChange={(e) => setEmailText(e.target.value)} 
              />
              <Input 
                label="Phone Number" 
                value={phoneText} 
                onChange={(e) => setPhoneText(e.target.value)} 
              />
              <Input 
                label="Physical Address" 
                value={addressText} 
                onChange={(e) => setAddressText(e.target.value)} 
              />
              <Input 
                label="Support Hours" 
                value={hoursText} 
                onChange={(e) => setHoursText(e.target.value)} 
              />
            </div>
          </div>

          <div className="bg-surface rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4 text-primary">Promo Banner Configuration</h2>
            <p className="text-sm text-secondary mb-4">Add up to 3 lines of text to display in the sliding top banner. Put each message on a new line.</p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Promo Messages (One per line)</label>
                <textarea 
                  className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2 text-primary focus:outline-none focus:border-accent"
                  rows={4}
                  value={messagesText}
                  onChange={(e) => setMessagesText(e.target.value)}
                  placeholder="e.g. 50% DISCOUNT ON ALL PRODUCTS&#10;CASH ON DELIVERY AVAILABLE"
                />
              </div>
            </div>
          </div>
          <div className="bg-surface rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4 text-primary">Hero Banner Configuration</h2>
            <p className="text-sm text-secondary mb-4">Upload banner images to display in the top carousel. Recommended size: 1920x1080 (16:9 aspect ratio). If left empty, default images will be used.</p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Banner Images</label>
                
                {heroBannersText && heroBannersText.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {heroBannersText.map((banner, index) => (
                      <div key={banner?.id || index} className={`relative aspect-video border ${banner?.isActive ? 'border-accent' : 'border-border opacity-60'} rounded-lg overflow-hidden bg-bg-secondary group`}>
                        <img src={banner?.url} alt={`Banner ${index + 1}`} className="w-full h-full object-cover" />
                        
                        {/* Overlay Controls */}
                        <div className="absolute inset-0 bg-black-80 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                          <div className="flex justify-between">
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => moveBanner(index, 'up')}
                                disabled={index === 0}
                                className="bg-surface text-primary rounded-md p-1.5 shadow-md hover:bg-bg-hover disabled:opacity-30 transition-colors"
                              >
                                <ArrowUp size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveBanner(index, 'down')}
                                disabled={index === heroBannersText.length - 1}
                                className="bg-surface text-primary rounded-md p-1.5 shadow-md hover:bg-bg-hover disabled:opacity-30 transition-colors"
                              >
                                <ArrowDown size={16} />
                              </button>
                            </div>
                            <button 
                              type="button" 
                              onClick={() => {
                                setHeroBannersText(prev => prev.filter((_, i) => i !== index));
                              }}
                              className="bg-error/90 text-white rounded-md p-1.5 shadow-md hover:bg-error transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="flex justify-center">
                             <button
                                type="button"
                                onClick={() => toggleBanner(index)}
                                className="bg-surface text-primary rounded-md px-3 py-1.5 shadow-md hover:bg-bg-hover transition-colors flex items-center gap-2 text-sm font-medium"
                              >
                                {banner.isActive ? (
                                  <><Eye size={16} /> Active</>
                                ) : (
                                  <><EyeOff size={16} /> Inactive</>
                                )}
                              </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <label 
                  className="relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors min-h-[120px] cursor-pointer hover:bg-bg-hover"
                  style={{ borderColor: '#60A5FA', backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                >
                  <div className="text-center">
                    <CloudUpload size={28} className="mx-auto mb-2" style={{ color: '#3B82F6' }} />
                    <p className="text-sm font-medium" style={{ color: '#9CA3AF' }}>
                      Drag & Drop images or <span style={{ color: '#3B82F6', textDecoration: 'underline' }}>Browse</span>
                    </p>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleBannerUpload}
                  />
                </label>
              </div>
            </div>
          </div>
          
          <div className="bg-surface rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4 text-primary">Return and Exchange Policy</h2>
            <p className="text-sm text-secondary mb-4">Update the return and exchange policy displayed to customers on the site.</p>
            <div className="flex flex-col gap-4">
              <div>
                <textarea 
                  className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2 text-primary focus:outline-none focus:border-accent"
                  rows={8}
                  value={returnPolicyText}
                  onChange={(e) => setReturnPolicyText(e.target.value)}
                  placeholder="Enter the complete return and exchange policy here..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-surface rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4 text-primary">Store Status</h2>
            <div className="flex items-center justify-between p-4 border border-border rounded-md">
              <div>
                <p className="font-medium text-primary">Maintenance Mode</p>
                <p className="text-xs text-secondary">Hide store from public</p>
              </div>
              <div className="w-12 h-6 bg-bg-secondary rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-secondary rounded-full absolute top-1 left-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
