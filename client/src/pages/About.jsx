import { motion } from 'framer-motion';
import { Award, Eye, Globe, Heart, Shield, Target } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionHeader from '../components/SectionHeader';
import { IMAGES, unsplash } from '../utils/images';

const About = () => {
  const stats = [
    { value: '15+', label: 'Years Experience' },
    { value: '50K+', label: 'Happy Travelers' },
    { value: '200+', label: 'Destinations' },
    { value: '98%', label: 'Satisfaction Rate' },
  ];

  const team = [
    { name: 'Sarah Mitchell', role: 'CEO & Founder', image: IMAGES.team[0] },
    { name: 'David Chen', role: 'Head of Operations', image: IMAGES.team[1] },
    { name: 'Elena Rodriguez', role: 'Travel Curator', image: IMAGES.team[2] },
    { name: 'James Wilson', role: 'Customer Experience', image: IMAGES.team[3] },
  ];

  const trustPoints = [
    { icon: Shield, title: 'Licensed & Insured', desc: 'Comprehensive protection and clear booking terms for confident travel.' },
    { icon: Award, title: 'Quality Checked', desc: 'Hotels, experiences, and operators are reviewed before they reach your itinerary.' },
    { icon: Heart, title: 'Personalized Service', desc: 'Dedicated consultants shape each journey around your pace, style, and priorities.' },
    { icon: Globe, title: 'Global Network', desc: 'Trusted local partners help each destination feel polished and authentic.' },
  ];

  return (
    <div className="bg-light">
      <PageHeader
        title="About WanderLux"
        subtitle="A boutique travel agency crafting premium journeys with care, clarity, and local expertise."
        image={IMAGES.about}
      />

      <section className="section-padding bg-white">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div>
              <span className="section-label">Our Story</span>
              <h2 className="section-title">Travel planning that feels personal, polished, and calm.</h2>
              <p className="mt-6 leading-relaxed text-slate-600">
                WanderLux began with a simple belief: exceptional travel should feel inspiring before the trip and effortless once you arrive. Our team combines destination knowledge, strong supplier relationships, and careful planning to create journeys that feel considered at every step.
              </p>
              <p className="mt-4 leading-relaxed text-slate-600">
                From private island escapes to cultural city routes, each itinerary is shaped around the traveler first. We focus on strong pacing, beautiful stays, meaningful experiences, and support that is easy to reach when plans change.
              </p>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-lg shadow-2xl shadow-primary/10">
                <img src={unsplash(IMAGES.about, 900)} alt="Travelers exploring a scenic landscape" className="h-[28rem] w-full object-cover" />
              </div>
              <div className="absolute bottom-5 left-5 rounded-lg bg-white/95 p-5 shadow-xl backdrop-blur">
                <p className="font-display text-3xl font-semibold text-primary">15+</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">Years of travel craft</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding surface-grid">
        <div className="container">
          <div className="grid gap-5 md:grid-cols-2">
            {[
              {
                icon: Target,
                title: 'Our Mission',
                text: 'To help people explore the world through thoughtful travel experiences that create lasting memories and meaningful connections.',
              },
              {
                icon: Eye,
                title: 'Our Vision',
                text: 'To be a trusted travel partner known for service, transparency, responsible choices, and beautifully planned journeys.',
              },
            ].map(({ icon: Icon, title, text }) => (
              <article key={title} className="card-premium p-7 md:p-8">
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                  <Icon size={26} />
                </span>
                <h3 className="font-display text-2xl font-semibold text-primary">{title}</h3>
                <p className="mt-3 leading-relaxed text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-primary py-14">
        <div className="absolute inset-0">
          <img src={unsplash(IMAGES.heroAlt, 1400)} alt="" className="h-full w-full object-cover opacity-20" />
        </div>
        <div className="container relative">
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="font-display text-4xl font-semibold text-accent lg:text-5xl">{stat.value}</p>
                <p className="mt-2 text-sm font-semibold text-white/70">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container">
          <SectionHeader
            label="The Team"
            title="Meet Our Travel Experts"
            subtitle="Destination specialists, operations pros, and guest-care people who make complex trips feel simple."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <motion.article
                key={member.name}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="overflow-hidden rounded-lg bg-slate-200 shadow-lg shadow-slate-200">
                  <img
                    src={unsplash(member.image, 500)}
                    alt={member.name}
                    className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-primary">{member.name}</h3>
                <p className="mt-1 text-sm font-semibold text-secondary">{member.role}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-light">
        <div className="container">
          <SectionHeader
            label="Trust"
            title="Why Travelers Choose Us"
            subtitle="A foundation of clear communication, dependable partners, and service that stays close to the details."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trustPoints.map(({ icon: Icon, title, desc }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                className="card p-6"
              >
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon size={24} />
                </span>
                <h3 className="font-semibold text-primary">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
