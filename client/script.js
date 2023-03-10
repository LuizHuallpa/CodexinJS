import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.getElementById('chat_container');

let loadInterval;


function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';
    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300);
}


function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20)
}


function generateUniqueId() {
  const timestamp = new Date().getTime();
  const randomNumber = Math.random();
  const hexaDecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexaDecimalString}`;
}


function chatStripe(isAI, value, uniqueId) {
  return (
    `
    <div class="wrapper ${isAI && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img src="${isAI ? bot : user}" alt="${isAI ? 'bot' : 'user'}"/>
        </div>
        <div class="message" id=${uniqueId}>${value}</div>
      </div>
    
    
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  //user's chat stripe

  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  //bot's chat stripe

  const uniqueId = generateUniqueId();

  form.reset();

  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);
  //fecthing data from server 

  const response = await fetch('https://codexluiz.onrender.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  clearInterval(loadInterval);
  messageDiv.textContent = '';
  if (response.ok) {
    const data = await response.json();
    const parseData = data.bot.trim();



    typeText(messageDiv, parseData);
  } else {
    const err = await response.text();

    messageDiv.innerHTML = `${err} <br> Please try again`;
  }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) handleSubmit(e);
})