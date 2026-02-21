package com.parsfilo.contentapp.feature.content.data

import android.content.Context
import com.parsfilo.contentapp.core.common.network.AppDispatchers
import com.parsfilo.contentapp.core.common.network.Dispatcher
import com.parsfilo.contentapp.core.model.MiraclesPrayer
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.withContext
import org.json.JSONArray
import timber.log.Timber
import javax.inject.Inject

interface MiraclesPrayerRepository {
    suspend fun getPrayers(): List<MiraclesPrayer>
    suspend fun getPrayerByIndex(index: Int): MiraclesPrayer?
}

class AssetMiraclesPrayerRepository @Inject constructor(
    @ApplicationContext private val context: Context,
    @Dispatcher(AppDispatchers.IO) private val ioDispatcher: CoroutineDispatcher
) : MiraclesPrayerRepository {

    override suspend fun getPrayers(): List<MiraclesPrayer> = withContext(ioDispatcher) {
        try {
            val jsonString = context.assets.open("data.json").bufferedReader().use { it.readText() }
            val jsonArray = JSONArray(jsonString)
            val prayers = mutableListOf<MiraclesPrayer>()
            
            for (i in 0 until jsonArray.length()) {
                val obj = jsonArray.getJSONObject(i)
                prayers.add(
                    MiraclesPrayer(
                        duaIsim = obj.getString("duaIsim"),
                        duaAciklama = obj.getString("duaAciklama"),
                        duaBesmele = obj.getString("duaBesmele"),
                        duaArapca = obj.getString("duaArapca")
                    )
                )
            }
            prayers
        } catch (e: Exception) {
            Timber.e(e, "data.json (miracles) parse hatası")
            emptyList()
        }
    }

    override suspend fun getPrayerByIndex(index: Int): MiraclesPrayer? = withContext(ioDispatcher) {
        getPrayers().getOrNull(index)
    }
}
