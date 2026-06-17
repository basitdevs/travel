import { motion } from 'framer-motion';
import { unsplash } from '../utils/images';

const PageHeader = ({ title, subtitle, image, children }) => (
  <section className="page-hero bg-dark">
    <div className="absolute inset-0">
      <img
        src={unsplash(image, 1920)}
        alt=""
        className="h-full w-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-primary/75 to-dark/20" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-dark/70 to-transparent" />
    </div>

    <div className="container relative pt-8">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="max-w-3xl"
      >
        <span className="home-eyebrow text-accent">WanderLux Travel</span>
        <h1 className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </motion.div>
    </div>
  </section>
);

export default PageHeader;
