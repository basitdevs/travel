const SectionHeader = ({ label, title, subtitle, align = 'center', light = false }) => (
  <div className={`mb-10 md:mb-12 ${align === 'center' ? 'text-center' : 'text-left'}`}>
    {label && (
      <span className={`section-label ${align === 'center' ? 'justify-center' : ''} ${light ? 'text-accent' : ''}`}>
        {label}
      </span>
    )}
    <h2 className={`section-title ${light ? 'text-white' : ''} ${align === 'center' ? 'mx-auto max-w-3xl' : ''}`}>
      {title}
    </h2>
    {subtitle && (
      <p className={`section-subtitle ${align === 'center' ? 'mx-auto' : ''} ${light ? 'text-white/70' : ''}`}>
        {subtitle}
      </p>
    )}
  </div>
);

export default SectionHeader;
