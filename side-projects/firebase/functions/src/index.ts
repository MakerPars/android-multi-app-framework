import * as admin from "firebase-admin";

// Firebase Admin SDK başlat
admin.initializeApp();

// Function export'ları
// MOVED to direct Firestore SDK writes from Android client (FirestorePushRegistrationSender)
// export { registerDevice } from "./registerDevice";
export { dispatchNotifications } from "./dispatchNotifications";
// MOVED to Cloudflare Worker (contentapp-content-api /api/other-apps with icon enrichment)
// export { otherAppsFeed } from "./otherAppsFeed";
export { sendTestNotification } from "./sendTestNotification";
export { deviceCoverageReport } from "./deviceCoverageReport";
export { adPerformance, generateAdPerformanceWeeklyReport } from "./adPerformanceReport";
export { adminAccessCheck } from "./adminAccessCheck";
// MOVED to Cloudflare Worker (contentapp-content-api /api/recaptcha-verify)
// export { recaptchaVerify } from "./recaptchaVerify";
export { verifyPurchase } from "./verifyPurchase";
