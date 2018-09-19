module.exports = ({init, db}) => {
	const {checkLoggedIn, checkLoggedOut} = require('../middleware/authenticate')
	const errorMessage = require('../error_message')
	const User = require('../model/user')
	const api = require('express').Router()

	// TODO: profile 삭제, 추가, 가져오기 구현


	//회원가입
  	api.post('/', (req, res) => {
    	let newUser

    	return hasher({
    		password: req.body.password
    	}, function(err, pass, salt, hash) {
      		if (err) {
				logger.error(err.message)
				return res.status(500).json({message: err})
			  }
		    //이메일, 비밀번호, 보여줄 이름, 전화번호 필요
		    newUser = new User({
		    	authId: 'local:' + req.body.email,
		        email: req.body.email,
		        password: hash,
		        salt: salt,
		        displayName: req.body.displayName,
		        phoneNumber: req.body.phoneNumber
		    })

	      	newUser.save((err, newUser) => {
	        	if (err)
	          		return res.status(500).json({message: err})
	        	else
	          		return res.status(201).json({data: newUser})
	      	})
    	})
  	})

	return api
}