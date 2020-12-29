let firebaseConfig = {
  apiKey: "AIzaSyCfptfP9jsgqenBYCh1wo5hz4QHkFr3e8U",
  authDomain: "chat-294407.firebaseapp.com",
  databaseURL: "https://chat-294407.firebaseio.com",
  projectId: "chat-294407",
  storageBucket: "chat-294407.appspot.com",
  messagingSenderId: "497711294917",
  appId: "1:497711294917:web:63145cb12d7ec81b1dc3ac",
  measurementId: "G-SXTZTS5CZN"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth()
const db = firebase.firestore()

firebase.auth().onAuthStateChanged(user => {
  if(user) {
    console.log('Login Sucessfully')
    window.location.replace('/')
  }
})

let toggleSignInBtn = document.querySelector('#signInBtn')
let toggleSignUpBtn = document.querySelector('#signUpBtn')
let signIn = document.querySelector('#signIn')
let signUp = document.querySelector('#signUp')

toggleSignUpBtn.addEventListener('click', e => {
  signIn.style.display = 'none'
  signUp.style.display = 'flex'
  toggleSignUpBtn.style.display = 'none'
  toggleSignInBtn.style.display = 'block'
})

toggleSignInBtn.addEventListener('click', e => {
  signIn.style.display = 'flex'
  signUp.style.display = 'none'
  toggleSignUpBtn.style.display = 'block'
  toggleSignInBtn.style.display = 'none'
})

document.querySelector('#signUpForm').addEventListener('submit', event => {
  //document.querySelector('.loader').style.display = 'block'
  signUp.style.width = '0px'
  event.preventDefault()
  let displayName = document.querySelector('#signUpName').value
  let email = document.querySelector('#signUpEmail').value
  let password = document.querySelector('#signUpPassword').value
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(r => {
    console.log('User is Created')
    document.querySelector('#signUpFeedback').innerText = 'Wait a Sec'
    document.querySelector('#signUpFeedback').style.textAlign = 'center'
  }).catch(e => {
    console.log('Error Occured in signUp: ', e)
    document.querySelector('#signUpFeedback').innerText = e.message
    document.querySelector('#signUpFeedback').style.color = 'red'
    document.querySelector('#signUpFeedback').style.textAlign = 'center'
  })
})

document.querySelector('#signInForm').addEventListener('submit', event => {
  event.preventDefault()
  let loginEmail = document.querySelector('#signInEmail').value
  let loginPassword = document.querySelector('#signInPassword').value
  firebase.auth().signInWithEmailAndPassword(loginEmail, loginPassword)
  .then(r => {
    console.log(r)
    window.location.replace('https://k5p4e.csb.app')
  }).catch(e => {
    console.log('Error Occured While SignIn', e)
    document.querySelector('#signInFeedback').innerText = e.message
    document.querySelector('#signInFeedback').style.color = 'red'
    document.querySelector('#signInFeedback').style.textAlign = 'center'
    document.querySelector('#signInFeedback').style.marginBottom = '1em'
  })
})


document.querySelector('#loginWithGoogle').addEventListener('click', e => {
  console.log(e)
  let provider = new firebase.auth.GoogleAuthProvider()
  firebase.auth().signInWithRedirect(provider)  
  .then(r => {
    console.log('The r', r)
    let val = r.user
    db.collection('accounts').add({
      displayName: val.displayName,
      email: val.email,
      uid: val.uid,
      signUpTime: firebase.firestore.FieldValue.serverTimestamp()
    })
  }).catch(e => {
    console.log('Error Occured while login with google', e)
  })
})