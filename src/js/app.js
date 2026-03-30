const STORAGE_KEY = 'trelloKanbanStateV3'

let state = {
  todo: [],
  inProgress: [],
  done: []
}

let currentCardForModal = null

document.addEventListener('DOMContentLoaded', () => {
  loadState()
  renderBoard()
  setupDelegation()
})

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      state = JSON.parse(saved)
    } catch {
      // если данные битые сбрасываем в дефолт
      state = { todo: [], inProgress: [], done: [] }
    }
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function renderBoard() {
  Object.keys(state).forEach(columnId => {
    const columnEl = document.querySelector(`[data_column="${columnId}"] .cardsList`)
    if (!columnEl) return
    
    columnEl.innerHTML = ''

    state[columnId].forEach(item => {
      const card = createCardElement(item)
      columnEl.appendChild(card)
    })
  })
}

function createCardElement(item) {
  const card = document.createElement('div')
  card.className = 'card'
  
  card.dataset.text = item.text
  const commentsArr = item.comments || []
  card.dataset.comments = JSON.stringify(commentsArr)

  const content = document.createElement('div')
  content.className = 'cardContent'
  
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const hasImage = urlRegex.test(item.text)
  
  if (hasImage) {
    content.innerHTML = item.text.replace(urlRegex, (url) => {
      return `<img src="${url}" class="cardImage" alt="картинка">`
    })
  } else {
    content.textContent = item.text
  }
  
  card.appendChild(content)

  const badges = document.createElement('div')
  badges.className = 'cardBadges'
  
  let badgesHtml = `<span class="badgeIcon">≡</span>`
  badgesHtml += `<span class="badgeIcon commentBtn">💬 <span class="commentCount">${commentsArr.length}</span></span>`
  
  if (hasImage) {
    badgesHtml += `<span class="badgeIcon">📎 1</span>`
  }
  
  badges.innerHTML = badgesHtml
  card.appendChild(badges)

  const deleteBtn = document.createElement('span')
  deleteBtn.className = 'cardDelete'
  deleteBtn.innerHTML = '✖'

  card.appendChild(deleteBtn)
  return card
}

function updateStateFromDOM() {
  const columns = document.querySelectorAll('.column')
  columns.forEach(col => {
    const colId = col.getAttribute('data_column')
    const cards = Array.from(col.querySelectorAll('.card:not(.dragged)'))
    
    state[colId] = cards.map(c => {
      let parsedComments = []
      try {
        parsedComments = JSON.parse(c.dataset.comments)
      } catch {
        // ошибка игнорируется
      }
      
      return {
        text: c.dataset.text,
        comments: parsedComments
      }
    })
  })
  saveState()
}

function renderCommentsInModal() {
  if (!currentCardForModal) return
  
  const container = document.querySelector('.commentsListContainer')
  if (!container) return
  
  container.innerHTML = ''
  
  let comments = []
  try {
    comments = JSON.parse(currentCardForModal.dataset.comments)
  } catch {
    // игнор
  }
  
  if (comments.length === 0) {
    container.innerHTML = '<div style="color: #6b778c; font-size: 14px; text-align: center">комментариев пока нет</div>'
    return
  }
  
  const urlRegex = /(https?:\/\/[^\s]+)/g
  
  comments.forEach((cText, index) => {
    const div = document.createElement('div')
    div.className = 'commentItem'
    
    const itemContent = document.createElement('div')
    
    if (urlRegex.test(cText)) {
      itemContent.innerHTML = cText.replace(urlRegex, (url) => {
        return `<img src="${url}" class="commentImage" alt="изображение">`
      })
    } else {
      itemContent.textContent = cText
    }
    
    const delBtn = document.createElement('span')
    delBtn.className = 'deleteCommentBtn'
    delBtn.innerHTML = '✖'
    delBtn.dataset.index = index
    
    div.appendChild(itemContent)
    div.appendChild(delBtn)
    container.appendChild(div)
  })
}

function setupDelegation() {
  document.addEventListener('click', (event) => {
    const target = event.target

    if (target.classList.contains('deleteCommentBtn')) {
      if (!currentCardForModal) return
      
      const index = parseInt(target.dataset.index, 10)
      let comments = []
      try {
        comments = JSON.parse(currentCardForModal.dataset.comments)
      } catch {
        // игнор
      }
      
      comments.splice(index, 1)
      currentCardForModal.dataset.comments = JSON.stringify(comments)
      currentCardForModal.querySelector('.commentCount').textContent = comments.length
      
      renderCommentsInModal()
      updateStateFromDOM()
      return
    }
    
    if (target.closest('.commentBtn')) {
      currentCardForModal = target.closest('.card')
      renderCommentsInModal()
      const modal = document.getElementById('commentModal')
      modal.classList.remove('hidden')
      document.querySelector('.newCommentInput').focus()
      return
    }
    
    if (target.classList.contains('closeModalBtn') || target.id === 'commentModal') {
      document.getElementById('commentModal').classList.add('hidden')
      currentCardForModal = null
      return
    }
    
    if (target.classList.contains('addCommentBtn')) {
      if (!currentCardForModal) return
      
      const input = document.querySelector('.newCommentInput')
      const text = input.value.trim()
      
      if (text) {
        let comments = []
        try {
          comments = JSON.parse(currentCardForModal.dataset.comments)
        } catch {
          // игнор
        }
        
        comments.push(text)
        currentCardForModal.dataset.comments = JSON.stringify(comments)
        currentCardForModal.querySelector('.commentCount').textContent = comments.length
        
        input.value = ''
        renderCommentsInModal()
        updateStateFromDOM()
      }
      return
    }

    if (target.classList.contains('cardDelete')) {
      target.closest('.card').remove()
      updateStateFromDOM()
      return
    }

    if (target.classList.contains('addCardBtn')) {
      const wrapper = target.closest('.addCardWrapper')
      target.classList.add('hidden')
      wrapper.querySelector('.addCardForm').classList.remove('hidden')
      wrapper.querySelector('textarea').focus()
      return
    }

    if (target.classList.contains('cancelCardBtn')) {
      const wrapper = target.closest('.addCardWrapper')
      wrapper.querySelector('.addCardForm').classList.add('hidden')
      wrapper.querySelector('.addCardBtn').classList.remove('hidden')
      wrapper.querySelector('textarea').value = ''
      return
    }

    if (target.classList.contains('saveCardBtn')) {
      const wrapper = target.closest('.addCardWrapper')
      const textarea = wrapper.querySelector('textarea')
      const text = textarea.value.trim()
      
      if (text) {
        const colId = wrapper.closest('.column').getAttribute('data_column')
        state[colId].push({ text: text, comments: [] })
        saveState()
        renderBoard()
        
        wrapper.querySelector('.addCardForm').classList.add('hidden')
        wrapper.querySelector('.addCardBtn').classList.remove('hidden')
        textarea.value = ''
      }
      return
    }
  })
}

let draggedEl = null
let placeholder = null
let shiftX = 0
let shiftY = 0

document.addEventListener('mousedown', (event) => {
  const card = event.target.closest('.card')
  if (!card || event.target.classList.contains('cardDelete') || event.target.closest('.commentBtn')) return
  
  event.preventDefault()
  
  draggedEl = card
  const rect = draggedEl.getBoundingClientRect()
  
  shiftX = event.clientX - rect.left
  shiftY = event.clientY - rect.top
  
  placeholder = document.createElement('div')
  placeholder.className = 'placeholder'
  placeholder.style.width = `${rect.width}px`
  placeholder.style.height = `${rect.height}px`
  
  draggedEl.parentNode.insertBefore(placeholder, draggedEl)
  
  draggedEl.classList.add('dragged')
  draggedEl.style.width = `${rect.width}px`
  document.body.appendChild(draggedEl)
  
  moveAt(event.pageX, event.pageY)
})

document.addEventListener('mousemove', (event) => {
  if (!draggedEl) return
  
  event.preventDefault()
  moveAt(event.pageX, event.pageY)
  
  const elemBelow = document.elementFromPoint(event.clientX, event.clientY)
  if (!elemBelow) return
  
  const column = elemBelow.closest('.column')
  if (column) {
    const columnList = column.querySelector('.cardsList')
    const cardsBelow = Array.from(columnList.querySelectorAll('.card:not(.dragged)'))
    
    if (cardsBelow.length === 0) {
      columnList.appendChild(placeholder)
      return
    }
    
    const targetCard = cardsBelow.find(c => {
      const rect = c.getBoundingClientRect()
      const cardCenterY = rect.top + rect.height / 2
      return event.clientY < cardCenterY
    })
    
    if (targetCard) {
      columnList.insertBefore(placeholder, targetCard)
    } else {
      columnList.appendChild(placeholder)
    }
  }
})

document.addEventListener('mouseup', () => {
  if (!draggedEl) return
  
  placeholder.parentNode.insertBefore(draggedEl, placeholder)
  
  draggedEl.classList.remove('dragged')
  draggedEl.style.position = ''
  draggedEl.style.top = ''
  draggedEl.style.left = ''
  draggedEl.style.width = ''
  
  placeholder.replaceWith(draggedEl)
  
  draggedEl = null
  placeholder = null
  
  updateStateFromDOM()
})

function moveAt(pageX, pageY) {
  draggedEl.style.left = `${pageX - shiftX}px`
  draggedEl.style.top = `${pageY - shiftY}px`
}