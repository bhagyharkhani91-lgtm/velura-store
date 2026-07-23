import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button/Button';
import { Input } from '../../../components/ui/Input/Input';
import { Save, Trash2, CloudUpload, Eye, EyeOff, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { useSettingsStore, type HeroBanner, type PurchaseNotification } from '../../../stores/settingsStore';
import { useProductStore } from '../../../stores/productStore';
import { useUIStore } from '../../../stores/uiStore';
import { validateImageUpload, uploadToCloudinary } from '../../../utils';

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
    setHeroBanners,
    purchaseNotifications,
    setPurchaseNotifications
  } = useSettingsStore();
  const { addToast } = useUIStore();
  const { products } = useProductStore();

  const [messagesText, setMessagesText] = useState(promoMessages.join('\n'));
  const [titleText, setTitleText] = useState(contactTitle);
  const [descriptionText, setDescriptionText] = useState(contactDescription);
  const [emailText, setEmailText] = useState(contactEmail);
  const [phoneText, setPhoneText] = useState(contactPhone);
  const [addressText, setAddressText] = useState(contactAddress);
  const [hoursText, setHoursText] = useState(contactHours);
  const [returnPolicyText, setReturnPolicyText] = useState(returnPolicy);
  const [heroBannersText, setHeroBannersText] = useState<HeroBanner[]>(heroBanners || []);
  const [notifList, setNotifList] = useState<PurchaseNotification[]>(purchaseNotifications || []);

  useEffect(() => {
    if (heroBanners) {
      setHeroBannersText(heroBanners);
    }
  }, [heroBanners]);

  useEffect(() => {
    setNotifList(purchaseNotifications || []);
  }, [purchaseNotifications]);

  const addNotification = () => {
    setNotifList(prev => [
      ...prev,
      {
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        productId: '',
        message: '',
        isActive: true
      }
    ]);
  };

  const updateNotification = (id: string, patch: Partial<PurchaseNotification>) => {
    setNotifList(prev => prev.map(n => (n.id === id ? { ...n, ...patch } : n)));
  };

  const removeNotification = (id: string) => {
    setNotifList(prev => prev.filter(n => n.id !== id));
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    let hasError = false;
    
    files.forEach((file, index) => {
      const { isValid, error } = validateImageUpload(file);
      
      if (!isValid) {
        alert(error);
        hasError = true;
        return;
      }
      
      uploadToCloudinary(file).then(result => {
        setHeroBannersText(prev => [...prev, {
          id: `banner-${Date.now()}-${index}`,
          url: result.url,
          isActive: true
        }]);
      }).catch(err => {
        alert('Image upload failed: ' + err.message);
      });
    });
    
    if (hasError && e.target) {
      e.target.value = '';
    }
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

    const cleanNotifs = notifList
      .map(n => ({ ...n, message: n.message.trim() }))
      .filter(n => n.productId && n.message);
    setPurchaseNotifications(cleanNotifs);

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
               <Input label="Store Name" value="PERSONAL CARE" disabled />
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

          {/* Recent Purchase Notification (Admin-controlled social proof) */}
          <div className="bg-surface rounded-lg p-6 border border-border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-primary">Recent Purchase Notification</h2>
                <p className="text-sm text-secondary mt-1">Choose a product and write the purchase message customers will see in a small popup at the bottom-left of the home page. These are manual entries — they are not linked to real orders. Add as many as you like; the storefront will rotate through the active ones.</p>
              </div>
              <button
                type="button"
                onClick={addNotification}
                className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-bg-secondary hover:bg-bg-hover text-sm font-medium text-primary transition-colors whitespace-nowrap"
              >
                <Plus size={16} /> Add
              </button>
            </div>

            {notifList.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-border rounded-md">
                <p className="text-secondary text-sm">No notifications yet. Click "Add" to create one.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {notifList.map((n, index) => (
                  <div key={n.id} className="border border-border rounded-md p-4 bg-bg-secondary/30">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Notification {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeNotification(n.id)}
                        className="text-error hover:bg-error/10 rounded-md p-1.5 transition-colors"
                        aria-label="Delete notification"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-1">Product</label>
                        <select
                          className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2 text-primary focus:outline-none focus:border-accent"
                          value={n.productId}
                          onChange={(e) => updateNotification(n.id, { productId: e.target.value })}
                        >
                          <option value="">-- Select a product --</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                      <Input
                        label="Purchase Message"
                        value={n.message}
                        onChange={(e) => updateNotification(n.id, { message: e.target.value })}
                        placeholder="e.g. Someone from Mumbai bought this 5 minutes ago"
                      />
                      <div className="flex items-center justify-between p-3 border border-border rounded-md">
                        <div>
                          <p className="font-medium text-primary text-sm">Active</p>
                          <p className="text-xs text-secondary">When enabled, this popup can appear to visitors on the home page.</p>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={n.isActive}
                          onClick={() => updateNotification(n.id, { isActive: !n.isActive })}
                          className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ease-in-out flex items-center ${n.isActive ? 'bg-accent' : 'bg-bg-secondary'}`}
                        >
                          <span
                            className={`inline-block w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out translate-x-0.5 ${n.isActive ? 'translate-x-6' : 'translate-x-0.5'}`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
