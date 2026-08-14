export const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Silver GYM API is running',
    timestamp: new Date().toISOString(),
  })
}
