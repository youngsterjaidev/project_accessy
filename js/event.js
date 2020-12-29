(()=>{
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
)()
