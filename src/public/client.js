// @ts-check

;(() => {
  const socket = new WebSocket(`ws://${window.location.host}/ws`)
  const formEl = document.getElementById('form')

  /** @type {HTMLInputElement} | null */
  // @ts-ignore
  const inputEl = document.getElementById('input')

  if (!formEl || !inputEl) {
    throw new Error('Init failed')
  }

  formEl.addEventListener('submit', (event) => {
    event.preventDefault()
    socket.send(
      JSON.stringify({
        nickname: '멋진 물범',
        message: inputEl.value,
      })
    )

    inputEl.value = ''
  })

  socket.addEventListener('message', (event) => {
    alert(event.data)
  })
})()
