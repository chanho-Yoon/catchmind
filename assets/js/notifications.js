const notifications = document.getElementById('jsNotifications');

const fireNotification = (text, color) => {
  const notification = document.createElement('div');
  notification.innerText = text;
  notification.style.backgroundColor = color;
  notification.className = 'notification';
  notifications.appendChild(notification);
};

export const handleNewUser = ({ nickname }) => {
  fireNotification(`${nickname} 님 입장!`, 'rgb(0, 122, 255)');
};

export const handleByeUser = ({ nickname }) => {
  fireNotification(`${nickname} 님 퇴장!`, 'rgb(255, 149, 0)');
};
