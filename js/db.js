var firebaseConfig = {
  apiKey: "AIzaSyBRE33_F9PRNHHL59AZ4yJH9Ll8q2JKgjY",
  authDomain: "accessy.firebaseapp.com",
  databaseURL: "https://accessy.firebaseio.com",
  projectId: "accessy",
  storageBucket: "accessy.appspot.com",
  messagingSenderId: "1051338732011",
  appId: "1:1051338732011:web:83f471c02da185b88a29ae",
  measurementId: "G-Q28K85WM30"
};
// Initialize Firebase 
firebase.initializeApp(firebaseConfig);

let sendBtn = document.querySelector('#sendBtn')
let msg = document.querySelector("#message")
let chatForm = document.querySelector("#chatForm")
let userList = []

const auth = firebase.auth()
const db = firebase.firestore()

let obj = { name: null, id: null }

let cl = { name: null }

console.log('The firebase is initialized !')

let getUser = () => {
  return firebase.auth().currentUser.uid
}

let getEmail = () => {
  return firebase.auth().currentUser.email
}

let getProfilePic = () => {
  return firebase.auth().currentUser
}

let getMsgUser = () => {
  db.collection().onSnapshot(r => {
    console.log(r)
  })
}

document.querySelector("#chatForm").addEventListener('submit', e => {
  e.preventDefault()
  console.log('The Message is: ', msg.value)
  let dateData = Date.now()
  /*firebase.database().ref(getUser()).child('messages').child(obj.name).child(dateData).set({
    username: getEmail(),
    text: msg.value,
  })
  .then(r => {
    console.log('Message get Inserted :)')
    document.querySelector("#chatForm").reset()
  }).catch(e => {
    console.log('Error Occured: ', e)
  })*/

  let dbRef = firebase.database().ref().child(getUser()).push()
  
  dbRef.child('messages').set({
    text: msg.value,
    sendTo: obj.name,
    from: getUser(),
    time: dateData
  }).then(r => {
    console.log('The Data Inserted!')
    document.querySelector('#chatForm').reset()
  }).catch(e => {
    console.log('Error Occured while inserting the Message, ', e)
  })

})


let addMsg = value => {
  let el = document.createElement('div')
  el.classList.add('reciever')
  el.innerHTML = `<div class="msg">${value}</div><div class="stopper"></div>`
  document.querySelector('.message-content').append(el)
}


let fetchUserMsg = value => {
  let el = document.createElement('div')
  el.innerHTML = value
  document.querySelector('.chat-content').append(el)
  console.log(el)
}


let displayUserList = async value => {
  let el = document.createElement('button')
  el.classList.add('user-name')
  el.setAttribute('id', value)
  //el.classList.add('e')
  el.innerHTML = `${value}`
  userList.push(value)
  console.log(userList)
  document.querySelector('.users').append(el)
}

let fetchMessage = () => {
  db.collection(getUser()).onSnapshot(doc => {
    let snapshot = doc.docChanges()
    console.log(snapshot)
    snapshot.forEach(data => {
      let d = data.doc
      if(!d.metadata.hasPendingWrites) {
        addMsg(d.data().message)
      } else {
        console.log('Something Went Wrong')
      }
    })
  })
  /*docRef.doc('jack').onSnapshot(snapshot => {
    console.log('The Snapshot: ', snapshot.data())
  })*/
}


let fetchMsg = val => {
  let dbRef = firebase.database().ref(val).child('messages')
  dbRef.on('child_added', snap => {
    let d = snap.val()
    console.log('Fetched Msg: ', d.text)
    addMsg(d.text)
    //addMsg(d.text)
    //let x 
    //for(x in d) {
      //console.log(d[x])
      //addMsg(d[x].text)
    //} 
  })
}

/*let findMsg = val => {
  firebase.firestore().collection('accounts').where('sendTo', '==', val).onSnapshot(r => {
    var cities = [];
      r.forEach(function(doc) {
        fetchMsg(doc.data().uid)              
        obj.name = doc.data().uid
        console.log(obj)
        getMessage(doc.data().uid)
        return doc.data().uid
      });
  })
}*/

/*let findMsg = val => {
  firebase.firestore().collection(getUser()).where('sendTo', '==', val).onSnapshot(r => {
    r.forEach(doc => {
      console.log(doc.data().uid)
    })
  })
}*/

let getMessage = val => {
  let dbRef = firebase.database().ref(getUser()).child('messages').child(val)
  dbRef.on('child_added', snap => {
    console.log('The Snapshot: ', snap.val())
    let d = snap.val()
    addMsg(d.text)
    //let x 
    //for(x in d) {
      //console.log(d[x])
      //addMsg(d[x].text)
    //} 
  })
}
/*
let getAllUser =  async () => {
  await db.collection('accounts').onSnapshot(doc => {
    let snapshot = doc.docChanges()
    snapshot.forEach(d => {
      if(d.type === 'added') {
        let value = d.doc.data().displayName
        displayUserList(value)
      } else {
        console.log('No User are there: ')
      }
    })
  })
} */

let getData = val => {
  firebase.database().ref().child(getUser()).orderByChild('messages/sendTo').equalTo(val).on('value', snap => {
    let x
    console.log('The Snap: ', snap.val())
    for(x in snap.val()){
      console.log(snap.val()[x])
      addMsg(snap.val()[x].messages.text)
    }
  })
}

let getAllUser = async () => {
  try {
    let r = await db.collection('accounts').onSnapshot(doc => {
      let snapshot = doc.docChanges()
      snapshot.forEach(d => {
        if(d.type === 'added') {
          let value = d.doc.data().displayName
          displayUserList(value)
          .then(() => {
            document.getElementById(value).addEventListener('click', e => {
              let val = document.getElementById(value).id
              document.querySelector('.message-content').innerHTML = 'a'
              firebase.firestore().collection('accounts').where('displayName', '==', value).onSnapshot(r => {
                r.forEach(doc => {
                  obj.name = doc.data().uid
                  obj.id = value
                  console.log(obj.name)
                  getData(obj.name)
                })
              })
              //findMsg(val)
            })
          })
        } else {
          console.log('No User are there: ')
        }
      })
    })
  }catch(e) {
    console.log('The Error in try in catch:', e)
  }
}


firebase.auth().signInWithEmailAndPassword('test333@gmail.com', 'test000')
.then(result => {
  //fetchMessage()
  getAllUser()
}).catch(e => {
  console.log('The Error Occured: ', e)
})
