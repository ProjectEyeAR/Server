
# 서울시앱공모전  Server-side 
## Start up
1. *yarn dev* or *npm run dev*
2. At First, sign up your account to the server.

> POST http://localhost:3001/api/users

     {
    	  "email": "test@test1.com",
    	  "password": "1234",
    	  "displayName": "wfr112",
    	  "phoneNumber": "010-0001-0000"
     }

3. Login.

>POST http://localhost:3001/api/auth/session

    {
          "email": "test@test1.com",
          "password": "1234"
    }
4. Check whether you were log in.
 >GET http://localhost:3001/api/auth/me

       {
          "message": {
              "_id": "5b8e4249f9f8184d0c825c6a",
              "authId": "local:test@test1.com",
              "email": "test@test1.com",
              "password": "qH1WrjR2VGgXOmwtJ0gW4vukJaxR2BjPXpGrso/5IOtPoHWcytiOyvlpcqXTt/Em7cgfrwkJ8HZMTjz2I+jVkY/yoFoMreU8D+q5if+3CziixwhoLi0kEcp9IKqb0ROsGz32GgnJpGctcXBX56G7J2aQlaM/R4eDoRi+hSf/Gws=",
              "salt": "y9AuW4/YK18vINhC4zvrGLp/osoog8wq8ojoJ/rSvUwhv4v0l572pL+SdsGSwVucacBxhnt73NPBsng24Hrq5g==",
              "displayName": "wfr112",
              "phoneNumber": "010-0001-0000",
              "date": "2018-09-04T08:28:57.461Z",
              "__v": 0
        },
           "success": true
    }

## Routers

**Auth**


----------


SignUp

>POST http://localhost:3001/api/users
> req:
> 
> { 	"email": "test@test1.com", 	"password": "1234", 	"displayName":
> "wfr112", 	"phoneNumber": "010-0001-0000" }
> res:
> 
>     {
>         "data": {
>             "_id": "5ba1faf6b81deb3f7cef3883",
>             "authId": "local:test@test1.com",
>             "email": "test@test1.com",
>             "password": "gaTQ8TE2pyjzfoN4bODTubGuUs3ZGS8EX6VmaDjecoprT69l+lYqTc1Lm5o81fjexjperiv/qEXHzhNChdZo93jpw1jIIPp87GBQutymkwhUnUtol2Mu3GOpU5CIVrz9slLNYtQQr0KRefBCyY4R8an9Jz0Y0gEjNMWD6DXTiys=",
>             "salt": "lS6SroxxhbGnEc4bi5S/5zmeAacArMVgNhtcddH/xSS8T8WKw5jqzoaKLMzUXPkzBkPkOGIIaZ56XLpcjSxJrw==",
>             "displayName": "wfr112",
>             "phoneNumber": "010-0001-0000",
>             "date": "2018-09-19T07:29:58.787Z",
>             "__v": 0
>         } }

Login

>POST http://localhost:3001/api/auth/session
> req:
> 
>     { 	"email": "test@test1.com",  "password": "1234" } res: { "data": {
>         "_id": "5ba1faf6b81deb3f7cef3883",
>         "authId": "local:test@test1.com",
>         "email": "test@test1.com",
>         "password": "gaTQ8TE2pyjzfoN4bODTubGuUs3ZGS8EX6VmaDjecoprT69l+lYqTc1Lm5o81fjexjperiv/qEXHzhNChdZo93jpw1jIIPp87GBQutymkwhUnUtol2Mu3GOpU5CIVrz9slLNYtQQr0KRefBCyY4R8an9Jz0Y0gEjNMWD6DXTiys=",
>         "salt": "lS6SroxxhbGnEc4bi5S/5zmeAacArMVgNhtcddH/xSS8T8WKw5jqzoaKLMzUXPkzBkPkOGIIaZ56XLpcjSxJrw==",
>         "displayName": "wfr112",
>         "phoneNumber": "010-0001-0000",
>         "date": "2018-09-19T07:29:58.787Z",
>         "__v": 0 } }

Logout

>GET http://localhost:3001/api/auth/session
>req: 
>res:  {}


Me

>GET http://localhost:3001/api/users/me
>req:
>res:
> 
>     {
>         "data": {
>             "_id": "5ba1faf6b81deb3f7cef3883",
>             "authId": "local:test@test1.com",
>             "email": "test@test1.com",
>             "password": "gaTQ8TE2pyjzfoN4bODTubGuUs3ZGS8EX6VmaDjecoprT69l+lYqTc1Lm5o81fjexjperiv/qEXHzhNChdZo93jpw1jIIPp87GBQutymkwhUnUtol2Mu3GOpU5CIVrz9slLNYtQQr0KRefBCyY4R8an9Jz0Y0gEjNMWD6DXTiys=",
>             "salt": "lS6SroxxhbGnEc4bi5S/5zmeAacArMVgNhtcddH/xSS8T8WKw5jqzoaKLMzUXPkzBkPkOGIIaZ56XLpcjSxJrw==",
>             "displayName": "wfr112",
>             "phoneNumber": "010-0001-0000",
>             "date": "2018-09-19T07:29:58.787Z",
>             "__v": 0
>         } }

**Memo**

----------


	
**Comment**

----------


**User**

----------


