(function () {
  const form = $('form[name="webchat"]');
  const input = $('form[name="webchat"] input');
  const ul = $('form[name="webchat"] ul');

  const formE = document.querySelectorAll('form[name="webchat"]');
  const inputE = document.querySelectorAll('form[name="webchat"] input');
  const chat = document.getElementById('room');

  const scrollHeight = 999999;

  const socket = io('', {
    'reconnectionAttempts': 30,
    'reconnectionDelay': 500
  });

  socket
    .on('message', function (username, message) {
      printMessage(message, username);
    })
    .on('leave', function (username) {
      printStatus(username + " покинул чат", "#d6f1e9");
    })
    .on('join', function (username) {
      printStatus(username + " зашел в чат", "#d6f1e9");
    })
    .on('connect', function () {
      printStatus("Соединение установлено", "#26fa88");
      form.on('submit', sendMessage);
      input.prop('disabled', false);
    })
    .on('disconnect', function () {
      printStatus("Переподключение...", "#f1d6ee");
      form.off('submit', sendMessage);
      input.prop('disabled', true);
    })
    .on('logout', function () {
      location.href = "/";
    })
    .on('error', function (reason) {
      if (reason == "handshake unauthorized") {
        printStatus("Вы покинули чат");
      }
    })
    .on('reconnect_failed', function () {
      printStatus("Соединение потеряно", "#f1d6ee");
    });

  const sendMessage = function () {
    const text = input.val();
    socket.emit('message', text, function (data) {
      printMessage(data, 'you')
    });
    input.val('');
    return false;
  }

  const currentTime = function(){
    let date = new Date();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      if(minutes<10){
        minutes = '0' + date.getMinutes();
      }
    return hours + ':' + minutes;
  }

  const printMessage = function (text, username) {
    let message = document.createElement('li');
      message.className = 'message';
      if(username=='you'){
        message.style.alignSelf = 'flex-end';
        message.style.backgroundColor = '#5dd0e1';
      }
      else{
        message.style.alignSelf = 'flex-start';
        message.style.backgroundColor = '#fcfd45';
      }
      message.innerHTML = text;
    chat.appendChild(message);

    let description = document.createElement('span');
      description.className = 'description';
      if(username=='you'){
        description.style.alignSelf = 'flex-end';
      }
      else{
        description.style.alignSelf = 'flex-start';
      }
      description.innerHTML = username + ', ' + currentTime();
    chat.appendChild(description);

    chat.scrollTop = scrollHeight;
  }

  const printStatus = (status, color) => {
    let statusMessage = document.createElement('li');
      statusMessage.className = 'log';
      statusMessage.style.backgroundColor = color;
      statusMessage.innerHTML = status;
    chat.appendChild(statusMessage);
    chat.scrollTop = scrollHeight;
  }
})();
