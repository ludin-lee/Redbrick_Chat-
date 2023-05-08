const loginForm = document.querySelector("#login-form");
const nicknameInput = document.querySelector("#nickname-form");
const loginBtn = document.querySelector("#login-btn-form");
const loginSubmitForm = document.querySelector("#login-submit-form");
const chatForm = document.querySelector("#chat-form");
const logoutBtn = document.querySelector("#logout-btn");
const savedNickname = localStorage.getItem("nickname");
const chatInput = document.querySelector("#chat-input");
const chatlist = document.querySelector("#chat-list");
const onlineList = document.querySelector("#online-list");
//const socket = io();
const socket = io("127.0.0.1:3000");

/* section */
function sectionOne() {
  chatForm.style.display = "none";
  loginForm.style.display = "flex";
}
function sectionTwo(nickName) {
  loginForm.style.display = "none";
  chatForm.style.display = "flex";
  localStorage.setItem("nickname", nickName);
  socket.emit("enter_room", nickName, () => {
    addMessage("채팅방에 입장하셨습니다.");
    addMessage("명령어보기: /? ");
    addMessage("----------------------------------------");
  });
}
/* 명령어 */
function displayMode(target) {
  const body = document.querySelector("body");
  const chatList = document.querySelector("#chat-list");
  if (target === "다크") {
    body.style.background = "grey";
    chatList.style.color = "white";
  } else if (target === "화이트") {
    body.style.background = "white";
    chatList.style.color = "black";
  }
}
function changeNickname(target) {
  if (target.length > 10) {
    addMessage("닉네임은 10글자 이하로 설정가능합니다.");
  } else {
    const originalNickname = localStorage.getItem("nickname");
    const notice = `${originalNickname}님이 ${target}으로 닉네임을 변경하셨습니다.`;
    socket.emit("change_Nickname", { nickname: target, notice }, () => {
      localStorage.removeItem("nickname");
      localStorage.setItem("nickname", target);
      addMessage(notice);
    });
  }
}

/* 채팅 관련 */
function command(commandLine, target) {
  if (commandLine === "/닉네임변경") changeNickname(target);
  else if (commandLine === "/모드") displayMode(target);
  else if (commandLine === "/?") {
    const notice1 = "닉네임 변경: /닉네임변경 바꿀닉네임";
    const notice2 = "화면모드 변경: /모드 다크or화이트";
    addMessage("-------------------------");
    addMessage(notice1);
    addMessage(notice2);
    addMessage("-------------------------");
  }
}
function addMessage(text) {
  const li = document.createElement("li");
  li.innerText = text;
  chatlist.appendChild(li);
  chatlist.scrollTop = chatlist.scrollHeight;
}
function chatting(event) {
  event.preventDefault();
  const nickName = localStorage.getItem("nickname");
  if (nickName.length > 10) {
    addMessage("닉네임은 10글자 이하로 설정가능합니다.");
  } else {
    const text = document.querySelector("#text-form");
    const chatMessage = `${nickName}: ${text.value}`;
    const chatText = text.value;

    if (chatText[0] === "/") {
      const [commandLine, target] = chatText.split(" ");
      command(commandLine, target);
    } else {
      socket.emit("new_message", chatMessage, () => {
        addMessage(`나: ${chatText}`);
      });
      socket.emit("startGame");
    }

    text.value = "";
  }
}

/* 로그 인앤아웃 */
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
  event.preventDefault();
  const nickName = localStorage.getItem("nickname");
  localStorage.removeItem("nickname");

  sectionOne();
  window.location.reload();
}

/* 기본실행 */
if (!savedNickname) {
  loginForm.addEventListener("submit", login);
} else {
  sectionTwo(savedNickname);
}

logoutBtn.addEventListener("click", logout);
chatInput.addEventListener("submit", chatting);

/* socket */
socket.on("welcome", (data) => {
  addMessage(`${data}님이 입장하셨습니다.`);
});
socket.on("bye", (data) => {
  addMessage(`${data}님이 퇴장하셨습니다.`);
});
socket.on("new_message", (data) => {
  addMessage(data);
});

socket.on("online_update", (data) => {});
