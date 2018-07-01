module.exports = ({app, init}) => {
  const config = require('config')
  const morgan = require('morgan')
  const debug = require('debug')('app:startup')

  console.log('Applicatoin Name:' + config.get('name'))
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`)
  console.log(`app: ${app.get('env')}`)

  if (app.get('env') === 'development') {
    app.use(morgan('tiny'))
    debug('Morgan enabled...')
  }
}
