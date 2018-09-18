module.exports = ({router, init}) => {
  const auth = require('../controller/auth')
  const memo = require('../controller/memo')
  const following = require('../controller/following')
  const user = require('../controller/user')
  const initializeDB = require('../config/db_connection')
  const comments = require('../controller/comment')
  const logger = require('../config/logger')(init)

  initializeDB(db => {
    //@url http://localhost:3001/api/memo
    router.use('/memos', memo({init, db, logger}))
    //@url http://localhost:3001/api/auth
    router.use('/auth', auth({init, db}))
    router.use('/followings', following({init, db, logger}))
    router.use('/users', user({init, db}))
    router.use('/comments', comments({init, db, logger}))
  })

  return router
}
