package com.parsfilo.contentapp.core.firebase.push

data class PushRegistrationPayload(
    val installationId: String,
    val fcmToken: String,
    val packageName: String,
    val locale: String,
    val timezone: String,
    val notificationsEnabled: Boolean,
    val appVersion: String,
    val deviceModel: String,
    val reason: String,
    val syncedAtEpochMs: Long,
)

