
# Server 기능 명세서
## Start-up
1. *yarn dev* or *npm run dev*
2. First sign up.

> POST http://localhost:3001/api/auth/register

       {
    	  "email": "test@test1.com",
    	  "password": "1234",
    	  "displayName": "wfr112",
    	  "phoneNumber": "010-0001-0000"
       }

3. Login.
>POST http://localhost:3001/api/auth/login

       {
    	  "email": "test@test1.com",
    	  "password": "1234"
       }

4. Check whether you are loged in.
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

5. Test
>GET  http://localhost:3001/api/memo/test

       {
         "message": {
             "tag": [
                 "seoul",
                 "tour"
             ],
             "_id": "5b8e7adbd5394a5d7407e3b5",
             "imgUrl": "Server\\Pictures\\i14182109167",
             "text": "Myself in seoul",
             "loc": {
                  "type": "Point",
                  "coordinates": [
                      -80,
                      20
                 ],
                  "_id": "5b8e7adbd5394a5d7407e3b6"
              },
              "user": "5b8e4249f9f8184d0c825c6a",
              "date": "2018-09-04T12:30:19.797Z",
              "__v": 0
         },
          "success": true
       }

## Routers
**Auth**
SignUp

>POST http://localhost:3001/api/auth/register

    {
    	"email": "test@test1.com",
    	"password": "1234",
    	"displayName": "wfr112",
    	"phoneNumber": "010-0001-0000"
    }

Login

>POST http://localhost:3001/api/auth/login

    { 	"email": "test@test1.com",  "password": "1234" }

Logout
>GET http://localhost:3001/api/auth/logout
>
Me

>GET http://localhost:3001/api/auth/me
<hr>

**Memo**
Update
>PUT http://localhost:3001/api/memo/5b8e3895e1d5b36e086078a2

Delete a document
>DELETE http://localhost:3001/api/memo/5b8e3895e1d5b36e086078a2

    //Response
        {
            "message": "Successfully deleted one document belongs to a logged in user",
            "success": true
        }

Delete All

>DELETE http://localhost:3001/api/memo
	
	//Response
    {
        "message": "Successfully deleted all documents belongs to a logged in user",
        "success": true
    }

Add
>POST  http://localhost:3001/api/memo

    //Request
    {
    	"imgUrl": "Server\\Pictures\\i14182109167",
    	"text": "Myself in seoul",
    	"tag": ["seoul", "tour"],
    	"loc" : {"type": "point", "coordinates": [-80, 25.791]}
    }
    
    //Response
    {
        "message": {
            "tag": [
                "seoul",
                "tour"
            ],
            "_id": "5b8e81f5598365013cff2417",
            "imgUrl": "Server\\Pictures\\i14182109167",
            "text": "Myself in seoul",
            "loc": {
                "type": "Point",
                "coordinates": [
                    -40,
                    20
                ],
                "_id": "5b8e81f5598365013cff2418"
            },
            "user": "5b8e4249f9f8184d0c825c6a",
            "date": "2018-09-04T13:00:37.832Z",
            "__v": 0
        },
        "success": true
    }
