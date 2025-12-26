const fs = require('fs/promises');
const path = require('path');
const ApiError = require('../utils/ApiError');
const Portfolio = require('../models/Portfolio');
const { emitPortfolioUpdate } = require('../socket');
const { portfolioDefaults, cloneDefaults } = require('../config/portfolioDefaults');

const SECTION_KEYS = Object.keys(portfolioDefaults);
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

const isValidHttpUrl = (value) => {
  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch (error) {
    return false;
  }
};

const isUploadUrl = (value) => value.startsWith('/uploads/');

const getUploadFilePath = (value) => {
  const relativePath = value.replace(/^\/+/, '');
  const fullPath = path.resolve(process.cwd(), relativePath);
  if (!fullPath.startsWith(UPLOADS_DIR + path.sep)) {
    return null;
  }
  return fullPath;
};

const safelyDeleteUpload = async (value) => {
  if (!value || !isUploadUrl(value)) {
    return;
  }
  const filePath = getUploadFilePath(value);
  if (!filePath) {
    return;
  }
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
};

const normalizeProjectImage = (imageValue) => {
  if (typeof imageValue !== 'string') {
    throw new ApiError(400, 'Project image must be a string URL');
  }

  const trimmed = imageValue.trim();
  if (!trimmed) {
    return undefined;
  }

  if (isValidHttpUrl(trimmed) || isUploadUrl(trimmed)) {
    return trimmed;
  }

  throw new ApiError(400, 'Project image must be a valid http/https URL');
};

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

const collectProjectImageDeletions = (currentItems, nextItems) => {
  if (!Array.isArray(currentItems) || !Array.isArray(nextItems)) {
    return [];
  }

  const currentById = new Map(
    currentItems
      .filter((item) => item && item._id)
      .map((item) => [String(item._id), item])
  );

  return nextItems
    .filter((item) => item && item._id)
    .map((item) => {
      const currentItem = currentById.get(String(item._id));
      if (!currentItem) {
        return null;
      }

      const currentImage = currentItem.image;
      const nextImage = item.image;

      if (!currentImage || currentImage === nextImage) {
        return null;
      }

      if (!isUploadUrl(currentImage)) {
        return null;
      }

      return currentImage;
    })
    .filter(Boolean);
};

const updateSection = async ({ section, payload, ownerId }) => {
  if (!SECTION_KEYS.includes(section)) {
    throw new ApiError(400, `Unsupported section: ${section}`);
  }

  if (payload === null || typeof payload !== 'object') {
    throw new ApiError(400, 'Payload must be an object');
  }

  let normalizedPayload = payload;
  let uploadImagesToDelete = [];

  const portfolio = await getOrCreatePortfolio(ownerId);
  if (section === 'about' && typeof payload.imageUrl === 'string') {
    if (payload.imageUrl.trim().startsWith('data:')) {
      throw new ApiError(400, 'Base64 image data is not accepted for about.imageUrl');
    }
  }

  const currentProjects =
    section === 'projects' && portfolio.get(section)
      ? portfolio.get(section).toObject?.() || portfolio.get(section)
      : null;

  if (section === 'projects' && Array.isArray(payload.items)) {
    const normalizedItems = payload.items.map((item) => {
      if (!item || typeof item !== 'object') {
        return item;
      }

      if (!Object.prototype.hasOwnProperty.call(item, 'image')) {
        const { image, ...rest } = item;
        return rest;
      }

      const normalizedImage = normalizeProjectImage(item.image);
      if (normalizedImage === undefined) {
        const { image, ...rest } = item;
        return rest;
      }

      return { ...item, image: normalizedImage };
    });

    normalizedPayload = { ...payload, items: normalizedItems };
    uploadImagesToDelete = collectProjectImageDeletions(
      currentProjects?.items,
      normalizedItems
    );
  }

  const currentSection =
    section === 'about' && portfolio.get(section)
      ? portfolio.get(section).toObject?.() || portfolio.get(section)
      : null;
  const nextPayload =
    section === 'about' && currentSection
      ? { ...currentSection, ...normalizedPayload }
      : normalizedPayload;

  portfolio.set(section, nextPayload);

  await portfolio.save();
  await Promise.all(uploadImagesToDelete.map((url) => safelyDeleteUpload(url)));

  const result = attachDefaults(portfolio)[section];
  emitPortfolioUpdate({ [section]: result });

  return result;
};

module.exports = { getPortfolio, updateSection };
