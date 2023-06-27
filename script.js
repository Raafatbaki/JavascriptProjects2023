const baseurl = "https://tarmeezacademy.com/api/v1"
setupUI()
getPost()

// ====INFINITE SCROLL==== //
let currentPage = 1
let lastPage = 1 

window.addEventListener("scroll", function(){

  const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
  if(endOfPage && currentPage < lastPage)
  {
    currentPage = currentPage + 1
    getPost(false, currentPage)
  }
});
// ====// INFINITE SCROLL //==== //


function getPost(relode = true, page = 1)
{
  axios.get(`${baseurl}/posts?limit=4&page=${page}`)
  .then(function (response) {
    // handle success
    const posts = response.data.data
    lastPage = response.data.meta.last_page
    if(relode)
    {
      document.getElementById("posts").innerHTML = ""
    }

    for(post of posts){
      //console.log(post.tags);
      const author = post.author
      let postTitel = ""
      if(post.titel != null){
        postTitel = post.titel
      }

      // SHOW OR HIDE EDIT BTNTON
      let user = getCurrentUser()
      let isMyPost = user != null && post.author.id == user.id
      let editBtnContent = ``
      if(isMyPost)
      {
        editBtnContent = 
        `
          <button class='btn btn-danger' style='margin-left: 5px; float: right' onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">delete</button>
          ​<button class='btn btn-secondary' style='float: right' onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">edit</button>
        `
      }

      let content = `
      <div class="card shadow">
        <div class="card-header">
          <img class="rounded-circle border border-2" src="${author.profile_image}" alt="" style="width: 40px; height: 40px;">
          <b>${author.username}</b>
          ${editBtnContent}
        </div>
        <div class="card-body" onclick="postClicked(${post.id})" style="cursor : pointer">
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
              <span id="post-tags-${post.id}">

              </span>
            </span>
          </div>
        </div>
      </div>`

      document.getElementById("posts").innerHTML += content

      const currentPostTagsId = `post-tags-${post.id}`
      document.getElementById(currentPostTagsId).innerHTML = ""

      for(tag of post.tags)
      {
        //console.log(tag.name)
        let tagsContent = 
        ` <button class="btn btn-sm rounded" style="background-color: gray; color: white;">
            ${tag.name}
          </button>
        `
        document.getElementById(currentPostTagsId).innerHTML += tagsContent
      }
      //console.log(post.tags)
      
    }
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
}

function loginBtnClicked()
{
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
    showAlert("Logged in successfully", "success")
    setupUI()
  })
}
  
function registerBtnClicked()
{
  const name = document.getElementById("register-name-input").value
  const username = document.getElementById("register-username-input").value
  const password = document.getElementById("register-password-input").value
  const image = document.getElementById("register-image-input").files[0]

  //console.log(name, username, password)
  let formData = new FormData
  formData.append("name", name)
  formData.append("username", username)
  formData.append("password", password)
  formData.append("image", image)

  const url = `${baseurl}/register`

  axios.post(url, formData)
  .then((response) => {
    console.log(response.data)
    localStorage.setItem("token", response.data.token)
    localStorage.setItem("user", JSON.stringify(response.data.user))
    
    const modal = document.getElementById("register-modal")
    const modalInstance = bootstrap.Modal.getInstance(modal)
    modalInstance.hide()

    showAlert("New User Registered successfully", "success")
    setupUI()
  }).catch((error) => {
    const message = error.response.data.message
    showAlert(message, "danger")
  })
}

function logout()
{
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  showAlert("Logged out successfully", "success")
  setupUI()
}

function showAlert(customMessage, type)
{
  const alertPlaceholder = document.getElementById('success-alert')
  const appendAlert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
}
  appendAlert(customMessage, type)

  // TODO 
  // setTimeout(() => {
  //   const alertToHide = bootstrap.Alert.getOrCreateInstance('#success-alert')
  //   alertToHide.close()
  // }, 2000);
}  

function setupUI() 
{
  const token = localStorage.getItem("token")

  const loginDiv = document.getElementById("login-div")
  const logoutDiv = document.getElementById("logout-div")
  // add btn
  const addBtn = document.getElementById("add-btn")
  
  if(token == null) {
    addBtn.style.setProperty("display", "none", "important")
    loginDiv.style.setProperty("display", "flex", "important")
    logoutDiv.style.setProperty("display", "none", "important")
  }else {
    addBtn.style.setProperty("display", "block", "important")
    loginDiv.style.setProperty("display", "none", "important")
    logoutDiv.style.setProperty("display", "flex", "important")
    const user = getCurrentUser()
    document.getElementById("nav-username").innerHTML = user.username
    document.getElementById("nav-profile-pic").src = user.profile_image
  }
}

function createNewPostClicked()
{
  let postId = document.getElementById("post-id-input").value
  let isCreate = postId == null || postId == ""

  const titel = document.getElementById("post-titel-input").value
  const body = document.getElementById("post-body-input").value
  const image = document.getElementById("post-image-input").files[0]
  const token = localStorage.getItem("token")

  let formData = new FormData
  formData.append("body", body)
  formData.append("titel", titel)
  formData.append("image", image)
  
  let url = ``
  const headers = {
    "authorization" : `Bearer ${token}`
  }
  if(isCreate)
  {
    url = `${baseurl}/posts`

  }else
  {
    formData.append("_method", "put")
    url = `${baseurl}/posts/${postId}`
  }
  axios.post(url, formData, {
    headers : headers
  })
  .then((response) => {
    const modal = document.getElementById("create-post-modal")
    const modalInstance = bootstrap.Modal.getInstance(modal)
    modalInstance.hide()
    showAlert("New Post Has Been Created", "success")
    getPost()
  })
  .catch((error) => {
    const message = error.response.data.message
    showAlert(message, "danger")
  })
}

function getCurrentUser()
{
  let user = null
  const storageUser = localStorage.getItem("user")

  if(storageUser != null)
  {
    user = JSON.parse(storageUser)
  }
  return user
}

function postClicked(postId)
{
  window.location =`postDetails.html?postId=${postId}`
}
const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get("postId")

getDetailsPost()
function getDetailsPost()
{
  axios.get(`${baseurl}/posts/${id}`)
  .then((response) => {
    //console.log(response.data)
    const post = response.data.data
    const comments = post.comments
    const author = post.author

    let postTitel = ""
    if(post.titel != null){
      postTitel = post.titel
    }
    let commentsContent = ""
    for(comment of comments)
    {
      commentsContent +=
        `
        <!-- COMMENT -->
        <div class="p-3" style="background-color: rgb(235, 235, 235);">
          <!-- PROFILE PIC + USERNAME -->
          <div>
            <img src="${comment.author.profile_image}" class="rounded-circle" alt="" style="width: 40px; height: 40px;">
            <b>${comment.author.username}</b>
          </div>
          <!-- // PROFILE PIC + USERNAME // -->
          <!-- COMMENT'S BODY -->
          <div>
            ${comment.body}
          </div>
          <!-- // COMMENT'S BODY // -->
        </div>
        <!-- // COMMENT // -->
        `
    }

    const postContent =
    `
    <div class="container" style="height: 1000px;">
      <div class="d-flex justify-content-center mt-5">
        <div class="col-9">
          <!-- USER'S POST -->
          <h1>
            <span id="username-span">
              ${author.username}
            </span>
            post
          </h1>
          <!-- // USER'S POST // -->
          <!-- POST ROW -->
          <div class="card shadow">
            <div class="card-header">
              <img class="rounded-circle border border-2" src="${author.profile_image}" alt="" style="width: 40px; height: 40px;">
              <b>@${author.username}</b>
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
                  (${post.comments_count}) Comments
                  <span>
                    <button class="btn btn-sm rounded" style="background-color: gray; color: white;"></button>
                  </span>
                </span>
              </div>
            </div>
            <div id="comments">
              ${commentsContent}
            </div>
            <!-- ADD COMMENT -->
            <div class="input-group mb-3" id="add-comment-div">
              <input type="text" id="comment-input" placeholder="add your comment here.." class="form-control">
              <button class="btn btn-outline-primary" type="button" onclick="createCommentClicked()">send</button>
            </div>
            <!-- // ADD COMMENT // -->
          </div>
          <!-- // POST ROW // -->
          <!-- // USER'S POST // -->
        </div>
      </div>
    </div>
    `
    document.getElementById("post-details").innerHTML = postContent


  })
  .catch(function (error) {
  // handle error
  console.log(error);
})
}

function createCommentClicked() 
{
  let commentBody = document.getElementById("comment-input").value
  let params = {
    "body": commentBody
  }
  let token = localStorage.getItem("token")
  let url = `${baseurl}/posts/${id}/comments`

  axios.post(url, params, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then((response) => {
    showAlert("The Comment has been created successfully", "success")
    getDetailsPost()
  })
  .catch((error) => {
    const errorMessage = error.response.data.message
    showAlert(errorMessage, "danger")
  })
}

function editPostBtnClicked(postObjekt)
{

  let post = JSON.parse(decodeURIComponent(postObjekt))
  console.log(post)
  document.getElementById("post-id-input").value = post.id
  let postTitel = ""
  if(post.titel != null){
    postTitel = post.titel
  }
  document.getElementById("post-modal-submit-btn").innerHTML = "Update"
  document.getElementById("post-titel-input").value = postTitel
  document.getElementById("post-body-input").value = post.body
  document.getElementById("post-modal-titel").innerHTML = "Edit Post"
  let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
  postModal.toggle()
}

function addBtnClicked()
{
  document.getElementById("post-id-input").value = ""
  let postTitel = ""
  if(post.titel != null){
    postTitel = post.titel
  }
  document.getElementById("post-modal-submit-btn").innerHTML = "Create"
  document.getElementById("post-titel-input").value = ""
  document.getElementById("post-body-input").value = ""
  document.getElementById("post-modal-titel").innerHTML = "Create A New Post"
  let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
  postModal.toggle()
}

function deletePostBtnClicked(postObjekt)
{
  let post = JSON.parse(decodeURIComponent(postObjekt))
  console.log(post)
  document.getElementById("delete-post-id-input").value = post.id
  let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"), {})
  postModal.toggle()
}

function confirmPostDelete()
{
  const postId = document.getElementById("delete-post-id-input").value
  const url = `${baseurl}/posts/${postId}`
  let token = localStorage.getItem("token")

  axios.delete(url, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then((response) => {
    const modal = document.getElementById("delete-post-modal")
    const modalInstance = bootstrap.Modal.getInstance(modal)
    modalInstance.hide()
    showAlert("The Post Has Been Deleted Successfully", "success")
    getPost()
  })
  .catch((error) => {
    const errorMessage = error.response.data.message
    showAlert(errorMessage, "danger")
  })
}