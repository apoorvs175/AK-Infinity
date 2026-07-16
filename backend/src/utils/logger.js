export function logAIRequest({
  timestamp,
  clientId,
  service,
  requestType,
  tokensSent,
  tokensReceived,
  responseTimeMs,
  error = null,
}) {
  const logData = {
    timestamp,
    clientId,
    service,
    requestType,
    tokensSent,
    tokensReceived,
    responseTimeMs,
    error,
  };
  console.log('\n[AI Request Log]', JSON.stringify(logData, null, 2));
}
