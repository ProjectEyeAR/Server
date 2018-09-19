module.exports = ({router, init}) => {
  const auth = require('../controller/auth')
  const memo = require('../controller/memo')
  const following = require('../controller/following')
  const user = require('../controller/user')
  const initializeDB = require('../config/db_connection')
  const comments = require('../controller/comment')
  const logger = require('../config/logger')(init)
  const check = require('check-types')

  initializeDB(db => {
    router.use('/memos', memo({init, db, logger, check}))
    router.use('/auth', auth({init, db, logger, check}))
    router.use('/followings', following({init, db, logger, check}))
    router.use('/users', user({init, db, logger, check}))
    router.use('/comments', comments({init, db, logger, check}))
  })

  return router
}
