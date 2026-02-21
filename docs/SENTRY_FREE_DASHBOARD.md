# Sentry Free Dashboard (Android)

Bu proje için Sentry tarafında ücretsiz planda en faydalı kurulum:
- Error monitoring (Crash + non-fatal)
- Release health (session/crash-free)
- Compose navigation breadcrumbs/tracing
- Custom Metrics (`Sentry.metrics()`) — bu repoda aktif

## 1) Kodda Aktif Olan Metrikler

Aşağıdaki metrik anahtarları uygulamada gönderiliyor:

- `app.sentry.init.success` (count)
- `app.sentry.init.skipped` (count)
- `app.on_create.duration` (distribution, unit: `millisecond`)
- `push.topics.configured` (gauge)
- `push.topics.subscribe.success` (count)
- `push.topics.subscribe.failure` (count)
- `navigation.screen_view` (count)
- `ads.initialize.called` (count)
- `ads.initialize.skipped.gated` (count)
- `ads.load.requested.app_open` (count)
- `ads.load.requested.interstitial` (count)
- `ads.load.requested.native` (count)
- `ads.load.requested.rewarded` (count)
- `ads.load.requested.rewarded_interstitial` (count)
- `ads.interstitial.show.attempt` (count)
- `ads.interstitial.dismissed` (count)
- `ads.app_open.show.attempt` (count)
- `ads.app_open.show.skipped.gated` (count)
- `ads.app_open.dismissed` (count)
- `ads.rewarded_interstitial.show.attempt` (count)
- `ads.rewarded_interstitial.show.skipped.gated` (count)
- `ads.rewarded_interstitial.reward_earned` (count)
- `ads.rewarded_interstitial.dismissed` (count)
- `ads.reward_free_window.minutes` (gauge, unit: `minute`)

## 2) Dashboard Kurulumu (UI üzerinden, güvenli yol)

Sentry > Dashboards > Create Dashboard.

Her widget eklerken:
1. Dataset olarak `Metrics` seç.
2. Metric name alanında yukarıdaki anahtarı dropdown’dan seç.
3. Aggregate seçimini metrik tipine göre yap:
   - `count` için: `sum`
   - `gauge` için: `avg` veya `max`
   - `distribution` için: `p50`, `p95`, `avg`
4. Group by olarak önce sadece `environment` kullan (yüksek cardinality riskini azaltır).

### Önerilen Widget Seti

1. **App Start p95 (ms)**
- Metric: `app.on_create.duration`
- Aggregate: `p95`
- Display: Line

2. **Sentry Init Success vs Skipped**
- Metric: `app.sentry.init.success` + `app.sentry.init.skipped`
- Aggregate: `sum`
- Display: Stacked bar

3. **Push Subscribe Failures**
- Metric: `push.topics.subscribe.failure`
- Aggregate: `sum`
- Display: Line

4. **Navigation Volume**
- Metric: `navigation.screen_view`
- Aggregate: `sum`
- Display: Line

5. **Ad Load Requests by Type**
- Metrics:
  - `ads.load.requested.app_open`
  - `ads.load.requested.interstitial`
  - `ads.load.requested.native`
  - `ads.load.requested.rewarded`
  - `ads.load.requested.rewarded_interstitial`
- Aggregate: `sum`
- Display: Multi-line

6. **Interstitial Funnel**
- Metrics:
  - `ads.interstitial.show.attempt`
  - `ads.interstitial.dismissed`
- Aggregate: `sum`
- Display: Bar

7. **Rewarded Interstitial Funnel**
- Metrics:
  - `ads.rewarded_interstitial.show.attempt`
  - `ads.rewarded_interstitial.reward_earned`
  - `ads.rewarded_interstitial.dismissed`
- Aggregate: `sum`
- Display: Bar

8. **Reward Free Window (minutes)**
- Metric: `ads.reward_free_window.minutes`
- Aggregate: `avg`
- Display: Line

## 3) Free Planda Faydalı Alert Önerileri

Sentry > Alerts bölümünde aşağıdakileri oluştur:

1. **Crash spike alert**
- Koşul: son 30 dk error issue count ani artış
- Scope: `environment:production`

2. **Startup regression alert**
- Koşul: `app.on_create.duration` p95, 24 saat ortalamasına göre belirgin artış

3. **Push subscribe failure alert**
- Koşul: `push.topics.subscribe.failure` > 0 (5-10 dk pencerede)

4. **Ad pipeline anomaly alert**
- Koşul: `ads.interstitial.show.attempt` artarken `ads.interstitial.dismissed` çok düşük kalırsa

## 4) Android Tarafında Açık Olan Ek Entegrasyonlar

- `SentryAndroid.init(...)` (manual init)
- Compose navigation: `withSentryObservableEffect(...)`
- Build tags:
  - `flavor`
  - `build_type`
- Breadcrumbs:
  - Ad show/dismiss/reward olayları

## 5) Linux Doğrulama Komutları

```bash
# env yükle
sed -i 's/\r$//' .env
set -a
source <(grep -E '^[A-Za-z_][A-Za-z0-9_]*=' .env)
set +a

# sentry auth test
sentry-cli info
sentry-cli send-event -m "android metrics smoke" --level info
```

## 6) Notlar

- Metric isimleri sabit ve düşük cardinality tutuldu.
- Kullanıcı ID, email gibi PII metric key/value içine konulmamalı.
- Yeni metric eklerken isim formatı aynı kalmalı: `domain.action.result`.

## 0) Dashboard'ı Otomatik Oluştur / Güncelle

```bash
# Dry-run
python scripts/ci/create_sentry_dashboard.py \
  --org oaslananka \
  --project android-multi-app-framework \
  --dry-run

# Create/Update (upsert by title)
python scripts/ci/create_sentry_dashboard.py \
  --org oaslananka \
  --project android-multi-app-framework
```

Script aynı başlığa sahip dashboard varsa `PUT` ile günceller, yoksa `POST` ile oluşturur.
