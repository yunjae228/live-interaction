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