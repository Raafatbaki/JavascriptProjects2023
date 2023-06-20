setupUI()
const baseurl = "https://tarmeezacademy.com/api/v1"


axios.get(`${baseurl}/posts`)
  .then(function (response) {
    // handle success
    const posts = response.data.data
    document.getElementById("posts").innerHTML = ""

    for(post of posts){
      //console.log(post.tags);
      
      const author = post.author
      const postTitel = ""
      if(post.titel != null){
        postTitel = post.titel
      }
      

      let content = `
      <div class="card shadow">
        <div class="card-header">
          <img class="rounded-circle border border-2" src="${author.profile_image}" alt="" style="width: 40px; height: 40px;">
          <b>${author.username}</b>
        </div>
        <div class="card-body">
          <img class="w-100" src="${post.image}" alt="">
          <h6 style="color: rgb(193, 193, 193);" class="mt-1">
            ${post.created_at}
          </h6>
          <h5>
            ${postTitel}
          </h5>
          <p>${post.body}</p>
          <hr>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
              <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
            </svg>
            <span>
              (${post.comments_count}) Comment
            </span>
          </div>
        </div>
      </div>`

    document.getElementById("posts").innerHTML += content
    }
    
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  
  function loginBtnClicked(){
    const username = document.getElementById("username-input").value
    const password = document.getElementById("password-input").value
    const url = `${baseurl}/login`
    const params = {
      "username" : username,
      "password" : password
    }
    axios.post(url, params)
    .then((response) => {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      
      const modal = document.getElementById("login-modal")
      const modalInstance = bootstrap.Modal.getInstance(modal)
      modalInstance.hide()
    })
  }
  
  function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    alert("done")
  }
// function sucsses () {
//   const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
// const appendAlert = (message, type) => {
//   const wrapper = document.createElement('div')
//   wrapper.innerHTML = [
//     `<div class="alert alert-${type} alert-dismissible" role="alert">`,
//     `   <div>${message}</div>`,
//     '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
//     '</div>'
//   ].join('')

//   alertPlaceholder.append(wrapper)
// }

// const alertTrigger = document.getElementById('liveAlertBtn')
// if (alertTrigger) {
//   alertTrigger.addEventListener('click', () => {
//     appendAlert('Nice, you triggered this alert message!', 'success')
//   })
// }
// }  
// //sucsses()

function setupUI() {
  const token = localStorage.getItem("token")

  const loginBtn = document.getElementById("login-btn")
  const registerBtn = document.getElementById("register-btn")

  if(token == null) {

  }else {
    loginBtn.style.visibility = "hidden"
    registerBtn.style.visibility = "hidden"
  }
}

