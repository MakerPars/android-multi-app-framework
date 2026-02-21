package com.parsfilo.contentapp.core.firebase

/**
 * Analytics contract:
 * - Event names and param keys are centralized to prevent drift.
 * - Keep names stable (changing names breaks historical reporting).
 *
 * Firebase Analytics constraints (high level):
 * - Event name: <= 40 chars, starts with a letter, [A-Za-z0-9_]
 * - Param key: <= 40 chars, starts with a letter, [A-Za-z0-9_]
 * - User property: <= 24 chars, starts with a letter, [A-Za-z0-9_]
 */
object AnalyticsEventName {
    const val TAB_SELECTED = "tab_selected"

    const val VERSE_READ = "verse_read"
    const val DISPLAY_MODE_CHANGED = "display_mode_changed"

    const val AUDIO_PLAY = "audio_play"
    const val AUDIO_PAUSE = "audio_pause"
    const val AUDIO_STOP = "audio_stop"
    const val AUDIO_COMPLETE = "audio_complete"

    const val AD_SHOWN = "ad_shown"
    const val AD_CLICKED = "ad_clicked"
    const val AD_FAILED_TO_LOAD = "ad_failed_to_load"

    const val PUSH_RECEIVED = "push_received"
    const val PUSH_OPEN = "push_open"

    const val NOTIFICATION_OPEN = "notification_open"
    const val NOTIFICATION_MARK_READ = "notification_mark_read"
    const val NOTIFICATION_MARK_UNREAD = "notification_mark_unread"
    const val NOTIFICATIONS_MARK_ALL_READ = "notifications_mark_all_read"
    const val NOTIFICATION_DELETE = "notification_delete"
    const val NOTIFICATIONS_DELETE_ALL = "notifications_delete_all"

    const val PAYWALL_VIEW = "paywall_view"
    const val PURCHASE_START = "purchase_start"
    const val PURCHASE_SUCCESS = "purchase_success"
    const val PURCHASE_FAILED = "purchase_failed"
    const val AD_IMPRESSION = "ad_impression"
    const val CONTENT_PLAY_START = "content_play_start"
    const val CONTENT_PLAY_COMPLETE = "content_play_complete"
}

object AnalyticsParamKey {
    const val TAB = "tab"

    const val VERSE_ID = "verse_id"
    const val DISPLAY_MODE = "display_mode"
    const val OLD_MODE = "old_mode"
    const val NEW_MODE = "new_mode"

    const val POSITION_MS = "position_ms"
    const val DURATION_MS = "duration_ms"
    const val TOTAL_DURATION_MS = "total_duration_ms"

    const val AD_TYPE = "ad_type"
    const val AD_UNIT_ID = "ad_unit_id"
    const val ERROR_CODE = "error_code"
    const val ERROR_MESSAGE = "error_message"

    const val PUSH_TYPE = "push_type"

    const val PLAN_ID = "plan_id"
    const val REASON = "reason"
}

object AnalyticsUserPropertyKey {
    const val FLAVOR = "flavor"
    const val BUILD_TYPE = "build_type"
    const val APP_LANG = "app_lang"
    const val TZ = "tz"
}
