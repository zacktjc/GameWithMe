const socket = io();
const $sendBtn = document.querySelector(".send");
const $messageContainer = document.querySelector(".messageContainer");
const $inputMessage = document.querySelector(".inputMessage");
const $inputUsername = document.querySelector('.username')
const $createUser = document.querySelector('.createUsername')
const $usersList = document.querySelector('.usersList')


// //listen for a message
socket.on("chat message", (objFromChatMessageOnServerJS) => {
  display(objFromChatMessageOnServerJS);
});

socket.on("users", (users) => {
    console.log(users);
  
    let html ="";
  
    users.forEach((user) => {
      html += `<li>${user}</li>`
    })
    $usersList.innerHTML = html;
  
  });


//forsetting username
$createUser.addEventListener("click", () => {
    let inputValue = $inputUsername.value;
  
    socket.emit('set user', inputValue, function(bool){
     if(bool){
       document.querySelector('.usernameInput').style.display = "none";
     } else {
       alert('no way!');
     }
    });
  
    $inputUsername.value ="";
  
  })
  



//for chat messages

$sendBtn.addEventListener("click", () => {
  let inputValue = $inputMessage.value;

  socket.emit("send message", inputValue);

  $inputMessage.value ="";
  
});
function display(data) {

  let html = `<div class="message"> <strong>${data.user}</strong> : ${data.message} </div>`;
  $messageContainer.innerHTML = $messageContainer.innerHTML + html;



}
console.log("helloworld");