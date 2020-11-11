importScripts('https://www.gstatic.com/firebasejs/7.21.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.21.0/firebase-messaging.js')

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

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging()
