
# 서울시앱공모전  Server

Steps to build it
---
*yarn dev* or *npm run dev*

Sample
---
1.First, sign up your account on the server.

POST http://localhost:3001/api/users


     {
    	  "img": "example.png | jpeg", //img is Optional
    	  "email": "example@example.com",	  
    	  "password": "abcd1234",
    	  "displayName": "example",
     }
  Then you'll get this.

      {
        "data": {
            "_id": "5c453b4abfc1103188c37124",
            "type": "local",
            "email": "example@example.com",
            "password": "yC+z9+9Jl310KP39YL/bIcw5zXr34U2UQQtax/KG2Srd2DyardGdosljgjf0qa+l4Nc0A04BsLoZnHonr8sEkAt19czpocFq3MbyGJPIWBKHx+QL1C6ejDdXfPKqsVav+bd2VNzPxVKn9BG445iIRFNqeVW1OdUwpyi0+maL0+s=",
            "profile": "https://s3.ap-northeast-2.amazonaws.com/seoul-image-server/default_profile.png",
            "thumbnail": "https://s3.ap-northeast-2.amazonaws.com/seoul-image-server/default_profile.png",
            "salt": "lJZcLU3pcMLerg+zGdV+5kODdpsvYOx+lC48qojjJbyt+9JjaZ3lqeHED8Aifv77Cp1KayZo1XiRFjeE+ot+eQ==",
            "displayName": "example",
            "date": "2019-01-21T03:23:54.116Z",
            "__v": 0
        }
    }

  

2.Login.

POST http://localhost:3001/api/auth/session

    {
    	"email": "example@example.com",
    	"password": "abcd1234"
    }
Then you'll get this.

    {
        "data": {
            "_id": "5c453b4abfc1103188c37124",
            "type": "local",
            "email": "example@example.com",
            "password": "yC+z9+9Jl310KP39YL/bIcw5zXr34U2UQQtax/KG2Srd2DyardGdosljgjf0qa+l4Nc0A04BsLoZnHonr8sEkAt19czpocFq3MbyGJPIWBKHx+QL1C6ejDdXfPKqsVav+bd2VNzPxVKn9BG445iIRFNqeVW1OdUwpyi0+maL0+s=",
            "profile": "https://s3.ap-northeast-2.amazonaws.com/seoul-image-server/default_profile.png",
            "thumbnail": "https://s3.ap-northeast-2.amazonaws.com/seoul-image-server/default_profile.png",
            "salt": "lJZcLU3pcMLerg+zGdV+5kODdpsvYOx+lC48qojjJbyt+9JjaZ3lqeHED8Aifv77Cp1KayZo1XiRFjeE+ot+eQ==",
            "displayName": "example",
            "date": "2019-01-21T03:23:54.116Z",
            "__v": 0,
            "followingCount": 0,
            "followerCount": 0,
            "memoCount": 0,
            "following": false
        }
    }

3.Check whether you were log in.
 
 GET http://localhost:3001/api/auth/me
 
Then you'll get

    {
        "data": {
            "_id": "5c453b4abfc1103188c37124",
            "type": "local",
            "email": "example@example.com",
            "password": "yC+z9+9Jl310KP39YL/bIcw5zXr34U2UQQtax/KG2Srd2DyardGdosljgjf0qa+l4Nc0A04BsLoZnHonr8sEkAt19czpocFq3MbyGJPIWBKHx+QL1C6ejDdXfPKqsVav+bd2VNzPxVKn9BG445iIRFNqeVW1OdUwpyi0+maL0+s=",
            "profile": "https://s3.ap-northeast-2.amazonaws.com/seoul-image-server/default_profile.png",
            "thumbnail": "https://s3.ap-northeast-2.amazonaws.com/seoul-image-server/default_profile.png",
            "salt": "lJZcLU3pcMLerg+zGdV+5kODdpsvYOx+lC48qojjJbyt+9JjaZ3lqeHED8Aifv77Cp1KayZo1XiRFjeE+ot+eQ==",
            "displayName": "example",
            "date": "2019-01-21T03:23:54.116Z",
            "__v": 0,
            "followingCount": 0,
            "followerCount": 0,
            "memoCount": 0,
            "following": false
        }
    }

4.Add memo

POST http://localhost:3001/api/memos

![postman form-data object with array](https://user-images.githubusercontent.com/25196026/51452824-ac489200-1d7f-11e9-8264-5aef5246e191.png)

    {
    	  "img": "example.png | jpeg
          "text": "I love han river",
          "loc": {
            "coordinates": [126.934216, 37.529047]
          },
          "tags": "#HanGang#River"	
    }
   Then, You'll get this.

       {
        "data": {
            "img": "https://seoul-image-server.s3.ap-northeast-2.amazonaws.com/1548044435968.png",
            "text": "I love Han river!",
            "tags": [],
            "_id": "5c454895ea95f035c8039aec",
            "thumbnail": "https://seoul-image-server.s3.ap-northeast-2.amazonaws.com/thumbnail-1548044435967.png",
            "loc": {
                "type": "Point",
                "coordinates": [
                    126.934216,
                    37.529047
                ],
                "_id": "5c454895ea95f035c8039aed"
            },
            "user": "5c453b4abfc1103188c37124",
            "address": {
                "village": "여의도동",
                "town": "영등포구",
                "city": "서울특별시",
                "country": "대한민국",
                "country_code": "kr"
            },
            "date": "2019-01-21T04:20:37.802Z",
            "__v": 0
        }
    }

## Routers
---
###Auth
| desc            |method           | url             |url-query       |data-params      |
|-----------------|-----------------|-----------------|-----------------|-----------------|
|로컬 로그인|POST|/api/auth/session||email: String, password: String|
|로컬 & 페이스북 로그아웃|GET|/api/auth/session|||
|페이스북 로그인|GET|/api/auth/facebook|||
|페이스북 로그인 실패, 성공시 거쳐가는 콜백|GET|/api/auth/facebook/fail|||
###Comment
| desc            |method           | url             |url-query      |data-params      |
|-----------------|-----------------|-----------------|-----------------|-----------------|
|특정 메모에 속해있는 이모찌와 유저를 전부 가져옴|GET|/api/comments/:id|skip, limit||
|코멘트 추가|POST|/api/comments||id: String, emoji: String, memo: String|
|특정 메모의 자신의 코멘트 삭제|DELETE|/api/comments/:id|||
|특정 메모의 자신의 특정 코멘트 수정|PUT|/api/comments/:id||emoji: String|




