const portfolioService = require('../services/portfolioService');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/response');

const fetchPortfolio = catchAsync(async (_req, res) => {
  const portfolio = await portfolioService.getPortfolio();
  sendSuccess(res, portfolio);
});

const updatePortfolioSection = catchAsync(async (req, res) => {
  const { section } = req.params;
  const updatedSection = await portfolioService.updateSection({
    section,
    payload: req.body,
    ownerId: req.user.id,
  });
  sendSuccess(res, { [section]: updatedSection });
});

module.exports = { fetchPortfolio, updatePortfolioSection };
