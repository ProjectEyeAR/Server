<h1><a id="_RESTFUL_API_1"></a>서울시앱공모전 RESTFUL API</h1>
<h2><a id="Steps_to_build_it_3"></a>Steps to build it</h2>
<p><em>yarn dev</em> or <em>npm run dev</em></p>
<h2><a id="Sample_7"></a>Sample</h2>
<ol>
<li>First, sign up your account on the server.</li>
</ol>
<p>POST <a href="http://localhost:3001/api/users">http://localhost:3001/api/users</a></p>
<pre><code> {
      &quot;img&quot;: &quot;example.png | jpeg&quot;, //img is Optional
      &quot;email&quot;: &quot;example@example.com&quot;,     
      &quot;password&quot;: &quot;abcd1234&quot;,
      &quot;displayName&quot;: &quot;example&quot;,
 }
</code></pre>
<p>Then you’ll get this.</p>
<pre><code>  {
    &quot;data&quot;: {
        &quot;_id&quot;: &quot;5c453b4abfc1103188c37124&quot;,
        &quot;type&quot;: &quot;local&quot;,
        &quot;email&quot;: &quot;example@example.com&quot;,
        &quot;password&quot;: &quot;yC+z9+9Jl310KP39YL/bIcw5zXr34U2UQQtax/KG2Srd2DyardGdosljgjf0qa+l4Nc0A04BsLoZnHonr8sEkAt19czpocFq3MbyGJPIWBKHx+QL1C6ejDdXfPKqsVav+bd2VNzPxVKn9BG445iIRFNqeVW1OdUwpyi0+maL0+s=&quot;,
        &quot;profile&quot;: &quot;https://s3.ap-northeast-2.amazonaws.com/seoul-image-server/default_profile.png&quot;,
        &quot;thumbnail&quot;: &quot;https://s3.ap-northeast-2.amazonaws.com/seoul-image-server/default_profile.png&quot;,
        &quot;salt&quot;: &quot;lJZcLU3pcMLerg+zGdV+5kODdpsvYOx+lC48qojjJbyt+9JjaZ3lqeHED8Aifv77Cp1KayZo1XiRFjeE+ot+eQ==&quot;,
        &quot;displayName&quot;: &quot;example&quot;,
        &quot;date&quot;: &quot;2019-01-21T03:23:54.116Z&quot;,
        &quot;__v&quot;: 0
    }
}
</code></pre>
<ol start="2">
<li>Login.</li>
</ol>
<p>POST <a href="http://localhost:3001/api/auth/session">http://localhost:3001/api/auth/session</a></p>
<pre><code>{
    &quot;email&quot;: &quot;example@example.com&quot;,
    &quot;password&quot;: &quot;abcd1234&quot;
}
</code></pre>
<p>Then you’ll get this.</p>
<pre><code>{
    &quot;data&quot;: {
        &quot;_id&quot;: &quot;5c453b4abfc1103188c37124&quot;,
        &quot;type&quot;: &quot;local&quot;,
        &quot;email&quot;: &quot;example@example.com&quot;,
        &quot;password&quot;: &quot;yC+z9+9Jl310KP39YL/bIcw5zXr34U2UQQtax/KG2Srd2DyardGdosljgjf0qa+l4Nc0A04BsLoZnHonr8sEkAt19czpocFq3MbyGJPIWBKHx+QL1C6ejDdXfPKqsVav+bd2VNzPxVKn9BG445iIRFNqeVW1OdUwpyi0+maL0+s=&quot;,
        &quot;profile&quot;: &quot;https://s3.ap-northeast-2.amazonaws.com/seoul-image-server/default_profile.png&quot;,
        &quot;thumbnail&quot;: &quot;https://s3.ap-northeast-2.amazonaws.com/seoul-image-server/default_profile.png&quot;,
        &quot;salt&quot;: &quot;lJZcLU3pcMLerg+zGdV+5kODdpsvYOx+lC48qojjJbyt+9JjaZ3lqeHED8Aifv77Cp1KayZo1XiRFjeE+ot+eQ==&quot;,
        &quot;displayName&quot;: &quot;example&quot;,
        &quot;date&quot;: &quot;2019-01-21T03:23:54.116Z&quot;,
        &quot;__v&quot;: 0,
        &quot;followingCount&quot;: 0,
        &quot;followerCount&quot;: 0,
        &quot;memoCount&quot;: 0,
        &quot;following&quot;: false
    }
}
</code></pre>
<ol start="3">
<li>Check whether you were log in.</li>
</ol>
<p>GET <a href="http://localhost:3001/api/auth/me">http://localhost:3001/api/auth/me</a></p>
<p>Then you’ll get</p>
<pre><code>{
    &quot;data&quot;: {
        &quot;_id&quot;: &quot;5c453b4abfc1103188c37124&quot;,
        &quot;type&quot;: &quot;local&quot;,
        &quot;email&quot;: &quot;example@example.com&quot;,
        &quot;password&quot;: &quot;yC+z9+9Jl310KP39YL/bIcw5zXr34U2UQQtax/KG2Srd2DyardGdosljgjf0qa+l4Nc0A04BsLoZnHonr8sEkAt19czpocFq3MbyGJPIWBKHx+QL1C6ejDdXfPKqsVav+bd2VNzPxVKn9BG445iIRFNqeVW1OdUwpyi0+maL0+s=&quot;,
        &quot;profile&quot;: &quot;https://s3.ap-northeast-2.amazonaws.com/seoul-image-server/default_profile.png&quot;,
        &quot;thumbnail&quot;: &quot;https://s3.ap-northeast-2.amazonaws.com/seoul-image-server/default_profile.png&quot;,
        &quot;salt&quot;: &quot;lJZcLU3pcMLerg+zGdV+5kODdpsvYOx+lC48qojjJbyt+9JjaZ3lqeHED8Aifv77Cp1KayZo1XiRFjeE+ot+eQ==&quot;,
        &quot;displayName&quot;: &quot;example&quot;,
        &quot;date&quot;: &quot;2019-01-21T03:23:54.116Z&quot;,
        &quot;__v&quot;: 0,
        &quot;followingCount&quot;: 1,
        &quot;followerCount&quot;: 1,
        &quot;memoCount&quot;: 2,
        &quot;following&quot;: false,
        &quot;session&quot;: {
            &quot;cookie&quot;: {
                &quot;originalMaxAge&quot;: 2591963363,
                &quot;expires&quot;: &quot;2019-02-21T08:41:32.252Z&quot;,
                &quot;httpOnly&quot;: true,
                &quot;path&quot;: &quot;/&quot;
            },
            &quot;passport&quot;: {
                &quot;user&quot;: &quot;5c453b4abfc1103188c37124&quot;
            }
        }
    }
}
</code></pre>
<ol start="4">
<li>Add memo</li>
</ol>
<p>POST <a href="http://localhost:3001/api/memos">http://localhost:3001/api/memos</a></p>
<p><img src="https://user-images.githubusercontent.com/25196026/51452824-ac489200-1d7f-11e9-8264-5aef5246e191.png" alt="postman form-data object with array"></p>
<pre><code>{
      &quot;img&quot;: &quot;example.png | jpeg
      &quot;text&quot;: &quot;I love han river&quot;,
      &quot;loc&quot;: {
        &quot;coordinates&quot;: [126.934216, 37.529047]
      },
      &quot;tags&quot;: &quot;#HanGang#River&quot;  
}
</code></pre>
<p>Then, You’ll get</p>
<pre><code>   {
    &quot;data&quot;: {
        &quot;img&quot;: &quot;https://seoul-image-server.s3.ap-northeast-2.amazonaws.com/1548044435968.png&quot;,
        &quot;text&quot;: &quot;I love Han river!&quot;,
        &quot;tags&quot;: [],
        &quot;_id&quot;: &quot;5c454895ea95f035c8039aec&quot;,
        &quot;thumbnail&quot;: &quot;https://seoul-image-server.s3.ap-northeast-2.amazonaws.com/thumbnail-1548044435967.png&quot;,
        &quot;loc&quot;: {
            &quot;type&quot;: &quot;Point&quot;,
            &quot;coordinates&quot;: [
                126.934216,
                37.529047
            ],
            &quot;_id&quot;: &quot;5c454895ea95f035c8039aed&quot;
        },
        &quot;user&quot;: &quot;5c453b4abfc1103188c37124&quot;,
        &quot;address&quot;: {
            &quot;village&quot;: &quot;여의도동&quot;,
            &quot;town&quot;: &quot;영등포구&quot;,
            &quot;city&quot;: &quot;서울특별시&quot;,
            &quot;country&quot;: &quot;대한민국&quot;,
            &quot;country_code&quot;: &quot;kr&quot;
        },
        &quot;date&quot;: &quot;2019-01-21T04:20:37.802Z&quot;,
        &quot;__v&quot;: 0
    }
}
</code></pre>
<h2><a id="Routers_147"></a>Routers</h2>
<hr>
<h3><a id="Auth_149"></a>Auth</h3>
<table class="table table-striped table-bordered">
<thead>
<tr>
<th>desc</th>
<th>method</th>
<th>url</th>
<th>url-query</th>
<th>data-params</th>
</tr>
</thead>
<tbody>
<tr>
<td>로컬 로그인</td>
<td>POST</td>
<td>/api/auth/session</td>
<td></td>
<td>email: String, password: String</td>
</tr>
<tr>
<td>로컬 &amp; 페이스북 로그아웃</td>
<td>GET</td>
<td>/api/auth/session</td>
<td></td>
<td></td>
</tr>
<tr>
<td>페이스북 로그인</td>
<td>GET</td>
<td>/api/auth/facebook</td>
<td></td>
<td></td>
</tr>
<tr>
<td>페이스북 로그인 실패, 성공시 거쳐가는 콜백</td>
<td>GET</td>
<td>/api/auth/facebook/fail</td>
<td></td>
<td></td>
</tr>
</tbody>
</table>
<h3><a id="Comment_156"></a>Comment</h3>
<table class="table table-striped table-bordered">
<thead>
<tr>
<th>desc</th>
<th>method</th>
<th>url</th>
<th>url-query</th>
<th>data-params</th>
</tr>
</thead>
<tbody>
<tr>
<td>특정 메모에 속해있는 이모찌와 유저를 전부 가져옴</td>
<td>GET</td>
<td>/api/comments/:id</td>
<td>skip?, limit?</td>
<td></td>
</tr>
<tr>
<td>코멘트 추가</td>
<td>POST</td>
<td>/api/comments</td>
<td></td>
<td> emoji: String, memo: String</td>
</tr>
<tr>
<td>특정 메모의 자신의 코멘트 삭제</td>
<td>DELETE</td>
<td>/api/comments/:id</td>
<td></td>
<td></td>
</tr>
<tr>
<td>특정 메모의 자신의 이모찌 수정</td>
<td>PATCH</td>
<td>/api/comments/:id</td>
<td></td>
<td>emoji: String</td>
</tr>
</tbody>
</table>
<h3><a id="Follwings_164"></a>Follwings</h3>
<table class="table table-striped table-bordered">
<thead>
<tr>
<th>desc</th>
<th>method</th>
<th>url</th>
<th>url-query</th>
<th>data-params</th>
</tr>
</thead>
<tbody>
<tr>
<td>자신이 특정 아이디를 following 추가</td>
<td>POST</td>
<td>/api/followings/</td>
<td></td>
<td>followUserId: String</td>
</tr>
<tr>
<td>자신이 특정 아이디를 following 삭제</td>
<td>DELETE</td>
<td>/api/followings/</td>
<td></td>
<td>followUserId: String</td>
</tr>
<tr>
<td>해당 아이디가 following하고 있는 사람 숫자</td>
<td>GET</td>
<td>/api/followings/count</td>
<td>userId</td>
<td></td>
</tr>
<tr>
<td>해당 아이디가 following하고 있는 유저 정보 가져옴</td>
<td>GET</td>
<td>/api/followings/</td>
<td>userId, skip?, limit?</td>
<td></td>
</tr>
<tr>
<td>해당 아이디의 follower 숫자</td>
<td>GET</td>
<td>/api/followings/followe/api/followings/followers</td>
<td>userId, skip?, limit?</td>
<td></td>
</tr>
</tbody>
</table>
<h3><a id="Memos_173"></a>Memos</h3>
<table class="table table-striped table-bordered">
<thead>
<tr>
<th>desc</th>
<th>method</th>
<th>url</th>
<th>url-query</th>
<th>data-params</th>
</tr>
</thead>
<tbody>
<tr>
<td>주어진 tag가 속한 모든 메모를 출력함</td>
<td>GET</td>
<td>/api/memos/findByTag</td>
<td>tag</td>
<td></td>
</tr>
<tr>
<td>특정 유저에게 속한 모든 메모의 개수를 보여줌</td>
<td>GET</td>
<td>api/memos/count</td>
<td>id</td>
<td></td>
</tr>
<tr>
<td>주어진 좌표에서 가까운 메모 최대 30개 반환</td>
<td>GET</td>
<td>/api/memos/near</td>
<td>lng, lat, skip?, limit?</td>
<td></td>
</tr>
<tr>
<td>특정 유저에 속해있는 모든 메모 출력</td>
<td>GET</td>
<td>/api/memos/:id</td>
<td>skip?, limit?</td>
<td></td>
</tr>
<tr>
<td>자신에게 메모를 추가함</td>
<td>POST</td>
<td>/api/memos</td>
<td></td>
<td>text: String, img: Object, tags: String, loc: Object[lng, lat]</td>
</tr>
<tr>
<td>자신의 모든 메모를 삭제함</td>
<td>DELETE</td>
<td>/api/memos</td>
<td></td>
<td></td>
</tr>
<tr>
<td>자신의 특정한 메모 한 개를 삭제함</td>
<td>DELETE</td>
<td>/api/memos/:id</td>
<td></td>
<td></td>
</tr>
<tr>
<td>자신의 특정한 memo의 사진, 텍스트를 바꿈</td>
<td>PUT</td>
<td>/api/memos/:id/TextAndImage</td>
<td></td>
<td>img: Object, text: String</td>
</tr>
</tbody>
</table>
<h3><a id="Users_185"></a>Users</h3>
<table class="table table-striped table-bordered">
<thead>
<tr>
<th>desc</th>
<th>method</th>
<th>url</th>
<th>url-query</th>
<th>data-params</th>
</tr>
</thead>
<tbody>
<tr>
<td>로컬 회원가입</td>
<td>POST</td>
<td>/api/users</td>
<td></td>
<td>email: String, password: String, displayName: String, img?: Object</td>
</tr>
<tr>
<td>자신의 유저 정보 가져오기</td>
<td>GET</td>
<td>/api/users/me</td>
<td></td>
<td></td>
</tr>
<tr>
<td>특정 유저 정보 가져오기</td>
<td>GET</td>
<td>/api/users/:id</td>
<td></td>
<td></td>
</tr>
<tr>
<td>자신의 계정을 삭제함</td>
<td>DELETE</td>
<td>/api/users</td>
<td></td>
<td></td>
</tr>
<tr>
<td>자신의 이메일을 수정</td>
<td>PATCH</td>
<td>/api/users/email</td>
<td></td>
<td>email: String</td>
</tr>
<tr>
<td>자신의 비밀번호를 수정</td>
<td>PATCH</td>
<td>/api/users/password</td>
<td></td>
<td>newPassword: String</td>
</tr>
<tr>
<td>자신의 DisplayName을 수정</td>
<td>PATCH</td>
<td>/api/users/display_name</td>
<td></td>
<td>displayName: String</td>
</tr>
<tr>
<td>자신의 프로필 사진을 수정</td>
<td>PATCH</td>
<td>/api/users/profile</td>
<td></td>
<td>img: Object</td>
</tr>
<tr>
<td>자신의 프로필 사진 삭제</td>
<td>DELETE</td>
<td>/api/users/profile</td>
<td></td>
<td></td>
</tr>
</tbody>
</table>