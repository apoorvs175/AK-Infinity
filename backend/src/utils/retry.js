export async function withExponentialBackoff(fn, options = {}) {
  const { maxRetries = 3, initialDelayMs = 1000, onRetry } = options;
  let lastError;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i >= maxRetries) break;

      const delayMs = initialDelayMs * Math.pow(2, i);
      if (onRetry) {
        onRetry({ attempt: i + 1, delayMs, error });
      }
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  throw lastError;
}
