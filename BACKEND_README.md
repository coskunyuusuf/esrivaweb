# ESRiVA Backend Entegrasyon Rehberi

## Genel Bakış

Frontend tamamen API-driven çalışacak şekilde tasarlanmıştır. Tüm dinamik içerik backend'den çekilir ve admin paneli üzerinden yönetilebilir.

## Gerekli API Endpoint'leri

### 1. Hakkımızda (About)
```http
GET /api/about
```
**Ne Zaman Çağrılır:** Sayfa ilk yüklendiğinde
**Nerede Görünür:** "Hakkımızda" bölümünde

**Response Formatı:**
```json
{
  "success": true,
  "data": {
    "title": "ESRiVA Yazılım Ajansı",
    "subtitle": "Teknoloji ile geleceği şekillendiriyoruz",
    "description": "2015 yılından bu yana dijital dünyada markaların başarısı için çalışıyoruz...",
    "features": [
      {
        "icon": "fas fa-code",
        "title": "Web Geliştirme",
        "description": "Modern ve responsive web siteleri"
      },
      {
        "icon": "fas fa-mobile-alt",
        "title": "Mobil Uygulama",
        "description": "iOS ve Android uygulamaları"
      },
      {
        "icon": "fas fa-paint-brush",
        "title": "UI/UX Tasarım",
        "description": "Kullanıcı odaklı tasarım"
      }
    ]
  }
}
```

### 2. Hizmetler (Services)
```http
GET /api/services
```
**Ne Zaman Çağrılır:** Sayfa ilk yüklendiğinde
**Nerede Görünür:** "Hizmetlerimiz" bölümünde kartlar halinde

**Response Formatı:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Web Geliştirme",
      "description": "Modern ve responsive web siteleri geliştiriyoruz...",
      "image": "https://example.com/service-image.jpg",
      "category": "web"
    }
  ]
}
```

### 3. Projeler (Projects)
```http
GET /api/projects?serviceId={id}
```
**Ne Zaman Çağrılır:** Kullanıcı bir hizmet kartına tıkladığında
**Nerede Görünür:** "İlgili Projeler" bölümünde (dinamik açılır)
**Önemli:** `serviceId` parametresi zorunlu!

**Response Formatı:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "E-Ticaret Platformu",
      "description": "Modern React.js ile geliştirilmiş...",
      "image": "https://example.com/project-image.jpg",
      "category": "web",
      "url": "https://project-demo.com",
      "serviceId": 1
    }
  ]
}
```

### 4. Ekip Üyeleri (Team)
```http
GET /api/team
```
**Response Formatı:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "role": "Full Stack Developer",
      "photo": "https://example.com/team-member.jpg",
      "linkedin": "https://linkedin.com/in/johndoe",
      "email": "john@esriva.com.tr",
      "gender": "men"
    }
  ]
}
```

### 5. Testimonial
```http
GET /api/testimonials
```
**Response Formatı:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "quote": "ESRiVA ile çalışmak harika bir deneyimdi...",
      "author": {
        "name": "Jane Smith",
        "role": "CEO",
        "photo": "https://example.com/customer-photo.jpg",
        "gender": "women"
      }
    }
  ]
}
```

### 6. İş Ortakları (Partners)
```http
GET /api/partners
```
**Response Formatı:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Partner Şirketi",
      "logo": "https://example.com/partner-logo.png",
      "url": "https://partner-website.com"
    }
  ]
}
```

### 7. İletişim Formu (Contact)
```http
POST /api/contact
```
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Proje Talebi",
  "message": "Merhaba, bir web sitesi projesi için..."
}
```

## Mevcut Frontend Yapısı

### Dosya Organizasyonu
```
/
├── index.html          # Ana sayfa
├── styles.css          # Tüm stiller (responsive dahil)
├── script.js           # Ana JavaScript logic
└── background.jpg.jpg  # Hero background resmi
```

### Statik Veri Kullanımı
Frontend'de tüm veriler statik olarak `script.js` dosyasında tanımlanmıştır. API bağlantısı kaldırılmıştır.

## Admin Panel Gereksinimleri

### Yönetilebilir İçerikler
1. **Hakkımızda Yönetimi**
   - Başlık, alt başlık, açıklama
   - Özellikler listesi (icon, başlık, açıklama)

2. **Hizmetler Yönetimi**
   - Hizmet ekleme/düzenleme/silme
   - Görsel yükleme
   - Kategori seçimi

3. **Proje Yönetimi**
   - Projeleri hizmetlere bağlama (serviceId)
   - Proje görselleri
   - Demo URL'leri

4. **Ekip Yönetimi**
   - Üye ekleme/düzenleme
   - LinkedIn ve email linkleri
   - Profil fotoğrafları

5. **Testimonial Yönetimi**
   - Müşteri yorumları
   - Müşteri bilgileri (isim, rol, fotoğraf)

6. **Partner Yönetimi**
   - Partner logoları
   - Partner web siteleri

## Özel Özellikler

### 1. Hizmet-Proje Bağlantısı
**ÖNEMLİ:** Bu sistemin nasıl çalıştığını anlamak kritik!

#### Nasıl Çalışır:
1. **Ana Sayfa:** `/api/services` çağrısı yapılır → Hizmetler listelenir
2. **Hizmet Tıklanma:** Kullanıcı bir hizmete tıklar (örn: "Web Geliştirme")
3. **Proje Çekme:** `/api/projects?serviceId=1` çağrısı yapılır
4. **Gösterim:** O hizmete ait projeler dinamik olarak yüklenir

#### Service ID Mapping:
```javascript
1 = "Web Geliştirme"
2 = "Mobil Uygulama" 
3 = "UI/UX Tasarım"
4 = "Dijital Pazarlama"
5 = "Sistem Entegrasyonu"

// Proje ekleme example:
{
  "serviceId": 1,  // Bu proje "Web Geliştirme" altında görünür
  "title": "E-Ticaret Sitesi"
}
```

#### Frontend'de Çalışma Mantığı:
- `script.js` → `RelatedProjectsManager.loadRelatedProjects(serviceId)`
- Service card'ına tıklanma → `data-service-id` alınır
- API çağrısı yapılır → Projeler yüklenir
- Smooth geçiş animasyonu çalışır

### 2. Responsive Carousel'ler
- Team slider: 3→1 card (desktop→mobile)
- Testimonials slider: 2→1 card (desktop→mobile)
- Otomatik kaydırma (10 saniye)
- Touch/swipe desteği

### 3. Loading States
- Tüm API çağrıları için loading spinnerları
- Error handling ile kullanıcı dostu mesajlar
- Graceful degradation

## Deployment Notları

### Environment Variables
```env
API_BASE_URL=https://api.esriva.com.tr/api/v1
WHATSAPP_PHONE=905555555555
```

### Static Assets
- Tüm görseller CDN üzerinden servis edilmeli
- Optimize edilmiş görsel formatları (WebP, AVIF)
- Lazy loading implementasyonu mevcut

### Performance
- Minified CSS/JS
- Gzip compression
- Browser caching headers
- Mobile-first approach

## Test Edilmesi Gerekenler

1. **API Endpoints**
   - Tüm endpoint'lerin çalışması
   - Error handling (404, 500, network errors)
   - Response format uyumluluğu

2. **Admin Panel**
   - CRUD operasyonları
   - Görsel yükleme
   - Real-time preview

3. **Responsive Design**
   - Tüm breakpoint'lerde test
   - Touch gestures (mobile)
   - Cross-browser compatibility

## İletişim

Frontend hazır ve backend entegrasyonu için bekliyor. Herhangi bir sorun veya özelleştirme talebi için iletişime geçin.

---
**Son Güncelleme:** 2025
**Frontend Versiyonu:** v1.0
**Durum:** Backend entegrasyonu için hazır
