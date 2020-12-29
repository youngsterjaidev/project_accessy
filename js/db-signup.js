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

const auth = firebase.auth()
const db = firebase.firestore()
let signUpForm = document.getElementById('signUpForm')
let loginForm = document.getElementById('loginForm')

auth.onAuthStateChanged(user => {
  if(user) {
    console.log('Login Sucessfully')
    window.location.replace('/')
  }
})

signUpForm.addEventListener('submit', event => {
  event.preventDefault()
  let email = document.querySelector('#email').value
  let password = document.querySelector('#password').value
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(r => {
    let val = r.user
      db.collection('accounts').add({
      displayName: val.displayName,
      email: val.email,
      uid: val.uid,
      signUpTime: firebase.firestore.FieldValue.serverTimestamp()
    })
  }).catch(e => {
    console.log('Error Occured in signUp: ', e)
  })
})

loginForm.addEventListener('submit', event => {
  event.preventDefault()
  let loginEmail = document.querySelector('#loginEmail').value
  let loginPassword = document.querySelector('#loginPassword').value
  firebase.auth().signInWithEmailAndPassword(loginEmail, loginPassword)
  .then(r => {
    console.log(r)
    window.location.replace('/')
  }).catch(e => {
    console.log('Error Occured While SignIn', e)
  })
})

document.querySelector('#loginWithGoogle').addEventListener('click', e => {
  console.log(e)
  let provider = new firebase.auth.GoogleAuthProvider()
  firebase.auth().signInWithPopup(provider)
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
