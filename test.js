(() => {
  const firebaseConfig = {
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

  let signBtn = document.querySelector('#signBtn')

  const preObject = document.querySelector('#object')
  let dateData = Date.now()


  /*let dbRef = firebase.database().ref().child('ucYJc6ZI4UVhTtWs3BtwUI8cfGz2').push()
  
  dbRef.child('messages').set({
    text: 'The Test',
    time: dateData
  }).then(r => {
    console.log('The Data Inserted!')
  }).catch(e => {
    console.log('Error Occured while inserting the Message, ', e)
  })*/

  firebase.database().ref().child('pvkEGEcPshgl0djO11bgdiIJIrF2').on('child_added', snap => {
    console.log(snap)
    let x
    for(x in snap.val()){
      console.log(snap.val()[x])
    }
  })
})()



