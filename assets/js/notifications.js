const notifications = document.getElementById('jsNotifications');

const fireNotification = (text, color, textcolor) => {
  const notification = document.createElement('div');
  notification.innerText = text;
  notification.style.backgroundColor = color;
  notification.style.color = textcolor;
  notifications.appendChild(notification);
};

export const handleNewUser = ({ nickname }) => {
  fireNotification(`${nickname} 님 입장!`, 'rgb(0,122,255)', 'rgb(255,255,255)');
};

export const handleByeUser = ({ nickname }) => {
  fireNotification(`${nickname} 님 퇴장!`, 'rgb(255, 149, 0)', 'rgb(255,255,255)');
};
