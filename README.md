# live-interaction

## 요구사항

1. 간단한 실시간 채팅 서비스
2. db에 채팅내용 저장해 활용

## Frontend
- Template engine : Pug
- CSS framework : Tailwind CSS

## Backend
- Web framework : Koa
- Live networking : koa-websocket
- Data base : MongoDB

## 실행화면
<img width="852" alt="스크린샷 2022-04-21 오후 5 44 09" src="https://user-images.githubusercontent.com/74397919/165445104-ea08a9b7-8aa9-472a-8a05-0668130ac5f3.png">

## 주요기능
```javascript
app.ws.use(
  route.all('/ws', (ctx) => {
    ctx.websocket.on('message', (data) => {
      // @ts-ignore
      const { message, nickname } = JSON.parse(data)

      const { server } = app.ws

      if (!server) {
        return
      }

      // localhost:3000/ws 에 연결된 모든 클라이언트들에게 브로드캐스트 forEach
      server.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            message,
            nickname,
```
```javascript
socket.addEventListener('message', (event) => {
    chats.push(JSON.parse(event.data))

    // 채팅목록 초기화
    chatsEl.innerHTML = ''

    // chatsElement 안에 받아온 채팅들을 하나씩 끼워넣기 (채팅목록)
    chats.forEach(({ nickname, message }) => {
      const div = document.createElement('div')
      div.innerText = `${nickname} : ${message}`
      chatsEl.appendChild(div)
```

## 브로드캐스트 적용
<img width="1440" alt="스크린샷 2022-05-03 오후 2 11 49" src="https://user-images.githubusercontent.com/74397919/166407193-871e7e66-a1e1-4782-9def-61a39517df3f.png">

    닉네임에 필요한 "형용사"+"명사" 각기 다른 배열로 저장 후    
    두 가지 배열을 랜덤으로 합치는 function pickRandom(array) 함수로 클라이언트마다 각기 다른   
    닉네임을 생성함

## 채팅목록을 MongoDB 활용, collection에 저장
    Why? => 서버가 죽고 다시살아나도 채팅 정보가 날아가지 않고 남아있고, client가 언제든 접속해도   
    채팅목록을 볼 수 있게 하기 위함
```javascript

    // mongodb 연결은 단 한번만 해도되니 따로 _client변수로 선언해서 사용하도록 하자 
const _client = mongoClient.connect()

// mongodb client 연결 변수를 토대로 collection과 db 생성 (chat db)
async function getChatsCollection() {
  const client = await _client
  return client.db('chat').collection('chats')
}
```


## 에러
<img width="1440" alt="스크린샷 2022-05-03 오후 2 11 49" src="https://user-images.githubusercontent.com/74397919/166407193-871e7e66-a1e1-4782-9def-61a39517df3f.png">   


    DB와 연결 후 client측 메시지가 chatsElement에 push가 되지 않는 상황이 발생하였다.

```javascript   
else if (type === 'chat') {
      const chat = payload
      chats.push(chat)
    }
```
확인해보니 입력한 chat로직에는 문제가 없었다. 하지만,


```javascript
server.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            type: 'chat',
            palyload: {   // 여기서 오타로 인한 오류발생
              message,
              nickname,
            },
          })
        )
```
~~오타 확인을 생활화하자~~
---------------------------------------
## 에러 수정 후 


<img width="1434" alt="스크린샷 2022-05-03 오후 5 40 38" src="https://user-images.githubusercontent.com/74397919/166425840-cba9007d-a761-4c7e-8ccb-7fdf95d2a6f0.png">

성공적으로 broadcast까지 완료

<img width="864" alt="스크린샷 2022-05-03 오후 4 37 21" src="https://user-images.githubusercontent.com/74397919/166425971-87824589-8f70-4fe0-ab57-d0b7169e4ad1.png">

DB에도 잘 들어가진 모습