# Cloudflare Migration Notes

## Faz 1
- Worker: `/api/other-apps`, `/api/audio-manifest`, `/api/audio/:key`
- R2: audio dosyalari bucket'ta tutulur
- Firebase push ve scheduler aynen devam

## Faz 2
- mobil_web static icerigi Cloudflare Pages'e tasin
- Android uygulamada katalog URL'leri Cloudflare endpointine alinsin

## Faz 3
- Trafik ve maliyet analizi
- Gerekirse Firebase tarafindaki static/API parcasi kapatilir
