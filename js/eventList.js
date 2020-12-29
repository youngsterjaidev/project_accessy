(()=>{
    console.log('Notification on fire')

    let app = document.querySelector('.app')
    let card = document.querySelector('.card')
    let eventDetail = document.querySelector('.event-details')
    let eventContent = document.querySelector('.event-content')

    document.querySelector('#cardCloseBtn').addEventListener('click', e=>{
        eventDetail.style.width = '0%'
    }
    )

    firebase.firestore().collection('event').where('category', '==', 'event').orderBy('time', 'desc').onSnapshot(data=>{
        let snapshot = data.docChanges()
        snapshot.forEach(snap=>{
            if (snap.type === 'added') {
                let d = snap.doc.data()
                let el = document.createElement('div')
                el.classList.add('card')
                el.id = d.eventRegisterId
                el.innerHTML = `<div class="card-head"><img class="card-image" src="${d.eventPicUrl}"></div><div class="card-body"><div class="card-content">${d.eventName}</div><div>${d.startAt} | ${d.endAt}</div><!--<div>A Firebase Conference Event Occur....</div>--></div><div class="card-tail"><a href="" class="im im-angle-right"></a></div>`
                app.append(el)

                document.getElementById(d.eventRegisterId).addEventListener('click', e=>{
                    eventDetail.style.width = '100%'
                    console.log(d)
                    firebase.firestore().collection('event').doc(snap.doc.id).get().then(r=>{
                        console.log('Click - ', r.data())
                        firebase.firestore().collection('event').doc(snap.doc.id).collection('registered').get().then(rt=>{
                            let ol = document.createElement('ol')
                            ol.classList.add('participant')
                            rt.docChanges().forEach(et => {
                                let li = document.createElement('li')
                                li.innerHTML = `${et.doc.data().userName}`
                                ol.append(li)
                            })
                            console.log(ol)
                            eventContent.innerHTML = `
            <div class="event">
                <div class="event-head">
                    <img class="event-image" src="${r.data().eventPicUrl}">
                </div>
                <div class="event-body">
                    <div class="event-content">
                        <div class="participant-section-btn">
                            <button type="button" class="active" id="overviewBtn">Overview</button>
                            <button type="button" id="allParticipantBtn">All Participant</button>
                            <button type="button" id="settingsBtn">Settings</button>
                        </div>
                        <div class="overview">
                        ${r.data().eventName}
                        </div>
                        <div class="all-participant">
                            <div class="participant-heading">
                                <div>All Participant</div>
                                <div class="p-num">${rt.size}</div>
                            </div>
                            <div id="${r.data().eventInterestId}">
                            </div>
                        </div>
                        <div class="settings">Settings</div>
                    </div>
                </div>
            </div>`

                            let overview = document.querySelector('.overview')
                            let allParticipant = document.querySelector('.all-participant')
                            let settings = document.querySelector('.settings')
                            let overviewBtn = document.querySelector('#overviewBtn')
                            let allParticipantBtn = document.querySelector('#allParticipantBtn')
                            let settingsBtn = document.querySelector('#settingsBtn')

                            overviewBtn.addEventListener('click', e=>{
                                overview.style.display = 'flex'
                                allParticipant.style.display = 'none'
                                settings.style.display = 'none'
                                overviewBtn.classList.add('active')
                                allParticipantBtn.classList.remove('active')
                                settingsBtn.classList.remove('active')
                            }
                            )

                            allParticipantBtn.addEventListener('click', e=>{
                                document.getElementById(r.data().eventInterestId).append(ol)
                                overview.style.display = 'none'
                                allParticipant.style.display = 'block'
                                settings.style.display = 'none'
                                overviewBtn.classList.remove('active')
                                allParticipantBtn.classList.add('active')
                                settingsBtn.classList.remove('active')
                            }
                            )

                            settingsBtn.addEventListener('click', e=>{
                                overview.style.display = 'none'
                                allParticipant.style.display = 'none'
                                settings.style.display = 'flex'
                                overviewBtn.classList.remove('active')
                                allParticipantBtn.classList.remove('active')
                                settingsBtn.classList.add('active')
                            }
                            )
                        }
                        )
                    }
                    )

                }
                )

            } else {
                return
            }
        }
        )
    }
    )

}
)()
