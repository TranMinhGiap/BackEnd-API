module.exports.sendError = (res, status, message, errorCode = null) => {
  const errorResponse = {
    success: false,
    status: status,
    message: message,
    ...(errorCode && { error: { code: errorCode } })
  };
  res.status(status).json(errorResponse);
}