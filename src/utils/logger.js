const createLogger = (scope = 'app') => ({
  info: (message, meta) => console.info(`[${scope}] ${message}`, meta || ''),
  error: (message, meta) => console.error(`[${scope}] ${message}`, meta || ''),
});

module.exports = { createLogger };
