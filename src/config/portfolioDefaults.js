const portfolioDefaults = {
  about: {
    summary: '',
    highlights: [],
  },
  skills: {
    headline: '',
    categories: [{ title: '', items: [] }],
  },
  work: {
    roles: [{ title: '', company: '', period: '', summary: '' }],
  },
  journey: {
    timeline: [{ period: '', title: '', detail: '' }],
  },
  projects: {
    items: [{ name: '', link: '', summary: '', stack: [] }],
  },
  education: {
    milestones: [{ period: '', institution: '', detail: '' }],
  },
  contact: {
    email: '',
    phone: '',
    location: '',
    availability: '',
    socials: [{ label: '', url: '' }],
  },
};

const cloneDefaults = () => JSON.parse(JSON.stringify(portfolioDefaults));

module.exports = { portfolioDefaults, cloneDefaults };
