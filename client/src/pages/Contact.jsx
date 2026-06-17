import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { contactAPI } from '../services/api';
import { IMAGES } from '../utils/images';

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await contactAPI.send(data);
      toast.success('Message sent! We\'ll get back to you within 24 hours.');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    }
  };

  const contactInfo = [
    { icon: MapPin, label: 'Visit Us', value: '123 Travel Street, New York, NY 10001' },
    { icon: Phone, label: 'Call Us', value: '+1 (555) 123-4567' },
    { icon: Mail, label: 'Email Us', value: 'info@wanderlux.com' },
    { icon: Clock, label: 'Working Hours', value: 'Mon - Fri: 9AM - 6PM EST' },
  ];

  return (
    <div className="bg-light">
      <PageHeader
        title="Get in Touch"
        subtitle="Tell us where you want to go. Our travel specialists will help shape the route, rhythm, and details."
        image={IMAGES.contact}
      />

      <section className="section-padding">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.72fr]">
            <div className="card-premium p-6 sm:p-8 lg:p-10">
              <span className="section-label">Start Planning</span>
              <h2 className="font-display text-3xl font-semibold text-primary">Send a Message</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
                Share a few notes about your trip and we will respond with helpful next steps.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase text-slate-500">Full Name</label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      className="input-field"
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase text-slate-500">Email</label>
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                      })}
                      type="email"
                      className="input-field"
                      placeholder="you@email.com"
                    />
                    {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase text-slate-500">Phone (optional)</label>
                  <input {...register('phone')} className="input-field" placeholder="+1 (555) 000-0000" />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase text-slate-500">Message</label>
                  <textarea
                    {...register('message', { required: 'Message is required' })}
                    rows={6}
                    className="input-field resize-none"
                    placeholder="Tell us about your dream vacation..."
                  />
                  {errors.message && <p className="mt-1.5 text-xs text-red-500">{errors.message.message}</p>}
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-primary w-full sm:w-auto">
                  <Send size={17} />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            <aside className="space-y-5">
              {contactInfo.map(({ icon: Icon, label, value }) => (
                <article key={label} className="card p-5">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                      <Icon size={21} />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
                      <p className="mt-1 text-sm font-semibold leading-relaxed text-primary">{value}</p>
                    </div>
                  </div>
                </article>
              ))}

              <div className="card h-72">
                <iframe
                  title="Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425878459418!3d40.74076684379132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1635959227100!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
