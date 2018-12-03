
if (document.querySelector('[type=file]')) {

    //let go = document.querySelector('[value=go]')

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