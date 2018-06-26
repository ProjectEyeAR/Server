# Server 기능 명세서

## 1. 개요
각 화면의 db기능 정리<br/>

## 2. 기능
1. 로그인

## 3. 회피 목표
1. 이 버전에서 아직 다음 기능은 지원하지 않는다.<br>
  1.1. "somthing"</br>

## 4. 라우터
메모 = AR사진과 글 등이 적혀있음<br>
GET localhost:3000/api/memo - 모든 메모 가져오기<br>
POST localhost:3000/api/memo - 메모 저장하기<br>
## 5. 디비 스키마
<code>    
const memoSchema = new mongoose.Schema({
  img: {
    type: String
  },
  text: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  coordinates: {
    type: [Number]
  }
})
</code>
