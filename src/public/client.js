// @ts-check

;(() => {
  const socket = new WebSocket(`ws://${window.location.host}/ws`)
  const formEl = document.getElementById('form')
  const chatsEl = document.getElementById('chats')

  /** @type {HTMLInputElement} | null */
  // @ts-ignore
  const inputEl = document.getElementById('input')

  if (!formEl || !inputEl || !chatsEl) {
    throw new Error('Init failed')
  }

  /**
   * @typedef Chat
   * @property {string} nickname
   * @property {string} message
   */

  /**
   * @type { Chat[] }
   */
  //타입 정의 할 필요가 있음 -> why? chats가 뭔지 모르기때문 & 편함
  const chats = []

  // 닉네임 랜덤생성
  const adjectives = ['멋진', '훌륭한', '친절한', '새침한']
  const animals = ['물범', '사자', '사슴', '돌고래', '독수리']

  // array 파라미터가 뭔지 모르기 때문에 error 발생 -> @param 정의
  /**
   * @param {string[]} array
   * @returns {string}
   */
  function pickRandom(array) {
    const randomIdx = Math.floor(Math.random() * array.length)
    const result = array[randomIdx]
    if (!result) {
      throw new Error('array length is 0')
    }

    return result
  }

  const myNickname = `${pickRandom(adjectives)} ${pickRandom(animals)}`

  formEl.addEventListener('submit', (event) => {
    event.preventDefault()
    socket.send(
      JSON.stringify({
        nickname: myNickname,
        message: inputEl.value,
      })
    )

    inputEl.value = ''
  })

  socket.addEventListener('message', (event) => {
    chats.push(JSON.parse(event.data))

    // 채팅목록 초기화
    chatsEl.innerHTML = ''

    // chatsElement 안에 받아온 채팅들을 하나씩 끼워넣기
    chats.forEach(({ nickname, message }) => {
      const div = document.createElement('div')
      div.innerText = `${nickname} : ${message}`
      chatsEl.appendChild(div)
    })
  })
})()
