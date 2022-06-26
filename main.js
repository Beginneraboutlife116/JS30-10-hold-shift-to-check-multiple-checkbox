const endpoint = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';
const inbox = document.querySelector('.inbox')

fetch(endpoint).then(data => data.json()).then(data => {
  inbox.innerHTML = ''
  for (let i = 10; i >= 1; i--) {
    const randomNumber = Math.floor(Math.random() * data.length)
    const inboxMsg = `
      <label class="item">
        <input type="checkbox" id="${data[randomNumber].rank}" data-checkbox>
        <p>${data[randomNumber].city}, ${data[randomNumber].population}</p>
      </label>
    `
    inbox.insertAdjacentHTML('beforeend', inboxMsg)
  }

  const checkboxes = document.querySelectorAll('[data-checkbox]')
  
  /**
   * 1. 搜尋該input的index位置 - [x]
   * 2. 當使用者按下shift，無論左右邊(ShiftLeft, ShiftRight)，只要點擊了input，就會造成兩個位置間的input被checked - [x]
   * edge case:
   * 1. 當使用者取消input之後，按下Shift點擊，是並不會造成一整排被點擊 - [x]
   *    - 一定要有input事實先發生才會驅動！
   *
   * 
   * 看完後得知：
   * 1. 有shiftKey可以使用 => Web API
   * 2. 不要用index，而直接用forEach的好處是可以不用擔心DOM被改變
   *    - 經過實驗，如果將DOM刪除掉，該原本的checkboxes的index並不會改變！所以這會造成issue
   * edge case:
   * 當使用者直接用shift + click重複點擊同一個input，會造成從尾巴到點擊處的input都被checked！
   */

  //* version 3, 依據Web bos去做改良
  const inputEvents = []
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', (event) => {
      const target = event.target
      if (target.checked) {
        inputEvents.push(target)
      } else {
        inputEvents.splice(inputEvents.findIndex(event => event.rank === target.id), 1)
      }
      if (event.shiftKey && inputEvents.length > 1) {
        let inBetween = false
        checkboxes.forEach(checkbox => {
          if (checkbox.id === inputEvents[inputEvents.length - 2].id || checkbox.id === inputEvents[inputEvents.length - 1].id) {
            inBetween = !inBetween
          }
          if (inBetween) {
            checkbox.checked = true
          }
        })
      }
    })
  })


  //* version 1
  /**
   * 用來改變input的確認狀態
   * @param {number} shiftKeyIndex - shift key所在的index
   */
  // function changeInputChecked(shiftKeyIndex) {
  //   const prevIndex = inputIndexes[shiftKeyIndex - 1]
  //   const nextIndex = inputIndexes[shiftKeyIndex + 1]
  //   if (prevIndex === undefined || nextIndex === undefined) return
  //   if (prevIndex < nextIndex) {
  //     for (let i = prevIndex + 1; i <= nextIndex; i++) {
  //       if (checkboxes[i].checked !== true) {
  //         checkboxes[i].checked = true
  //         inputIndexes.splice(i, 0, i)
  //       }
  //     }
  //   } else {
  //     for (let i = prevIndex - 1; i >= nextIndex; i--) {
  //       if (checkboxes[i].checked !== true) {
  //         checkboxes[i].checked = true
  //         inputIndexes.splice(i, 0, i)
  //       }
  //     }
  //   }
  // }

  // const inputIndexes = []
  // checkboxes.forEach((checkbox, index) => {
  //   checkbox.addEventListener('click', (event) => {
  //     const eventChecked = event.target.checked
  //     if (eventChecked) {
  //       inputIndexes.push(index)
  //     } else {
  //       inputIndexes.splice(inputIndexes.indexOf(index), 1)
  //     }
  //     if (inputIndexes.indexOf(-1) !== -1) {
  //       changeInputChecked(inputIndexes.indexOf(-1))
  //       inputIndexes.splice(inputIndexes.indexOf(-1), 1)
  //     }
  //   })
  //   checkbox.addEventListener('keydown', (event) => {
  //     if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
  //       inputIndexes.push(-1)
  //     }
  //   })
  //   checkbox.addEventListener('keyup', (event) => {
  //     if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
  //       if (inputIndexes[inputIndexes.length - 1] === -1) {
  //         inputIndexes.pop()
  //       }
  //     }
  //   })
  // })

  //* version 2, mimic what web bos did.
  // let lastChecked = null
  // checkboxes.forEach(checkbox => {
  //   checkbox.addEventListener('click', event => {
  //     if (event.shiftKey && event.target.checked) {
  //       let inBetween = false
  //       checkboxes.forEach(checkbox => {
  //         if ((checkbox === event.target || checkbox === lastChecked) && lastChecked) {
  //           inBetween = !inBetween
  //         }
  //         if (inBetween) {
  //           checkbox.checked = true
  //         }
  //       })
  //     }
  //     lastChecked = event.target
  //   })
  // })
}).catch(error => console.error(error))