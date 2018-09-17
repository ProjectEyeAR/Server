module.exports = ({router, init}) => {
  const auth = require('../controller/auth')
  const memo = require('../controller/memo')
  const following = require('../controller/following')
  const initializeDB = require('../config/db_connection')

  initializeDB(db => {
    //@url http://localhost:3001/api/memo
    router.use('/memos', memo({init, db}))
    //@url http://localhost:3001/api/auth
    router.use('/auth', auth({init, db}))
    router.use('/followings', following({init, db}))
  })

  return router
}
