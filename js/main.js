let paperplaneBtn = document.querySelector('#togglePaperplane')
let sidebarBtn = document.querySelector('#toggleSidebar')
let UsersBtn = document.querySelector('#toggleUsers')
let uploadBtn = document.querySelector('#uploadBtn')
let paperplane = document.querySelector('.paperplane')
let sidebar = document.querySelector('.sidebar')
let users = document.querySelector('.users')
let upload = document.querySelector('.uploadPost')
 
paperplaneBtn.addEventListener('click', event => {
  if (paperplane.style.display === 'flex') {
    paperplane.style.display = 'none'
    paperplaneBtn.style.color = '#000'
  } else {
    paperplane.style.display = 'flex'
    paperplaneBtn.style.color = 'rgb(210 210 210)'
  }
})

sidebarBtn.addEventListener('click', event => {
  if (sidebar.style.display === 'flex') {
    sidebar.style.display = 'none'
    sidebarBtn.style.color = '#000'
  } else {
    sidebar.style.display = 'flex'
    sidebarBtn.style.color = 'rgb(210 210 210)'
  }
})

UsersBtn.addEventListener('click', event => {
  console.log(event)
  if (users.style.display === 'block') {
    users.style.display = 'none'
    UsersBtn.style.color = 'red'
  } else {
    users.style.display = 'block'
    UsersBtn.style.color = '#000'
  }
})

uploadBtn.addEventListener('click', event => {
  console.log(event)
  if (upload.style.display === 'flex') {
    upload.style.display = 'none'
    uploadBtn.style.color = '#000'
  } else {
    upload.style.display = 'flex'
    uploadBtn.style.color = 'rgb(210 210 210)'
  }
})