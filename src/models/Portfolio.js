const mongoose = require('mongoose');

const showcaseSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    subtitle: { type: String, trim: true },
    logoUrl: { type: String, trim: true },
    profileImageUrl: { type: String, trim: true },
  },
  { _id: false }
);

const skillsSchema = new mongoose.Schema(
  {
    headline: { type: String, trim: true },
    categories: [
      {
        title: { type: String, trim: true },
        items: [{ type: String, trim: true }],
      },
    ],
  },
  { _id: false }
);

const workSchema = new mongoose.Schema(
  {
    roles: [
      {
        title: { type: String, trim: true },
        company: { type: String, trim: true },
        period: { type: String, trim: true },
        summary: { type: String, trim: true },
      },
    ],
  },
  { _id: false }
);

const journeySchema = new mongoose.Schema(
  {
    timeline: [
      {
        period: { type: String, trim: true },
        title: { type: String, trim: true },
        detail: { type: String, trim: true },
      },
    ],
  },
  { _id: false }
);

const projectsSchema = new mongoose.Schema(
  {
    items: [
      {
        name: { type: String, trim: true },
        link: { type: String, trim: true },
        summary: { type: String, trim: true },
        stack: [{ type: String, trim: true }],
      },
    ],
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    milestones: [
      {
        period: { type: String, trim: true },
        institution: { type: String, trim: true },
        detail: { type: String, trim: true },
      },
    ],
  },
  { _id: false }
);

const contactSchema = new mongoose.Schema(
  {
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    availability: { type: String, trim: true },
    socials: [
      {
        label: { type: String, trim: true },
        url: { type: String, trim: true },
      },
    ],
  },
  { _id: false }
);

const portfolioSchema = new mongoose.Schema(
  {
    showcase: showcaseSchema,
    about: {
      summary: { type: String, trim: true },
      imageUrl: { type: String, trim: true },
      highlights: [{ type: String, trim: true }],
    },
    skills: skillsSchema,
    work: workSchema,
    journey: journeySchema,
    projects: projectsSchema,
    education: educationSchema,
    contact: contactSchema,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
