const ApiError = require('../utils/ApiError');
const Portfolio = require('../models/Portfolio');
const { emitPortfolioUpdate } = require('../socket');
const { portfolioDefaults, cloneDefaults } = require('../config/portfolioDefaults');

const SECTION_KEYS = Object.keys(portfolioDefaults);

const attachDefaults = (portfolioDoc) => {
  const defaults = cloneDefaults();
  if (!portfolioDoc) {
    return defaults;
  }

  const data = portfolioDoc.toObject ? portfolioDoc.toObject() : portfolioDoc;

  return SECTION_KEYS.reduce((acc, section) => {
    acc[section] =
      data && data[section] !== undefined && data[section] !== null
        ? data[section]
        : defaults[section];
    return acc;
  }, {});
};

const getOrCreatePortfolio = async (ownerId) => {
  let portfolio = await Portfolio.findOne();
  if (!portfolio) {
    portfolio = await Portfolio.create({ owner: ownerId, ...cloneDefaults() });
  }
  return portfolio;
};

const getPortfolio = async () => {
  const portfolio = await Portfolio.findOne();
  return attachDefaults(portfolio);
};

const updateSection = async ({ section, payload, ownerId }) => {
  if (!SECTION_KEYS.includes(section)) {
    throw new ApiError(400, `Unsupported section: ${section}`);
  }

  if (payload === null || typeof payload !== 'object') {
    throw new ApiError(400, 'Payload must be an object');
  }

  const portfolio = await getOrCreatePortfolio(ownerId);
  portfolio.set(section, payload);

  await portfolio.save();

  const result = attachDefaults(portfolio)[section];
  emitPortfolioUpdate({ [section]: result });

  return result;
};

module.exports = { getPortfolio, updateSection };
