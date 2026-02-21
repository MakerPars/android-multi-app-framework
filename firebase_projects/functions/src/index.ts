import * as admin from "firebase-admin";

// Firebase Admin SDK başlat
admin.initializeApp();

// Function export'ları
export { registerDevice } from "./registerDevice";
export { dispatchNotifications } from "./dispatchNotifications";
export { otherAppsFeed } from "./otherAppsFeed";