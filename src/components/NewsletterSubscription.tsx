import React, { useState } from 'react';
import { Mail, Check, ToggleLeft, ToggleRight, ArrowRight, Rss, Info, CloudLightning } from 'lucide-react';
import { NewsletterSubscriber } from '../types';

interface NewsletterSubscriptionProps {
  onSubscribe: (subscriber: NewsletterSubscriber) => void;
  mailchimpEnabled: boolean;
  onToggleMailchimp: () => void;
}

export const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({
  onSubscribe,
  mailchimpEnabled,
  onToggleMailchimp
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);

    // Simulate database submission
    setTimeout(() => {
      const newSubscriber: NewsletterSubscriber = {
        email,
        subscribedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        active: true
      };

      onSubscribe(newSubscriber);
      setLoading(false);
      setSuccess(true);
      setEmail('');
      
      // Clear success state after 4 seconds
      setTimeout(() => setSuccess(false), 4000);
    }, 1000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 md:p-8 animate-scale-up relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute right-0 top-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute left-1/3 bottom-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />

      <div className="space-y-4">
        {/* Toggle Panel at top */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <Rss className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Growth Dispatch Feed</span>
          </div>

          {/* Mailchimp live toggle integration */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
              <CloudLightning className={`w-3 h-3 ${mailchimpEnabled ? 'text-primary' : 'text-slate-600'}`} />
              Mailchimp Sandbox Sync:
            </span>
            <button
              onClick={onToggleMailchimp}
              className="text-slate-400 hover:text-white transition focus:outline-none cursor-pointer"
              title={mailchimpEnabled ? 'Mailchimp connected (simulated)' : 'Local only storage'}
            >
              {mailchimpEnabled ? (
                <ToggleRight className="w-9 h-6 text-primary" />
              ) : (
                <ToggleLeft className="w-9 h-6 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div>
          <h4 className="text-base font-bold text-white tracking-tight">Subscribe to Michael's Growth Insights</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-lg leading-relaxed">
            Get monthly case studies detailing strategic planning metrics, academic teamwork protocols, and financial literacy updates.
          </p>
        </div>

        {/* Form or Success state */}
        {!success ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mt-4">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email (e.g. you@domain.com)"
                className="w-full bg-slate-950 border border-slate-800 focus:border-primary focus:ring-1 focus:ring-primary text-slate-200 text-xs rounded-xl pl-10 pr-4 py-3 placeholder-slate-600 transition outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-6 py-3 rounded-xl transition flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-md"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Join dispatch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center gap-3 text-slate-300 animate-scale-up text-xs">
            <div className="bg-blue-900/40 text-primary p-1.5 rounded-full">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">Successfully Subscribed!</p>
              <p className="text-[10px] text-slate-400">
                {mailchimpEnabled 
                  ? 'Your mail queued instantly into the Mailchimp audience sandbox.' 
                  : 'Your address has been saved locally. Export logs anytime in the Admin Panel.'}
              </p>
            </div>
          </div>
        )}

        {/* Sync Info Banner */}
        {mailchimpEnabled && (
          <div className="flex items-start gap-1.5 text-[10px] text-slate-500 leading-normal mt-1 bg-slate-950/40 p-2.5 rounded-lg border border-slate-950">
            <Info className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
            <p>
              Active Toggle Integration: Addresses successfully simulate full API handshakes to double-opt-in Mailchimp mailing registers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
