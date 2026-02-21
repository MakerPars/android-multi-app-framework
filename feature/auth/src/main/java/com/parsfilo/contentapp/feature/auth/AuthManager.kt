package com.parsfilo.contentapp.feature.auth

/**
 * Re-export AuthManager from core:auth for backward compatibility.
 * New code should import from com.parsfilo.contentapp.core.auth.AuthManager directly.
 */
@Deprecated(
    message = "Use com.parsfilo.contentapp.core.auth.AuthManager directly",
    replaceWith = ReplaceWith(
        "AuthManager",
        "com.parsfilo.contentapp.core.auth.AuthManager"
    )
)
typealias AuthManager = com.parsfilo.contentapp.core.auth.AuthManager
