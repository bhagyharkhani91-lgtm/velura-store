import { useState } from 'react';
import { Button } from '../../../components/ui/Button/Button';
import { Input } from '../../../components/ui/Input/Input';
import { Save } from 'lucide-react';
import { useSettingsStore } from '../../../stores/settingsStore';
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
    setReturnPolicy
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
