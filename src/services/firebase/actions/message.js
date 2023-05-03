// import { messaging } from "firebase-admin";

// messaging.getToken().then((token) => {
//     console.log('FCM token:', token);
//     // TODO: Save token to your database
//   }).catch((err) => {
//     console.log('Unable to get FCM token.', err);
//   });

//   messaging.getToken().then((token)=>{
//     console.log('FCM Token:', token);
//   }).catch((err)=>{
//     console.log("Unable to get FCM token.", err);
//   })

// import React, { useEffect } from 'react';
// import { messaging } from './firebase';

// function NotificationPermission() {
//   useEffect(() => {
//     Notification.requestPermission().then(permission => {
//       if (permission === 'granted') {
//         messaging.getToken().then(token => {
//           console.log('FCM token:', token);
//         });
//       }
//     });
//   }, []);

//   return null;
// }

// export default NotificationPermission;
