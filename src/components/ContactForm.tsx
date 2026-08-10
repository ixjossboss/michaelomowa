import React, { useState } from 'react';
import { Send, CheckCircle, MailCheck, ShieldCheck, Heart } from 'lucide-react';
import { ContactMessage } from '../types';

interface ContactFormProps {
  onNewMessage: (msg: ContactMessage) => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onNewMessage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [autoResponseText, setAutoResponseText] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) return;

    setSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      const newMessage: ContactMessage = {
        id: `msg-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        timestamp: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        status: 'unread',
        automatedReplySent: true
      };

      // Store in local storage logs
      onNewMessage(newMessage);

      // Setup simulated auto-reply content dynamically
      setAutoResponseText(`Hello, ${formData.name}! 

Thank you for reaching out to me via my online portfolio. 

Your message holding the subject "${formData.subject}" has successfully routed to my personal inbox at omowamichaela@gmail.com.

I prioritize strategic response and professional active listening structures. I will review your inquiry and follow up within 24 business hours.

In the meantime, feel free to view my CV, explore my GitHub repositories (github.com/ixjossboss), or connect directly on LinkedIn (linkedin.com/in/michaelomowa).

Best regards,
Michael Omowa
Project Management & Business Analysis Professional`);

      setSubmitting(false);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8 animate-scale-up">
      {!success ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-center md:text-left mb-4">
            <h3 className="text-lg font-bold text-slate-900">Send an Inquiry</h3>
            <p className="text-xs text-slate-500 mt-1">
              Have a collaborative project, job opportunity, or advisory query? Drop me a direct notice.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="form-name" className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Your Full Name
              </label>
              <input
                id="form-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="E.g., Sarah Johnson"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-primary focus:bg-white dark:focus:bg-slate-950 focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 transition outline-none"
              />
            </div>
            <div>
              <label htmlFor="form-email" className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                id="form-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="E.g., sarah@company.com"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-primary focus:bg-white dark:focus:bg-slate-950 focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 transition outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="form-subject" className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Subject Header
            </label>
            <input
              id="form-subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="Collaboration opportunity, recruiter inquiry, financial query etc."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-primary focus:bg-white dark:focus:bg-slate-950 focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 transition outline-none"
            />
          </div>

          <div>
            <label htmlFor="form-message" className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Detailed Message
            </label>
            <textarea
              id="form-message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Please elaborate on your query or outline your objectives..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-primary focus:bg-white dark:focus:bg-slate-950 focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-xs text-slate-800 dark:text-slate-100 transition outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full flex items-center justify-center gap-2 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition cursor-pointer shadow-md glow-btn-primary ${
              submitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark hover:shadow-lg'
            }`}
          >
            {submitting ? (
              <span className="flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-200" />
                <span>Dispatching Inquiry...</span>
              </span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="text-center py-6 space-y-4 animate-scale-up">
          <div className="inline-flex items-center justify-center bg-blue-50 text-primary w-14 h-14 rounded-full border-4 border-blue-100 mb-2">
            <CheckCircle className="w-7 h-7" />
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-slate-900">Inquiry Transmitted Successfully</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Your message was received and saved. Below is a simulation of the automated response dispatching to your email address:
            </p>
          </div>

          {/* Autoreply panel simulating email */}
          <div className="bg-slate-900 rounded-xl p-4 text-left font-mono text-[11px] text-slate-300 max-w-lg mx-auto relative overflow-hidden border border-slate-800 shadow-inner">
            <div className="absolute top-2 right-2 flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span className="w-2 h-2 bg-green-500 rounded-full" />
            </div>
            
            {/* Mock mail details */}
            <div className="border-b border-slate-800 pb-2 mb-2 text-slate-500 space-y-0.5">
              <div><span className="text-primary-light">From:</span> autoresponse@omowamichaela.com</div>
              <div><span className="text-primary-light">To:</span> {formData.email || 'Visitor'}</div>
              <div><span className="text-primary-light">Subject:</span> Automatic Reply: message received</div>
            </div>

            <p className="whitespace-pre-line text-slate-200 leading-relaxed overflow-x-auto text-[10px] md:text-[11px]">
              {autoResponseText}
            </p>
          </div>

          <button
            onClick={() => {
              setSuccess(false);
              setAutoResponseText('');
            }}
            className="text-xs text-primary font-bold hover:underline transition mt-2 cursor-pointer inline-flex items-center gap-1 bg-primary-light px-4 py-2 rounded-full"
          >
            <span>Send another msg</span>
            <MailCheck className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
