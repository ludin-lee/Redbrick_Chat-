const loginForm = document.querySelector("#login-form");
const nicknameInput = document.querySelector("#nickname-form");
const loginBtn = document.querySelector("#login-btn-form");
const loginSubmitForm = document.querySelector("#login-submit-form");
const chatForm = document.querySelector("#chat-form");
const logoutBtn = document.querySelector("#logout-btn");
const savedNickname = localStorage.getItem("nickname");
const chatInput = document.querySelector("#chat-input");
const chatlist = document.querySelector("#chat-list");
const socket = io();
// const socket = io.connect("127.0.0.1:3000/mylee");

function sectionTwo(nickName) {
  loginForm.style.display = "none";
  chatForm.style.display = "flex";
  localStorage.setItem("nickname", nickName);
  socket.emit("enter_room", nickName, () => {
    addMessage("채팅방에 입장하셨습니다.");
  });
}

function sectionOne() {
  chatForm.style.display = "none";
  loginForm.style.display = "flex";
}

function login(event) {
  event.preventDefault();
  if (nicknameInput.value === "") {
    alert("닉넴을 정해주세용");
  } else {
    let nickName = nicknameInput.value;
    sectionTwo(nickName);
  }
}

function logout(event) {
  const nickName = localStorage.getItem("nickname");
  localStorage.removeItem("nickname");
  socket.emit("bye", nickName);
  sectionOne();
  window.location.reload();
}

function chatting(event) {
  event.preventDefault();
  const nickName = localStorage.getItem("nickname");
  const text = document.querySelector("#text-form");
  const chatMessage = `${nickName}: ${text.value}`;
  const chatText = text.value;

  socket.emit("new_message", chatMessage, () => {
    addMessage(`나: ${chatText}`);
  });
  text.value = "";
}

function addMessage(text) {
  const li = document.createElement("li");
  li.innerText = text;
  chatlist.appendChild(li);
  chatlist.scrollTop = chatlist.scrollHeight;
}

if (!savedNickname) {
  loginForm.addEventListener("submit", login);
} else {
  sectionTwo(savedNickname);
}

logoutBtn.addEventListener("click", logout);
chatInput.addEventListener("submit", chatting);

/*---------------------*/
socket.on("welcome", (data) => {
  addMessage(`${data}님이 입장하셨습니다.`);
});

socket.on("bye", (data) => {
  addMessage(`${data}님이 퇴장하셨습니다.`);
});
socket.on("new_message", (data) => {
  addMessage(data);
});
