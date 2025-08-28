// services/notifications.js
// Mock data para modo desarrollo
let mockNotifications = [
  {
    id: "notif1",
    recipient: "emp1@example.com",
    subject: "Leave Approved",
    message: "Your leave from 2023-06-01 to 2023-06-05 has been approved.",
    status: "unread",
    createdAt: "2023-05-22T14:45:00Z"
  },
  {
    id: "notif2",
    recipient: "emp1@example.com",
    subject: "New Policy",
    message: "Please review the updated company policy.",
    status: "read",
    createdAt: "2023-07-01T10:20:00Z"
  }
];

// ✅ Simular fetch de notificaciones del usuario
export async function getUserNotifications(userEmail) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = mockNotifications.filter(
        (n) => n.recipient === userEmail
      );
      resolve(Array.isArray(data) ? data : []); // 🔒 siempre array
    }, 300);
  });
}

// ✅ Simular envío de notificación
export async function sendNotification(recipient, subject, message) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newNotif = {
        id: `notif${Date.now()}`,
        recipient,
        subject,
        message,
        status: "unread",
        createdAt: new Date().toISOString()
      };
      mockNotifications.push(newNotif);
      resolve(newNotif);
    }, 200);
  });
}

// ✅ Marcar como leída
export async function markNotificationAsRead(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const notif = mockNotifications.find((n) => n.id === id);
      if (!notif) return reject(new Error("Notification not found"));
      notif.status = "read";
      resolve(notif);
    }, 200);
  });
}

// ✅ Contador de no leídas
export async function getUnreadCount(userEmail) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const count = mockNotifications.filter(
        (n) => n.recipient === userEmail && n.status === "unread"
      ).length;
      resolve(count);
    }, 150);
  });
}
