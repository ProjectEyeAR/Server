module.exports = ({router, init}) => {
  const auth = require('../controller/auth')
  const memo = require('../controller/memo')
  const following = require('../controller/following')
  const initializeDB = require('../config/db_connection')

  initializeDB(db => {
    //@url http://localhost:3001/api/memo
    router.use('/memo', memo({init, db}))
    //@url http://localhost:3001/api/auth
    router.use('/auth', auth({init, db}))
    router.use('/following', auth({init, db}))
  })

  return router
}
