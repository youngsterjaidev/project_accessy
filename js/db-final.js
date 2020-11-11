let messageContent = document.querySelector('.message-content')
let list = document.querySelector('ul')
let addButton = document.querySelector('.users')
let buttonGroup = document.getElementById('bg')
let obj = {name: 'john'}
let user = {
  displayName: null,
  profilePic: null
}
let msg = document.querySelector('#message')
let toggleUser = document.querySelector('#toggleUsers')
let logout = document.querySelector('#logout')
let canvas = document.querySelector('#c')
let canvasCtx = canvas.getContext('2d')

firebase.auth().onAuthStateChanged(user => {
  if(!user) {
    console.log('You Should login first')
    window.location.replace('/signUp.html')
  } else {


let getUser = () => {
  return firebase.auth().currentUser.uid
}

let getEvent = () => {
  firebase.firestore().collection('event').orderBy('time', 'desc').onSnapshot(data  => {
    let snap = data.docChanges()
    snap.forEach(d => {
      if(d.doc.metadata.hasPendingWrites) {
      } else {
        let postedBy = d.doc.data().postedBy
        firebase.firestore().collection('accounts').where('uid', '==', postedBy).get()
        .then(r => {
          let getedData = r.docChanges()
          getedData.forEach(finalData => {
            let el = document.createElement('div')
            el.classList.add('post')
            el.innerHTML = '<div class="profile"><div class="profile-section"><img src="'+ finalData.doc.data().profilePic + '" alt="" class="profile-pic"><div class="displayName">'+ finalData.doc.data().displayName + '</div></div><i class="im im-menu-dot-v"></i></div><img src="'+ d.doc.data().eventPicUrl +'" alt="" class="post-pic"><div class="reaction"><i class="im im-heart"></i><i class="im im-barcode"></i><i class="im im-menu-dot-h"></i></div>'
            document.querySelector('.app').append(el)
          })
        })
      }
    })
  })
}

document.querySelector("#chatForm").addEventListener('submit', e => {
  e.preventDefault()
  console.log('The Message is: ', msg.value)
  let dateData = Date.now()
  firebase.firestore().collection('messages').add({
    id: dateData,
    from: getUser(),
    sendTo: obj.name,
    text: msg.value,
    date: dateData,
    conversation: [getUser(), obj.name],
    time: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(r => {
    document.querySelector("#chatForm").reset()
  }).catch(e => {
    console.log('Error Occured: ', e)
  })
})

let displayUserList = value => {
  let btn = document.createElement('button')
  btn.innerText = value.data().displayName
  btn.id = value.data().displayName
  btn.classList.add('user-name')
  addButton.appendChild(btn)
}

let displayMessage = val => {
  firebase.firestore().collection('messages').orderBy('time').where('conversation', 'in', [[obj.name, getUser()], [getUser(), obj.name]]).onSnapshot(snapshot => {
    let d = snapshot.docChanges()
    d.forEach(snap => {
      if(!snap.doc.metadata.hasPendingWrites) {
        let li = document.createElement('div')
        if(snap.doc.data().sendTo === obj.name){
          li.classList.add('reciever')
          li.innerHTML = `<div class="msg" style="background: black; color: white;">${snap.doc.data().text}</div><div class="stopper"></div>`
        }
        else{
          li.classList.add('sender')
          li.innerHTML = `<div class="msg" style="background: rgb(37 239 0 / 32%); color: black;">${snap.doc.data().text}</div><div class="stopper"></div>`
        }
        messageContent.appendChild(li)
      } else {
        console.log('Prank')
      }
    })
  })
}

let getAllUser = () => {
  firebase.firestore().collection('accounts').onSnapshot(snap => {
    let snapshot = snap.docChanges()
    snapshot.forEach(data => {
      let d = data.doc
      if(!d.metadata.hasPendingWrites) {
        if(d.data().uid === getUser()) {
          user.displayName = d.data().displayName
          user.profilePic = d.data().profilePic
          document.querySelector('#profilePic').src = d.data().profilePic
          document.querySelector('#userDisplayName').innerText = d.data().displayName
        } else {
          displayUserList(d)
          document.getElementById(d.data().displayName).addEventListener('click', e => {
            messageContent.innerHTML = 'empty'
            let v = document.getElementById(d.data().displayName).innerText
            toggleUser.innerText = v
            obj.name = d.data().uid
            displayMessage(d.data().uid)
          })
        }
      } else {
        console.log('Something Went Wrong')
      }
    })
  })
}

logout.addEventListener('click', e => {
  firebase.auth().signOut()
})


document.querySelector('#file').addEventListener('change', e => {
  console.log('The image Event: ', e)

  let file = e.target.files[0]

  // create Image
  createImageBitmap(file)
  .then(bitmap => {
    canvas.width = bitmap.width
    canvas.height = bitmap.height
    canvasCtx.drawImage(bitmap, 0, 0)
  }).catch(e => {
    console.log('Error Occured while inserting Image in Canvas ', e)
  })
})

document.querySelector('#fileForm').addEventListener('submit', e => {
  e.preventDefault()

  let file = e.target[0].files[0]
  console.log(file)

  firebase.storage().ref('events/' + file.name).put(file)
  .then(r => {
    r.ref.getDownloadURL()
    .then(url => {
      firebase.firestore().collection('event').add({
        eventPicUrl: url,
        postedBy: getUser(),
        time: firebase.firestore.FieldValue.serverTimestamp()
      }).then(r => {
        console.log('Inserted!')
        canvasCtx.clearRect(0,0, canvas.width, canvas.height)
        document.querySelector('#fileForm').reset()
      }).catch(e => {
        console.log('Error Occured', e)
      })
    })
  }).catch(e => {
    console.log('Error Occured while posting Image - ', e)
  }) 
})

firebase.messaging().onMessage(payload => {
  console.log('On Message - ', payload)
})

let saveDeviceToken = () => {
  firebase.messaging().getToken()
  .then(token => {
    firebase.firestore().collection('FCMToken').doc(getUser()).set({
      uid: user.uid,
      token: token
    }).then(r => {
      console.log('Token get to the collection - ', r)
    }).catch(e => {
      console.log('Error Occured - ', e)
    })
  }).catch(e => {
    console.log('Error Occured', e)
  })
}

/*setInterval(() => {
  let dbRef = firebase.database().ref().child(getUser()).push()
  dbRef.child('messages').set({
    text: Date.now(),
    sendTo: 'john',
  })
  .then(r => {
    console.log('The Messages is gone')
  }).catch(e => {
    console.log('Error Occured set Interval', e)
  })
}, 10000)*/

    saveDeviceToken()
    
    getEvent()

    getAllUser()
  }
})
