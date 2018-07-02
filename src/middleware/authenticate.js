let isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.status(401).json({ message: '허용되지 않은 접근: 로그인이 되었는지 확인', success: false })
}

module.exports = {
  isAuthenticated
}
