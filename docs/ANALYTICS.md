# Analytics (Firebase Analytics / GA4)

Bu dokuman, projedeki **uygulama ici davranis eventleri**nin (Firebase Analytics / GA4) standartlarini ve debug/test akislarini tanimlar.

## Prensipler

- Event adlari ve parametre key'leri **degistirilmemelidir**.
  - Tarihsel raporlari bozar.
  - Ister istemez dashboard/segment drift olusur.
- Event/param isimleri tek yerden yonetilir:
  - `core/firebase/src/main/java/com/parsfilo/contentapp/core/firebase/AnalyticsContract.kt`
- Debug ve Release ayrimi analitik tarafinda parametre ile yapilir:
  - `build_type` (`debug`/`release`)
  - `flavor` (Amenerrasulu, Ayetelkursi, ...)
  - `app_lang` ve `tz` user property olarak set edilir.

## DebugView (Gercek Zamanli Dogrulama)

Firebase Console -> Analytics -> DebugView ekraninda eventleri canli gormek icin:

1. Uygulamayi cihazina kur:
   - `./gradlew :app:installAmenerrasuluDebug`
2. Debug property set et:
   - `adb shell setprop debug.firebase.analytics.app com.parsfilo.amenerrasulu`
3. Uygulamayi yeniden baslat:
   - `adb shell am force-stop com.parsfilo.amenerrasulu`
   - Uygulamayi ac.
4. DebugView'da eventlerin gelmesini bekle (bazi cihazlarda 5-30 sn gecikebilir).

Kapatmak icin:

- `adb shell setprop debug.firebase.analytics.app .none.`

## Event Listesi (MVP)

Bu eventler, “minimum is gorur” telemetri setidir. Hepsi tek contract'a baglidir.

- `tab_selected` (param: `tab`)
- `screen_view` (Firebase default; `logScreenView` ile loglaniyor)
- `display_mode_changed` (param: `old_mode`, `new_mode`)
- `audio_play` / `audio_pause` / `audio_stop` (param: `position_ms`, `duration_ms`)
- Push:
  - `push_received` (param: `push_type`)
  - `push_open` (param: `push_type`)
- Bildirim liste aksiyonlari:
  - `notification_open`
  - `notification_mark_read`
  - `notification_mark_unread`
  - `notifications_mark_all_read`
  - `notification_delete`
  - `notifications_delete_all`
- Paylasim:
  - `share` (Firebase standard; content_type=`app_recommendation`, platform=`whatsapp`)

## Test Senaryolari (Hizli)

1. Navigation:
   - Tab degistir -> `tab_selected` gelmeli.
   - Ekran gecisleri -> `screen_view` gelmeli.
2. Display mode:
   - Arapca -> Latince / Turkce degis -> `display_mode_changed` gelmeli.
3. Audio:
   - Play/Pause/Stop -> `audio_*` gelmeli.
4. Push:
   - `scripts/send_fcm_test.py` ile data-only push gonder -> `push_received` + sistem notification.
   - Notification'a tikla -> `push_open` + app icinde Notifications tab acilmali.
5. Notifications UI:
   - Bir item'a tikla -> `notification_open` + `notification_mark_read`
   - Tumunu oku/sil -> ilgili toplu eventler.

## Notlar

- Android tarafinda “force-stop” sonrasi data-only FCM teslimati platform limitleri nedeniyle garanti degildir.
- Debug trafgini GA4 raporlarindan ayirmak icin `build_type` ve `flavor` filtreleri kullanilmalidir.

