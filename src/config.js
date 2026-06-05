module.exports = {
  email: 'contact@enoal.fr',

  socialMedia: [
    {
      name: 'GitHub',
      url: 'https://github.com/Enoal-Fauchille-Bolle',
    },
    {
      name: 'Linkedin',
      url: 'https://www.linkedin.com/in/enoal-fauchille',
    },
    {
      name: 'Discord',
      url: 'https://discord.com/users/1418136273209528371',
    },
  ],

  navLinks: [
    {
      name: 'À propos',
      url: '/#about',
    },
    {
      name: 'Expérience',
      url: '/#jobs',
    },
    {
      name: 'Travail',
      url: '/#projects',
    },
    {
      name: 'Contact',
      url: '/#contact',
    },
  ],

  colors: {
    green: '#2aa198',
    navy: '#0a192f',
    darkNavy: '#020c1b',
  },

  srConfig: (delay = 100, viewFactor = 0.25) => ({
    origin: 'bottom',
    distance: '20px',
    duration: 200,
    delay,
    rotate: { x: 0, y: 0, z: 0 },
    opacity: 0,
    scale: 1,
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    mobile: true,
    reset: false,
    useDelay: 'always',
    viewFactor,
    viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },
  }),
};
