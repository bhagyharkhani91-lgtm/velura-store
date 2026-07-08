import { useState, type FormEvent } from 'react';
import { Mail, Phone, MapPin, Clock, Send, ShieldCheck } from 'lucide-react';
import { Container } from '../../../components/layout/Container/Container';
import { Button } from '../../../components/ui/Button/Button';
import { Input } from '../../../components/ui/Input/Input';
import { useSettingsStore } from '../../../stores/settingsStore';
import { useUIStore } from '../../../stores/uiStore';
import { useMessagesStore } from '../../../stores/messagesStore';
import './ContactPage.css';

export function ContactPage() {
  const {
    contactTitle,
    contactDescription,
    contactEmail,
    contactPhone,
    contactAddress,
    contactHours
  } = useSettingsStore();

  const { addToast } = useUIStore();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState(''); // Anti-spam honeypot

  const { sendMessage } = useMessagesStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields.'
      });
      return;
    }

    setIsSubmitting(true);

    // Honeypot check: If bot filled the hidden field, pretend it succeeded
    if (honeypot) {
      setTimeout(() => {
        setIsSubmitting(false);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        addToast({
          type: 'success',
          title: 'Message Sent',
          message: 'Your message has been sent successfully. We will reply discreetly within 24 hours.'
        });
      }, 500);
      return;
    }

    try {
      await sendMessage(name, email, subject, message);
      
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      
      addToast({
        type: 'success',
        title: 'Message Sent',
        message: 'Your message has been sent successfully. We will reply discreetly within 24 hours.'
      });
    } catch (error: any) {
      console.error("Failed to send message:", error);
      const isRateLimit = error?.message?.includes('Too many requests') || error?.code === 'P0001';
      
      addToast({
        type: 'error',
        title: isRateLimit ? 'Too Many Requests' : 'Sending Failed',
        message: isRateLimit 
          ? 'You have sent too many messages recently. Please try again later.' 
          : (error?.message || 'Please run the supabase_messages.sql script in your Supabase SQL editor to create the table.')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page-wrapper">
      <div className="contact-hero-glow" />
      
      <Container className="contact-container">
        {/* Header Section */}
        <div className="contact-header">
          <h1 className="contact-title">{contactTitle}</h1>
          <p className="contact-subtitle">{contactDescription}</p>
        </div>

        {/* Content Layout */}
        <div className="contact-grid">
          {/* Contact Details Cards */}
          <div className="contact-info-section">
            <div className="contact-info-cards">
              {/* Phone Card */}
              <div className="contact-card glass-card">
                <div className="card-icon-container">
                  <Phone size={24} className="card-icon" />
                </div>
                <div className="card-content">
                  <h3 className="card-title">Call Us</h3>
                  <a href={`tel:${contactPhone}`} className="card-link">{contactPhone}</a>
                  <p className="card-subtext">Direct concierge support</p>
                </div>
              </div>

              {/* Email Card */}
              <div className="contact-card glass-card">
                <div className="card-icon-container">
                  <Mail size={24} className="card-icon" />
                </div>
                <div className="card-content">
                  <h3 className="card-title">Email Us</h3>
                  <a href={`mailto:${contactEmail}`} className="card-link">{contactEmail}</a>
                  <p className="card-subtext">Replies within 24 business hours</p>
                </div>
              </div>

              {/* Hours Card */}
              <div className="contact-card glass-card">
                <div className="card-icon-container">
                  <Clock size={24} className="card-icon" />
                </div>
                <div className="card-content">
                  <h3 className="card-title">Business Hours</h3>
                  <p className="card-text">{contactHours}</p>
                  <p className="card-subtext">Standard operating times</p>
                </div>
              </div>

              {/* Address Card */}
              <div className="contact-card glass-card">
                <div className="card-icon-container">
                  <MapPin size={24} className="card-icon" />
                </div>
                <div className="card-content">
                  <h3 className="card-title">Headquarters</h3>
                  <p className="card-text">{contactAddress}</p>
                  <p className="card-subtext">Corporate offices</p>
                </div>
              </div>
            </div>

            {/* Privacy Promise Notice */}
            <div className="privacy-promise glass-card">
              <div className="promise-header">
                <ShieldCheck size={20} className="promise-icon" />
                <h4 className="promise-title">OUR DISCRETION PROMISE</h4>
              </div>
              <p className="promise-text">
                Your privacy is our utmost priority. All email correspondences, support queries, and billing charges are handled with strict confidentiality. Deliveries are shipped in completely unmarked, plain packaging with no mention of Velura.
              </p>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="contact-form-section glass-card">
            <h2 className="form-section-title">Send a Message</h2>
            <p className="form-section-subtitle">Use the form below to reach out to our team directly.</p>

            <form onSubmit={handleSubmit} className="contact-form">
              {/* Anti-spam honeypot field (hidden from real users) */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  tabIndex={-1}
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <Input
                label="Full Name"
                placeholder="Enter your name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />

              <Input
                label="Subject"
                placeholder="What is this regarding?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={isSubmitting}
              />

              <div className="textarea-wrapper">
                <label className="textarea-label">Your Message <span className="required-star">*</span></label>
                <textarea
                  className="contact-textarea"
                  placeholder="Type your message here..."
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <Button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
                leftIcon={<Send size={18} />}
              >
                {isSubmitting ? 'Sending Message...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
