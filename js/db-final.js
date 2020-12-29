let messageContent = document.querySelector('.message-content')
let list = document.querySelector('ul')
let addButton = document.querySelector('.users')
let buttonGroup = document.getElementById('bg')
let obj = {
    name: 'john',
    RegisterId: 'fdf'
}
let user = {
    displayName: null,
    profilePic: null
}
let msg = document.querySelector('#message')
let toggleUser = document.querySelector('#toggleUsers')
let logout = document.querySelector('#logout')
let canvas = document.querySelector('#c')
let canvasCtx = canvas.getContext('2d')

let fileForm = document.querySelector("#fileForm");
let fileBtn = document.querySelector("#fileBtn");
let file = document.querySelector("#file");
let eventName = document.querySelector("#eventName");
let eventDesc = document.querySelector("#eventDesc");
let eventPlace = document.querySelector("#eventPlace");
let coordinated = document.querySelector("#eventCoordinate");
let startAt = document.querySelector("#startAt");
let endAt = document.querySelector("#endAt");
let feedback = document.querySelector(".feedback");
let postForm = document.querySelector("#postForm");
let switchBtn = document.querySelector("#switchBtn");
let postName = document.querySelector("titleName");
let postCaption = document.querySelector("titleCaption");
let postFeedback = document.querySelector('#postFeedback')
let fileFeedback = document.querySelector('#fileFeedback')

const auth = firebase.auth()
const db = firebase.firestore()

canvasCtx.font = '30px Arial'
canvasCtx.textAlign = 'center'
canvasCtx.fillText('Scroll down', canvas.width / 2, canvas.height / 2)

switchBtn.addEventListener("click", event=>{
    if (fileForm.style.display === "none") {
        fileForm.style.display = "block";
        postForm.style.display = "none";
        switchBtn.innerText = "Post";
    } else {
        fileForm.style.display = "none";
        postForm.style.display = "block";
        switchBtn.innerText = "File";
    }
}
);

auth.onAuthStateChanged(user=>{
    if (!user) {
        console.log('You Should login first')
        window.location.replace('/signUp.html')
    } else {

        firebase.firestore().collection('users').doc(user.uid).set({
            uid: user.uid,
            time: firebase.firestore.FieldValue.serverTimestamp(),
        }).then(()=>{
            console.log('User is online')
        }
        ).catch(e=>{
            console.log('Error Occured', e)
        }
        )

        let getUser = ()=>{
            return auth.currentUser.uid
        }

        let getUserDisplayName = ()=>{
            return auth.currentUser.displayName
        }

        let getUserProfilePic = ()=>{
            return auth.currentUser.photoURL
        }

        let test = ()=>{
            console.log('congo')
        }

        let getId = (l)=>{
            let text = ''
            let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
            for (i = 0; i < l; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length))
            }

            return text
        }

        let renderEventRegistration = (item,i)=>{
            document.querySelector('.register-body').innerHTML = ''
            let el = document.createElement('div')
            el.classList.add('register-content')
            el.innerHTML = `<h1 style="text-align: center;background: #fff;border: 1px solid deepskyblue;border-radius: 4px;padding: 1em;">${item.data().eventName}</h1><h3 style="color: #ff8e8e;">${item.data().startAt} - ${item.data().endAt}</h3><h4>${item.data().eventDesc}</h4><h4>Under the supervison -  ${item.data().coordinatedBy}</h4>`
            db.collection('event').doc(i).collection('registered').where('name', '==', getUser()).get().then(r=>{
                if (r.size === 0) {
                    let btn = document.createElement('button')
                    btn.innerText = 'Confirm Join'
                    btn.style.background = '#000'
                    btn.style.color = '#fff'
                    btn.style.display = 'block'
                    btn.style.width = '100%'
                    btn.style.padding = '1em'
                    btn.onclick = ()=>{
                        db.collection('event').doc(i).collection('registered').add({
                            name: getUser(),
                            eventId: i,
                            userName: getUserDisplayName(),
                            time: firebase.firestore.FieldValue.serverTimestamp()
                        }).then(r=>{
                            console.log('Got Register')
                            btn.disabled = false
                            btn.style.display = 'none'
                        }
                        ).catch(e=>{
                            console.log('Error Occured', e)
                        }
                        )
                    }
                    el.append(btn)
                } else {
                    let feedback = document.createElement('div')
                    feedback.innerHTML = 'You are Already Registered !'
                    feedback.style.color = 'red'
                    el.append(feedback)
                }
            }
            )
            document.querySelector('.register-body').append(el)
        }

        /*addClick = item=>{
            let c = item.data().category
            if (c === 'event') {
                document.getElementById(item.data().eventRegisterId).addEventListener('click', e=>{
                    console.log('Event is Pressed')
                }
                )
            } else {
                document.getElementById(item.data().photoRegisterId).addEventListener('click', e=>{
                    console.log('Photo is Pressed')
                }
                )
            }
        }*/

        let addClickEvent = item=>{
            let f = item.data().eventRegisterId
            console.log('fe', f)
            document.getElementById(item.data().eventRegisterId).addEventListener('click', e=>{
                document.querySelector('.register').style.height = '60vh'
                getFirestoreData(item.id)
            }
            )
        }

        let addClickPhoto = item=>{
            let f = item.data().photoInterestId
            console.log('f', typeof (f))
            document.getElementById(item.data().photoRegisterId).addEventListener('click', e=>{
                document.querySelector('.register').style.height = '60vh'
                getFirestoreData(item.id)
            }
            )
            /*document.getElementById(f).addEventListener('click', e=>{
                console.log('get in the ', e)
                db.collection('event').doc(item.id).collection('liked').where('likedBy', '==', getUser()).get().then(fd=>{
                    if (fd.size === 0) {
                        document.getElementById(item.data().photoInterestId).classList.remove('im-star-o')
                        document.getElementById(item.data().photoInterestId).classList.add('im-star')
                        db.collection('event').doc(item.id).collection('liked').add({
                            liked: true,
                            likedBy: getUser(),
                            time: firebase.firestore.FieldValue.serverTimestamp()
                        }).then(od=>{
                            console.log('Liked it')
                        }
                        )
                    } else {
                        document.getElementById(item.data().photoInterestId).classList.remove('im-star')
                        document.getElementById(item.data().photoInterestId).classList.add('im-star-o')
                    }
                }
                )
            }
            )*/
        }

        let getFirestoreData = item=>{
            db.collection('event').doc(item).onSnapshot(d=>{
                renderEventRegistration(d, item)
            }
            )
        }

        let addEvent = async(item,result)=>{
            try {
                let el = await document.createElement('div')
                await el.classList.add('post')
                console.log(item.data())
                if (item.data().category === 'photo') {
                    db.collection('event').doc(item.id).collection('liked').onSnapshot(r=>{
                        if (r.size === 0) {
                            console.log(' The uid', user.uid)
                            //db.collection('event').doc(item.id).collection('liked').where('name', '==', getUser())
                            el.innerHTML = '<div class="profile"><div class="profile-section"><img src="' + result.profilePic + '" alt="" class="profile-pic"><div class="displayName">' + result.displayName + '</div></div><i class="im im-menu-dot-v"></i></div><img src="' + item.data().eventPicUrl + '" alt="" class="post-pic"><div class="desc"><div style="padding: 1em 0em; font-weight: 700;">' + r.size + ' likes</div><div class="">' + item.data().caption + '</div><div class="reaction"><i id="' + item.data().photoInterestId + '" class="im im-star-o"></i><i class="im im-data"></i><i class="im im-menu-dot-h"></i></div>'
                            document.getElementById(item.data().photoInterestId).addEventListener('click', e=>{
                                db.collection('event').doc(item.id).collection('liked').where('name', '==', getUser()).get().then(gt=>{
                                    if (gt.empty) {
                                        // okay
                                        document.getElementById(item.data().photoInterestId).classList.remove('im-star-o')
                                        document.getElementById(item.data().photoInterestId).classList.add('im-star')
                                        db.collection('event').doc(item.id).collection('liked').add({
                                            liked: true,
                                            eventId: item.id,
                                            name: getUser(),
                                            time: firebase.firestore.FieldValue.serverTimestamp()
                                        }).then(final=>{
                                            console.log('liked Get it')
                                        }
                                        ).catch(e=>{
                                            console.log('Error Occured', e)
                                        }
                                        )
                                    } else {
                                        console.log('Unliked again')
                                        db.collection('event').doc(item.id).collection('liked').where('name', '==', getUser()).get().then(dt=>{
                                            dt.docChanges().forEach(kt=>{
                                                db.collection('event').doc(item.id).collection('liked').doc(kt.doc.id).delete().then(()=>{
                                                    document.getElementById(item.data().photoInterestId).classList.remove('im-star')
                                                    document.getElementById(item.data().photoInterestId).classList.add('im-star-o')
                                                }
                                                ).catch(e=>{
                                                    console.log('Error Occured', e)
                                                }
                                                )
                                            }
                                            )
                                        }
                                        ).catch(e=>{
                                            console.log('Error Occured', e)
                                        }
                                        )
                                    }
                                }
                                )
                            }
                            )
                        } else {
                            db.collection('event').doc(item.id).collection('liked').where('name', '==', getUser()).get().then(rt=>{
                                if (rt.empty) {
                                    el.innerHTML = '<div class="profile"><div class="profile-section"><img src="' + result.profilePic + '" alt="" class="profile-pic"><div class="displayName">' + result.displayName + '</div></div><i class="im im-menu-dot-v"></i></div><img src="' + item.data().eventPicUrl + '" alt="" class="post-pic"><div class="desc"><div style="padding: 1em 0em; font-weight: 700;">' + r.size + ' likes</div><div class="">' + item.data().caption + '</div><div class="reaction"><i id="' + item.data().photoInterestId + '" class="im im-star-o"></i><i class="im im-data"></i><i class="im im-menu-dot-h"></i></div>'
                                    document.getElementById(item.data().photoInterestId).addEventListener('click', e=>{
                                        db.collection('event').doc(item.id).collection('liked').where('name', '==', getUser()).get().then(gt=>{
                                            if (gt.empty) {
                                                // okay
                                                document.getElementById(item.data().photoInterestId).classList.remove('im-star-o')
                                                document.getElementById(item.data().photoInterestId).classList.add('im-star')
                                                db.collection('event').doc(item.id).collection('liked').add({
                                                    liked: true,
                                                    eventId: item.id,
                                                    name: getUser(),
                                                    time: firebase.firestore.FieldValue.serverTimestamp()
                                                }).then(final=>{
                                                    console.log('liked Get it')
                                                }
                                                ).catch(e=>{
                                                    console.log('Error Occured', e)
                                                }
                                                )
                                            } else {
                                                console.log('Unliked again')
                                                db.collection('event').doc(item.id).collection('liked').where('name', '==', getUser()).get().then(dt=>{
                                                    dt.docChanges().forEach(kt=>{
                                                        db.collection('event').doc(item.id).collection('liked').doc(kt.doc.id).delete().then(()=>{
                                                            document.getElementById(item.data().photoInterestId).classList.remove('im-star')
                                                            document.getElementById(item.data().photoInterestId).classList.add('im-star-o')
                                                        }
                                                        ).catch(e=>{
                                                            console.log('Error Occured', e)
                                                        }
                                                        )
                                                    }
                                                    )
                                                }
                                                ).catch(e=>{
                                                    console.log('Error Occured', e)
                                                }
                                                )
                                            }
                                        }
                                        )
                                    }
                                    )
                                } else {
                                    el.innerHTML = '<div class="profile"><div class="profile-section"><img src="' + result.profilePic + '" alt="" class="profile-pic"><div class="displayName">' + result.displayName + '</div></div><i class="im im-menu-dot-v"></i></div><img src="' + item.data().eventPicUrl + '" alt="" class="post-pic"><div class="desc"><div style="padding: 1em 0em; font-weight: 700;">' + r.size + ' likes</div><div class="">' + item.data().caption + '</div><div class="reaction"><i id="' + item.data().photoInterestId + '" class="im im-star"></i><i class="im im-data"></i><i class="im im-menu-dot-h"></i></div>'
                                    document.getElementById(item.data().photoInterestId).addEventListener('click', e=>{
                                        db.collection('event').doc(item.id).collection('liked').where('name', '==', getUser()).get().then(dt=>{
                                            dt.docChanges().forEach(kt=>{
                                                console.log(kt.size)
                                                db.collection('event').doc(item.id).collection('liked').doc(kt.doc.id).delete().then(()=>{
                                                    document.getElementById(item.data().photoInterestId).classList.remove('im-star')
                                                    document.getElementById(item.data().photoInterestId).classList.add('im-star-o')
                                                }
                                                ).catch(e=>{
                                                    console.log('Error Occured', e)
                                                }
                                                )
                                            }
                                            )
                                        }
                                        ).catch(e=>{
                                            console.log('Error Occured', e)
                                        }
                                        )
                                    }
                                    )
                                }
                            }
                            ).catch(e=>{
                                console.log('Error Occured', e)
                            }
                            )

                        }
                    }
                    )
                } else {
                    el.innerHTML = '<div class="profile"><div class="profile-section"><img src="' + result.profilePic + '" alt="" class="profile-pic"><div class="displayName">' + result.displayName + '</div></div><i class="im im-menu-dot-v"></i></div><img src="' + item.data().eventPicUrl + '" alt="" class="post-pic"><div class="desc">' + item.data().eventDesc + '</div><div class="reaction"><i class="im im-rocket"></i><i id="' + item.data().eventRegisterId + '" class="im im-barcode"></i><i class="im im-menu-dot-h"></i></div>'
                }
                await document.querySelector('.app').append(el)
                console.log('All Posted')
                let ok = true
                return ok
            } catch (e) {
                console.log('Error Occured - ', e)
            }
        }

        let getEvent = ()=>{
            db.collection('event').orderBy('time', 'desc').onSnapshot(data=>{
                let snap = data.docChanges()
                snap.forEach(d=>{
                    if (d.doc.metadata.hasPendingWrites) {} else {
                        let postedBy = d.doc.data().postedBy
                        db.collection('accounts').where('uid', '==', postedBy).get().then(r=>{
                            let getedData = r.docChanges()
                            getedData.forEach(finalData=>{
                                addEvent(d.doc, finalData.doc.data()).then(j=>{
                                    if (d.doc.data().category === 'event') {
                                        addClickEvent(d.doc)
                                    } else {}
                                }
                                ).catch(e=>{
                                    console.log('Error Occured', e)
                                }
                                )
                            }
                            )
                        }
                        )
                    }
                }
                )
            }
            )
        }

        document.querySelector("#chatForm").addEventListener('submit', e=>{
            e.preventDefault()
            console.log('The Message is: ', msg.value)
            let dateData = Date.now()
            db.collection('messages').add({
                id: dateData,
                from: getUser(),
                sendTo: obj.name,
                text: msg.value,
                date: dateData,
                conversation: [getUser(), obj.name],
                time: firebase.firestore.FieldValue.serverTimestamp()
            }).then(r=>{
                document.querySelector("#chatForm").reset()
            }
            ).catch(e=>{
                console.log('Error Occured: ', e)
            }
            )
        }
        )

        let displayUserList = value=>{
            let btn = document.createElement('div')
            btn.innerText = value.data().displayName || value.data().email.substr(0, 6)
            let str = value.data().uid
            let finalStr = str.substr(0, 6)
            btn.id = finalStr
            btn.classList.add('u-l')
            addButton.appendChild(btn)
            firebase.firestore().collection('users').doc(value.data().uid).onSnapshot(rt => {
                    if(rt.data()) {
                            // 
                            console.log('got online User -', rt)
                            document.getElementById(finalStr).style.borderRight = '2px solid #551a8b'
                    } else {
                            //
                            console.log('Out Of Reached', rt.data())
                            document.getElementById(finalStr).style.borderRight = 'none'
                    }
            })
        }

        let displayMessage = val=>{
            let el = document.createElement('div')
            el.style.display = 'flex'
            el.style.justifyContent = 'center'
            el.innerHTML = `<div style="width: 60px; height: 60px; margin-top: 3em;" class="loader"></div>`
            messageContent.appendChild(el)
            db.collection('messages').orderBy('time').where('conversation', 'in', [[obj.name, getUser()], [getUser(), obj.name]]).onSnapshot(snapshot=>{
                let d = snapshot.docChanges()
                if (snapshot.empty) {
                    messageContent.innerHTML = '<h3 style="text-align: center; color: #ff8e8e;">No Messages</h3>'
                    el.style.display = 'none'
                } else {
                    d.forEach(snap=>{
                        if (!snap.doc.metadata.hasPendingWrites) {
                            let li = document.createElement('div')
                            if (snap.doc.data().sendTo === obj.name) {
                                li.classList.add('sender')
                                li.innerHTML = `<div class="msg">${snap.doc.data().text}</div>`
                            } else {
                                li.classList.add('receiver')
                                li.innerHTML = `<div class="msg" style="background: #283996;">${snap.doc.data().text}</div><div class="stopper"></div>`
                            }
                            messageContent.appendChild(li)
                            messageContent.scrollTop = messageContent.scrollHeight
                            el.style.display = 'none'
                        } else {
                            console.log('Prank')
                        }
                    }
                    )
                }
            }
            )
        }

        let getAllUser = ()=>{
            db.collection('accounts').onSnapshot(snap=>{
                let snapshot = snap.docChanges()
                snapshot.forEach(data=>{
                    let d = data.doc
                    if (!d.metadata.hasPendingWrites) {
                        if (d.data().uid === getUser()) {
                            user.displayName = d.data().displayName
                            user.profilePic = d.data().profilePic
                            document.querySelector('#profilePic').src = d.data().profilePic || getUserProfilePic()
                            document.querySelector('#userDisplayName').innerText = d.data().displayName || getUserDisplayName()
                        } else {
                            document.getElementById('usersLoader').style.display = 'none'
                            displayUserList(d)
                            let str = d.data().uid
                            let finalStr = str.substr(0, 6)
                            document.getElementById(finalStr).addEventListener('click', e=>{
                                messageContent.innerHTML = ''
                                let v = document.getElementById(finalStr).innerText
                                toggleUser.innerText = v
                                obj.name = d.data().uid
                                displayMessage(d.data().uid)
                            }
                            )
                        }
                    } else {
                        console.log('Something Went Wrong')
                    }
                }
                )
            }
            )
        }

        logout.addEventListener('click', e=>{
            firebase.firestore().collection('users').doc(user.uid).delete().then(()=>{
                auth.signOut()
            }
            ).catch(e=>{
                console.log('Error Occured', e)
            }
            )
        }
        )

        document.querySelector("#file").addEventListener("change", e=>{
            console.log("The image Event: ", e);

            let file = e.target.files[0];
            console.log(file)

            // create Image
            createImageBitmap(file).then(bitmap=>{
                canvas.width = bitmap.width;
                canvas.height = bitmap.height;
                canvasCtx.drawImage(bitmap, 0, 0);
            }
            ).catch(e=>{
                console.log("Error Occured while inserting Image in Canvas ", e);
            }
            );
        }
        );

        document.querySelector("#photo").addEventListener("change", e=>{
            console.log("The image Event: ", e);

            let file = e.target.files[0];

            // create Image
            createImageBitmap(file).then(bitmap=>{
                canvas.width = bitmap.width;
                canvas.height = bitmap.height;
                canvasCtx.drawImage(bitmap, 0, 0);
            }
            ).catch(e=>{
                console.log("Error Occured while inserting Image in Canvas ", e);
            }
            );
        }
        );

        document.querySelector("#fileForm").addEventListener("submit", e=>{
            document.getElementById('postEventBtn').innerText = 'Wait a Sec...'
            document.getElementById('postEventBtn').disabled = true
            e.preventDefault();

            let file = e.target[0].files[0];
            console.log(file);

            firebase.storage().ref("events/" + file.name).put(file).then(r=>{
                r.ref.getDownloadURL().then(url=>{
                    db.collection("event").add({
                        eventPicUrl: url,
                        eventName: eventName.value,
                        eventDesc: eventDesc.value,
                        eventPlace: eventPlace.value,
                        coordinatedBy: coordinated.value,
                        postedBy: getUser(),
                        startAt: startAt.value,
                        eventRegisterId: getId(8),
                        eventInterestId: getId(6),
                        endAt: endAt.value,
                        category: 'event',
                        time: firebase.firestore.FieldValue.serverTimestamp()
                    }).then(r=>{
                        console.log("Inserted!");
                        fileFeedback.innerText = "✔ Image Uploaded";
                        fileFeedback.style.color = "green";
                        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
                        document.querySelector("#fileForm").reset();
                        document.getElementById('postEventBtn').innerText = 'Upload'
                        document.getElementById('postEventBtn').disabled = false
                        document.querySelector('.upload-post').style.height = '0px'
                    }
                    ).catch(e=>{
                        console.log("Error Occured", e);
                        feedback.innerText = "😢 Sorry Something Went Wrong";
                        feedback.style.color = "red";
                    }
                    );
                }
                );
            }
            ).catch(e=>{
                console.log("Error Occured while posting Image - ", e);
            }
            );
        }
        );

        document.querySelector("#postForm").addEventListener("submit", e=>{
            e.preventDefault();

            let file = e.target[0].files[0];
            console.log('post ', file);

            firebase.storage().ref("events/" + file.name).put(file).then(r=>{
                r.ref.getDownloadURL().then(url=>{
                    db.collection("event").add({
                        eventPicUrl: url,
                        title: postName,
                        caption: postCaption,
                        postedBy: getUser(),
                        photoCommentId: getId(8),
                        photoInterestId: getId(6),
                        category: 'photo',
                        time: firebase.firestore.FieldValue.serverTimestamp()
                    }).then(r=>{
                        console.log("Inserted!");
                        postFeedback.innerText = "✔ Image Uploaded";
                        postFeedback.style.color = "green";
                        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
                        document.querySelector("#fileForm").reset();
                    }
                    ).catch(e=>{
                        console.log("Error Occured", e);
                        feedback.innerText = "😢 Sorry Something Went Wrong";
                        feedback.style.color = "red";
                    }
                    );
                }
                );
            }
            ).catch(e=>{
                console.log("Error Occured while posting Image - ", e);
            }
            );
        }
        );

        firebase.messaging().onMessage(payload=>{
            console.log('On Message - ', payload)
        }
        )

        let saveDeviceToken = ()=>{
            firebase.messaging().getToken().then(token=>{
                db.collection('FCMToken').doc(getUser()).set({
                    uid: user.uid,
                    token: token
                }).then(r=>{
                    console.log('Token get to the collection - ', r)
                }
                ).catch(e=>{
                    console.log('Error Occured - ', e)
                }
                )
            }
            ).catch(e=>{
                console.log('Error Occured', e)
            }
            )
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
}
)
