
if (document.querySelector('[type=file]')) {

    let go = document.querySelector('[value=go]')

    let result = document.getElementById("result")
    document.addEventListener("DOMContentLoaded", ()=>{
        document.getElementById('ajax-upload').addEventListener("submit", (e)=>{
            e.preventDefault()
            let form = e.target
            let data = new FormData(form)
            let request = new XMLHttpRequest()
            request.onreadystatechange = function(){
                if (request.readyState != 4) {
                    result.classList.remove("d-none")
                    go.click()
                }
                else{
                    result.classList.add("d-none")
                }
            }
            request.open(form.method, form.action)
            request.send(data)
        })
    })
}

if (document.querySelector('li.position')) {
    function getPositions() {
        let positions = []
        let lis = document.querySelectorAll('li.position')
        lis.forEach(li => {
            let position = li.querySelector('span').innerText
            positions.push(position)
        })
        return positions
    }
    function updateHiddenInput(thePositions) {
        document.querySelector('[name=positions]').value = JSON.stringify(thePositions)
    }

    const lis = document.querySelectorAll('li.position')

    updateHiddenInput( getPositions() )
    
    lis.forEach(li => {
        let i = li.getElementsByTagName('i')
        let arrowDown = i[0]
        let arrowUp = i[1]
        arrowDown.addEventListener('click', () => {
            let next = li.nextSibling
            next.parentNode.insertBefore(next, next.previousSibling)
        })
        arrowUp.addEventListener('click', () => {
            li.parentNode.insertBefore(li, li.previousSibling)
        })
    })

    document.getElementById('ajax-update').addEventListener("submit", (e)=>{
        e.preventDefault()
        var newName = 'John Smith',
        xhr = new XMLHttpRequest()

        xhr.open('POST', 'form/update-positions')
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xhr.onload = function() {
            if (xhr.status === 200 && xhr.responseText !== newName) {
                alert('Something went wrong.  Name is now ' + xhr.responseText)
            }
            else if (xhr.status !== 200) {
                alert('Request failed.  Returned status of ' + xhr.status)
            }
        }
        xhr.send(encodeURI('positions=' + JSON.stringify( getPositions() ) ))
    })
}

if (document.getElementsByClassName('home-page').length && document.querySelector('[href="/logout"]')) {
    const rmLinks = document.querySelectorAll('[href^="form/del/"]')
    if ( !(rmLinks.length > 1) ) {
        const rmLink = rmLinks[0]
        const slash = rmLink.parentNode.querySelector('span')
        rmLink.classList.add("d-none")
        slash.classList.add("d-none")
    }
}
if (document.querySelectorAll('.posts nav ul li').length == 1) {
    document.querySelector('.posts nav ul').remove()
}