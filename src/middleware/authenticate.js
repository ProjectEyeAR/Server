//로그인이 되어있는지 확인, 로그인 안되어있을시 실패 메세지 반환
let checkLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.status(401).json({ message: 'Access denied, Please check logged in first', success: false })
}

//로그인이 안되있는지 확인, 로그인 되어있을시 실패 메세지 반환
let checkLoggedOut = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return next()
  }
  res.status(403).json({ message: 'Already Logged out', success: false })
}

module.exports = {
  checkLoggedIn,
  checkLoggedOut
}
