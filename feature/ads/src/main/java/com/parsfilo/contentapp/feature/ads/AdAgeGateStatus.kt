package com.parsfilo.contentapp.feature.ads

enum class AdAgeGateStatus(val storageValue: String) {
    UNKNOWN("UNKNOWN"),
    UNDER_16("UNDER_16"),
    AGE_16_OR_OVER("AGE_16_OR_OVER"),
    ;

    companion object {
        fun fromStorage(value: String?): AdAgeGateStatus =
            entries.firstOrNull { it.storageValue == value } ?: UNKNOWN
    }
}
