
const messageBox = document.querySelector('.hello');
const fullBody = document.getElementsByTagName('body');
const writeEvent = (text) => {
    const parent = document.querySelector('.hello');
    const el = document.createElement('h3');
    el.innerHTML = text;
    parent.appendChild(el);
    messageBox.scrollTop = messageBox.scrollHeight;
}

const writeScore = (text) => {
    const parent = document.querySelector('.points');
    const currentScore = parent.childNodes[0];
    const el = document.createElement('h3');
    el.innerHTML = text;
    console.log(el);
    parent.replaceChild(el,parent.childNodes[0]);
}


const onFormSubmitted = (e) => {
    e.preventDefault();
    const input = document.querySelector('#chat');
    const text = input.value;
    input.value = '';
    sock.emit('message',text);
};

const addButtonListeners = () => {
    ['rock','paper','scissors'].forEach((id) => {
        const button = document.getElementById(id);
        button.addEventListener('click',() => {
            sock.emit('turn',id);
        })
    })
};



const sock = io();
sock.on('message',writeEvent);
sock.on('score',writeScore);


document
.querySelector('#chat-form')
.addEventListener('submit',onFormSubmitted);

addButtonListeners();
