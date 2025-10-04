// ============================================================================
// MATRIX EFFECT SYSTEM
// ============================================================================

class MatrixEffect {
    constructor(container, options = {}) {
        if (!container) return;
        
        this.container = container;
        this.options = {
            fontSize: 16,
            color: '#00ff88',
            speed: 50,
            opacity: 0.7,
            letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789'.split(''),
            ...options
        };
        
        this.isVisible = !document.hidden;
        this.animationId = null;
        this.lastTime = 0;
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.setupEventListeners();
        this.start();
    }
    
    createCanvas() {
        this.container.innerHTML = '';
        this.canvas = document.createElement('canvas');
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
    }
    
    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
        this.canvas.style.cssText = 'width:100%;height:100%;max-width:100%;max-height:100%';
        
        this.columns = Math.floor(this.canvas.width / this.options.fontSize);
        this.drops = Array(this.columns).fill(1);
    }
    
    draw() {
        if (!this.isVisible) return;
        
        // Fade effect
        this.ctx.fillStyle = `rgba(0, 0, 0, 0.08)`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = this.options.color;
        this.ctx.font = `${this.options.fontSize}px monospace`;
        
        for (let i = 0; i < this.drops.length; i++) {
            const text = this.options.letters[Math.floor(Math.random() * this.options.letters.length)];
            const x = i * this.options.fontSize;
            const y = this.drops[i] * this.options.fontSize;
            
            if (y >= 0 && y < this.canvas.height) {
                this.ctx.fillText(text, x, y);
            }
            
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
    }
    
    animate(timestamp) {
        if (timestamp - this.lastTime >= this.options.speed) {
            this.draw();
            this.lastTime = timestamp;
        }
        this.animationId = requestAnimationFrame(this.animate.bind(this));
    }
    
    start() {
        this.animationId = requestAnimationFrame(this.animate.bind(this));
    }
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    changeSpeed(newSpeed) {
        this.options.speed = newSpeed;
    }
    
    setupEventListeners() {
        const resizeHandler = () => this.resize();
        const visibilityHandler = () => this.isVisible = !document.hidden;
        
        window.addEventListener('resize', resizeHandler, { passive: true });
        document.addEventListener('visibilitychange', visibilityHandler, { passive: true });
        
        this.cleanup = () => {
            window.removeEventListener('resize', resizeHandler);
            document.removeEventListener('visibilitychange', visibilityHandler);
        };
    }
    
    destroy() {
        this.stop();
        if (this.cleanup) this.cleanup();
    }
}

// ============================================================================
// API DATA LOADING & RENDERING
// ============================================================================

class DataManager {
    static async loadServices() {
        console.log('Loading services...');
        // Statik hizmetler yükleniyor
        const staticServices = [
            {
                id: 1,
                title: "Web Geliştirme",
                description: "Modern ve responsive web siteleri, e-ticaret platformları ve web uygulamaları geliştiriyoruz.",
                category: "web",
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop"
            },
            {
                id: 2,
                title: "Mobil Uygulama",
                description: "iOS ve Android için native ve cross-platform mobil uygulamalar geliştiriyoruz.",
                category: "mobile",
                image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=300&fit=crop"
            },
            {
                id: 3,
                title: "UI/UX Tasarım",
                description: "Kullanıcı deneyimi odaklı modern ve estetik tasarım çözümleri sunuyoruz.",
                category: "design",
                image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop"
            },
            {
                id: 4,
                title: "Dijital Pazarlama",
                description: "SEO, SEM, sosyal medya yönetimi ve içerik pazarlama hizmetleri veriyoruz.",
                category: "marketing",
                image: "https://images.unsplash.com/photo-1557838923-2985c318be48?w=500&h=300&fit=crop"
            },
            {
                id: 5,
                title: "Sistem Entegrasyonu",
                description: "Mevcut sistemlerinizi entegre ederek verimliliğinizi artırıyoruz.",
                category: "integration",
                image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=300&fit=crop"
            },
            {
                id: 6,
                title: "Teknik Danışmanlık",
                description: "Dijital dönüşüm sürecinizde teknik danışmanlık ve strateji hizmetleri.",
                category: "consulting",
                image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=500&h=300&fit=crop"
            }
        ];
        this.renderServices(staticServices);
    }
    
    static async loadAbout() {
        // Statik about verisiyle çalış
        const staticAbout = {
            title: "ESRiVA Yazılım Ajansı",
            subtitle: "Teknoloji ile geleceği şekillendiriyoruz",
            description: "2015 yılından bu yana dijital dünyada markaların başarısı için çalışıyoruz. Modern teknolojiler ve yaratıcı çözümlerle işletmenizi dijital dönüşüm yolculuğunda destekliyoruz.",
            features: [
                {
                    icon: "fas fa-code",
                    title: "Web Geliştirme",
                    description: "Modern ve responsive web siteleri"
                },
                {
                    icon: "fas fa-mobile-alt",
                    title: "Mobil Uygulama",
                    description: "iOS ve Android uygulamaları"
                },
                {
                    icon: "fas fa-paint-brush",
                    title: "UI/UX Tasarım",
                    description: "Kullanıcı odaklı tasarım"
                }
            ]
        };
        this.renderAbout(staticAbout);
    }

    static async loadTeam() {
        // Statik ekip verileriyle çalış
        const staticTeam = [
            {
                id: 1,
                name: "Emre Kılıç",
                role: "Koordinatör",
                photo: "https://media.licdn.com/dms/image/v2/D4E03AQE5Wve0_0jmTA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1715716278769?e=1758758400&v=beta&t=93pfmOSplHvkgVKwuyFHE-oxVSO-No8T896NRbV3Bfo",
                linkedin: "https://linkedin.com/in/emrekilic",
                email: "emre@esriva.com.tr",
                gender: "men"
            },
            {
                id: 2,
                name: "Esra Çufadaroğlu",
                role: "Yönetim, Satış, Pazarlama",
                photo: "https://media.licdn.com/dms/image/v2/D4D03AQE6JPqxsfkTsw/profile-displayphoto-scale_400_400/B4DZjYSDTWGkAk-/0/1755975269005?e=1758758400&v=beta&t=9MC-n6ngYnQI3Qwp3lbCJObZuQBOBgGaWrnG20Ydpkw",
                linkedin: "https://linkedin.com/in/esracufadaroglu",
                email: "esra@esriva.com.tr",
                gender: "women"
            },
            {
                id: 3,
                name: "Yiğit Ataman",
                role: "Web Developer",
                photo: "https://media.licdn.com/dms/image/v2/D4D03AQHYtSDiegedPA/profile-displayphoto-scale_400_400/B4DZhAkz2RHAAk-/0/1753430049807?e=1758758400&v=beta&t=OyID_1YyouXWSYwtRUSh0J05ZAWP7W3yMgNLWeHdNhw",
                linkedin: "https://linkedin.com/in/yigitataman",
                email: "yigit@esriva.com.tr",
                gender: "men"
            },
            {
                id: 4,
                name: "Emirhan Berber",
                role: "Web Developer, Mobile Developer",
                photo: "https://media.licdn.com/dms/image/v2/D4D03AQGD362E_akWxQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1730636281894?e=1758758400&v=beta&t=4jmGAhkckaPxrT6mDsjeBuR-alO5-N58rJUh05DEO2M",
                linkedin: "https://linkedin.com/in/emirhanberber",
                email: "emirhan@esriva.com.tr",
                gender: "men"
            },
            {
                id: 5,
                name: "Fatih Kaplan",
                role: "Web Developer",
                photo: "https://media.licdn.com/dms/image/v2/D4D03AQGyPYXM-OugsA/profile-displayphoto-scale_400_400/B4DZgjKKbpGkAg-/0/1752936524311?e=1758758400&v=beta&t=VUgCFZxroLh0Zsi-7XxdHj3CPCpeUppwm1ZgC-37Htg",
                linkedin: "https://linkedin.com/in/fatihkaplan",
                email: "fatih@esriva.com.tr",
                gender: "men"
            },
            {
                id: 6,
                name: "Yusuf Coşkun",
                role: "Frontend Developer",
                photo: "https://media.licdn.com/dms/image/v2/D4E03AQEiQKtyvqNp5w/profile-displayphoto-scale_400_400/B4EZjc8zxZGwAk-/0/1756053587036?e=1758758400&v=beta&t=Pt0Oak7aZDfA6vvFND-_Srl6A3tKwL7IojdV9VGWie8",
                linkedin: "https://linkedin.com/in/yusufcoskun",
                email: "yusuf@esriva.com.tr",
                gender: "men"
            },
            {
                id: 7,
                name: "Eren Bahadır",
                role: "Web Developer",
                photo: "https://media.licdn.com/dms/image/v2/D4E03AQHr-t9Kiq7UPw/profile-displayphoto-shrink_400_400/B4EZdjwJ5JHsAg-/0/1749725258427?e=1758758400&v=beta&t=YBg6SeUeLGO81Q_e7mIYPIZOpnRtoabKB1CvZ1MIKmc",
                linkedin: "https://linkedin.com/in/erenbahadir",
                email: "eren@esriva.com.tr",
                gender: "men"
            },
            {
                id: 8,
                name: "Onur Emircan Sönmez",
                role: "Web Developer",
                photo: "https://i.imgur.com/bf2HMUZ.jpeg",
                linkedin: "https://linkedin.com/in/onuremircansonmez",
                email: "onur@esriva.com.tr",
                gender: "men"
            },
            {
                id: 9,
                name: "Hanife Öztürk",
                role: "Designer",
                photo: "https://media.licdn.com/dms/image/v2/D4D03AQFNrdfgDA91pA/profile-displayphoto-shrink_400_400/B4DZcg4u2aGgAg-/0/1748603433361?e=1758758400&v=beta&t=BMBHkP_rry6mriChZWcPdmkWtTRoGKIkeb2TISH2NPE",
                linkedin: "https://linkedin.com/in/hanifeozturk",
                email: "hanife@esriva.com.tr",
                gender: "women"
            },
            {
                id: 10,
                name: "Emre Süngü",
                role: "Frontend Developer, Social Media Manager",
                photo: "https://i.imgur.com/KMV187t.jpeg",
                linkedin: "https://linkedin.com/in/emresungu",
                email: "emre.sungu@esriva.com.tr",
                gender: "men"
            },
            {
                id: 11,
                name: "Tuğba Alptoğa",
                role: "Social Media Manager",
                photo: "https://i.imgur.com/0aqDxNR.jpeg",
                linkedin: "https://linkedin.com/in/tugbaalptoga",
                email: "tugba@esriva.com.tr",
                gender: "women"
            }
        ];
        this.renderTeam(staticTeam);
    }
    
    static async loadTestimonials() {
        // Statik referanslarla çalış
        const staticTestimonials = [
            {
                id: 1,
                name: "Ahmet Yılmaz",
                position: "CEO, TechStart",
                company: "TechStart",
                content: "ESRiVA ile çalışmak gerçekten harika bir deneyimdi. Profesyonel yaklaşımları ve kaliteli iş çıkarmaları sayesinde e-ticaret sitemiz %300 büyüme kaydetti. Kesinlikle tavsiye ederim!",
                rating: 5,
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            },
            {
                id: 2,
                name: "Ayşe Kaya",
                position: "Pazarlama Müdürü",
                company: "Digital Solutions",
                content: "Mobil uygulamamızın geliştirilmesinde ESRiVA'nın gösterdiği performans muhteşemdi. Zamanında teslim, bütçe dahilinde ve beklentilerimizin üzerinde bir sonuç aldık.",
                rating: 5,
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            },
            {
                id: 3,
                name: "Mehmet Demir",
                position: "Kurucu",
                company: "StartupHub",
                content: "ESRiVA'nın teknik uzmanlığı ve yaratıcı çözümleri sayesinde startup'ımız hızla büyüdü. Özellikle kullanıcı deneyimi tasarımı konusundaki yaklaşımları çok etkileyici.",
                rating: 5,
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            },
            {
                id: 4,
                name: "Selin Yıldız",
                position: "Dijital Pazarlama Uzmanı",
                company: "Growth Marketing",
                content: "ESRiVA'nın SEO ve dijital pazarlama stratejileri sayesinde web sitemizin organik trafiği %400 arttı. Özellikle içerik pazarlama konusundaki yaklaşımları çok başarılı.",
                rating: 5,
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            },
            {
                id: 5,
                name: "Burak Kaya",
                position: "Yazılım Geliştirici",
                company: "CodeCraft",
                content: "ESRiVA ile birlikte geliştirdiğimiz projelerde kullandığımız modern teknolojiler ve best practice'ler gerçekten etkileyici. Kod kalitesi ve performans optimizasyonu konusunda çok başarılılar.",
                rating: 5,
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            },
            {
                id: 6,
                name: "Elif Özkan",
                position: "UI/UX Tasarımcısı",
                company: "Design Studio",
                content: "ESRiVA'nın tasarım ekibi ile çalışmak gerçekten keyifli. Kullanıcı deneyimi odaklı yaklaşımları ve modern tasarım trendlerini takip etmeleri projelerimizi çok başarılı kıldı.",
                rating: 5,
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            }
        ];
        this.renderTestimonials(staticTestimonials);
    }
    
    static async loadPartners() {
        // Statik verilerle çalış
        const staticPartners = [
            {
                id: 1,
                name: "Turhost",
                logo: "https://www.turhost.com/logo-set/JPEG/logo_turhost-logo.jpg"
            },
            {
                id: 2,
                name: "Microsoft",
                logo: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/RWCZER-Legal-IP-Trademarks-CP-MS-logo-740x417-1?wid=406&hei=230&fit=crop&resSharp=1"
            },
            {
                id: 3,
                name: ".NET",
                logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Microsoft_.NET_logo.svg/2048px-Microsoft_.NET_logo.svg.png"
            },
            {
                id: 4,
                name: "Microsoft SQL Server",
                logo: "https://thumbs.dreamstime.com/b/logo-icon-vector-logos-logo-icons-set-social-media-flat-banner-vectors-svg-eps-jpg-jpeg-emblem-wallpaper-background-editorial-208329569.jpg"
            },
            {
                id: 5,
                name: "Flutter",
                logo: "https://logosandtypes.com/wp-content/uploads/2021/04/Flutter.png"
            }
        ];
        this.renderPartners(staticPartners);
    }
    
    static renderAbout(aboutData) {
        const titleElement = document.querySelector('#about .section-header h2');
        const subtitleElement = document.querySelector('#about .section-header p');
        const descriptionElement = document.querySelector('#about .about-text h3');
        const contentElement = document.querySelector('#about .about-text p');
        const featuresContainer = document.querySelector('#about .about-features');
        
        if (titleElement) titleElement.textContent = aboutData.title || 'Hakkımızda';
        if (subtitleElement) subtitleElement.textContent = aboutData.subtitle || 'Teknoloji ile geleceği şekillendiriyoruz';
        if (descriptionElement) descriptionElement.textContent = aboutData.title || 'ESRiVA Yazılım Ajansı';
        if (contentElement) contentElement.textContent = aboutData.description || '2015 yılından bu yana dijital dünyada markaların başarısı için çalışıyoruz.';
        
        if (featuresContainer && aboutData.features) {
            featuresContainer.innerHTML = aboutData.features.map(feature => `
                <div class="feature">
                    <i class="${feature.icon}"></i>
                    <h4>${feature.title}</h4>
                    <p>${feature.description}</p>
                </div>
            `).join('');
        }
    }
    
    static renderServices(services) {
        console.log('Rendering services:', services);
        const container = document.getElementById('services-grid');
        if (!container) {
            console.error('services-grid container not found!');
            return;
        }
        
        container.innerHTML = services.map((service, index) => `
            <a href="javascript:void(0)" 
               class="project-card project-${service.category || 'general'}" 
               data-service-id="${service.id}"
               aria-label="${service.title} hizmeti">
                <div class="project-image">
                    <div class="matrix-bg" id="matrixBgProject${index + 1}"></div>
                    <img class="project-photo" src="${service.image || 'https://i.hizliresim.com/crbhiuk.png'}" alt="${service.title}">
                    <div class="project-overlay"></div>
                </div>
                <div class="project-content">
                    <h3>${service.title}</h3>
                    <p>${service.description}</p>
                </div>
            </a>
        `).join('');
        
        MatrixManager.initProjectEffects();
        
        // Hizmetler render edildikten sonra RelatedProjectsManager'ı başlat
        RelatedProjectsManager.init();
    }
    
    static renderTeam(team) {
        const container = document.getElementById('team-slider');
        if (!container) return;
        
        // Backend'den gelen tüm üyeleri göster
        const allMembers = team;
        
        container.innerHTML = allMembers.map(member => `
            <div class="team-slide" data-name="${member.name}">
                <div class="team-member">

                    <div class="member-name">
                        <h3>${member.name}</h3>
                    </div>

                    <div class="member-image">
                        <img src="${member.photo || `https://randomuser.me/api/portraits/${member.gender || 'men'}/${Math.floor(Math.random() * 99)}.jpg`}" alt="${member.name}">
                    </div>

                    <div class="member-info">
                        
                        <div class="member-role-badges">
                            ${member.role.split(',').map(role => `
                                <span class="member-role-badge">${role.trim()}</span>
                            `).join('')}
                        </div>
                        <div class="member-social">
                            ${member.linkedin ? `<a href="${member.linkedin}" class="social-icon" target="_blank"><i class="fab fa-linkedin"></i></a>` : ''}
                            ${member.email ? `<a href="mailto:${member.email}" class="social-icon"><i class="fas fa-envelope"></i></a>` : ''}
                        </div>
                    </div>

                    

                </div>
            </div>
        `).join('');
        console.log('Team members rendered:', allMembers.length);
        
        CarouselManager.initTeamCarousel();
    }
    
    static renderTestimonials(testimonials) {
        const container = document.getElementById('testimonials-slider');
        if (!container) return;
        
        console.log('Rendering testimonials:', testimonials.length, testimonials);
        
        container.innerHTML = testimonials.map(testimonial => `
            <div class="testimonial-slide">
                <div class="testimonial">
                    <div class="testimonial-content">
                        <p>"${testimonial.content || testimonial.quote}"</p>
                        <div class="testimonial-author">
                            <img src="${testimonial.avatar || testimonial.author?.photo || `https://randomuser.me/api/portraits/${testimonial.author?.gender || 'men'}/${Math.floor(Math.random() * 99)}.jpg`}" alt="${testimonial.name || testimonial.author?.name}" class="customer-photo">
                            <div class="author-info">
                                <h4>${testimonial.name || testimonial.author?.name}</h4>
                                <span>${testimonial.position || testimonial.author?.role}${testimonial.company ? `, ${testimonial.company}` : ''}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        console.log('Testimonials rendered, total slides:', document.querySelectorAll('.testimonial-slide').length);
        
        CarouselManager.initTestimonialsCarousel();
    }
    
    static renderPartners(partners) {
        const container = document.getElementById('partners-grid');
        if (!container) return;
        
        container.innerHTML = partners.map(partner => `
            <div class="partner-logo" title="${partner.name}">
                <img src="${partner.logo}" alt="${partner.name} Logosu">
            </div>
        `).join('');
    }
    
    static showError(containerId, message) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="btn btn-primary">Tekrar Dene</button>
                </div>
            `;
        }
    }
}

// ============================================================================
// MATRIX EFFECTS MANAGER
// ============================================================================

class MatrixManager {
    static effects = {};
    
    static init() {
        this.initHeroEffect();
        this.initFooterEffect();
        this.initVideoEffect();
    }
    
    static initHeroEffect() {
        const container = document.getElementById('matrixBg');
        if (container) {
            this.effects.hero = new MatrixEffect(container, {
                fontSize: 14,
                color: '#00ff88',
                speed: 80,
                opacity: 0.55,
                letters: '01アィゥェォカサタナハマヤラワ0123456789'.split('')
            });
        }
    }
    
    static initFooterEffect() {
        const container = document.getElementById('matrixBgFooter');
        if (container) {
            this.effects.footer = new MatrixEffect(container, {
                fontSize: 14,
                color: '#00ff88',
                speed: 60,
                opacity: 0.4
            });
        }
    }
    
    static initVideoEffect() {
        const container = document.getElementById('matrixBgVideo');
        if (container) {
            this.effects.video = new MatrixEffect(container, {
                fontSize: 12,
                color: '#00ff88',
                speed: 60,
                opacity: 0.4,
                letters: '01アィゥェォカサタナハマヤラワ0123456789'.split('')
            });
        }
    }
    
    static initProjectEffects() {
        const projectColors = ['#d1fae5', '#dbeafe', '#ede9fe', '#cffafe'];
        
        for (let i = 1; i <= 4; i++) {
            const container = document.getElementById(`matrixBgProject${i}`);
            if (container) {
                this.effects[`project${i}`] = new MatrixEffect(container, {
                    fontSize: 10,
                    color: projectColors[i - 1] || '#ffffff',
                    speed: 80,
                    opacity: 0.22
                });
            }
        }
    }
    
    static cleanup() {
        Object.values(this.effects).forEach(effect => {
            if (effect && effect.destroy) {
                effect.destroy();
            }
        });
        this.effects = {};
    }
}

// ============================================================================
// CAROUSEL MANAGER
// ============================================================================

class CarouselManager {
    static initTeamCarousel() {
        console.log('=== CAROUSEL INIT START ===');
        
        const slider = document.querySelector('.team-slider');
        console.log('Slider found:', slider);
        
        const slides = document.querySelectorAll('.team-slide');
        console.log('Slides found:', slides.length);
        
        const prevBtn = document.querySelector('.team-arrow.prev-arrow');
        console.log('Prev button found:', prevBtn);
        
        const nextBtn = document.querySelector('.team-arrow.next-arrow');
        console.log('Next button found:', nextBtn);
        
        if (!slider) {
            console.error('Slider not found!');
            return;
        }
        
        if (!slides.length) {
            console.error('No slides found!');
            return;
        }
        
        let currentSlide = 0;
        const totalSlides = 11; // Manuel olarak 11 ekip üyesi
        let autoSlideInterval;
        
        console.log('Total slides:', totalSlides);
        
        // Responsive için görünen kart sayısını belirle
        const getVisibleSlides = () => {
            if (window.innerWidth <= 768) return 1; // Mobil: 1 kart
            if (window.innerWidth <= 1024) return 2; // Tablet: 2 kart
            return 3; // Desktop: 3 kart
        };
        
        const updateSlider = () => {
            let slideWidth;
            if (window.innerWidth <= 768) {
                slideWidth = 350; // Mobil: 350px (gap yok)
            } else if (window.innerWidth <= 1024) {
                slideWidth = 355; // iPad: 350px + 5px gap = 355px (3 kart gözüküyor)
            } else {
                slideWidth = 355; // Desktop: 350px + 5px gap = 355px (değişmedi)
            }
            const translateX = -(currentSlide * slideWidth);
            slider.style.transform = `translateX(${translateX}px)`;
            console.log('UPDATE SLIDER:', { currentSlide, translateX, totalSlides, slideWidth, windowWidth: window.innerWidth });
        };
        
        const nextSlide = () => {
            console.log('NEXT CLICKED!');
            // 3 kart gözüken yapılarda (n-3) başa dön, tek kart gözüken yapılarda son karttan sonra başa dön
            if (window.innerWidth > 768) {
                // Desktop ve iPad: 3 kart gözüküyor, 8. karttan sonra başa dön (11-3=8)
                if (currentSlide >= 8) {
                    currentSlide = 0;
                } else {
                    currentSlide++;
                }
            } else {
                // Mobil: 1 kart gözüküyor, son karttan sonra başa dön
                if (currentSlide >= 10) {
                    currentSlide = 0;
                } else {
                    currentSlide++;
                }
            }
            console.log('New current slide:', currentSlide, 'Total slides:', totalSlides);
            updateSlider();
            resetAutoSlide();
        };
        
        const prevSlide = () => {
            console.log('PREV CLICKED!');
            // 3 kart gözüken yapılarda (n-3) sona git, tek kart gözüken yapılarda son karta git
            if (window.innerWidth > 768) {
                // Desktop ve iPad: 3 kart gözüküyor, ilk karttaysa 8. karta git
                if (currentSlide <= 0) {
                    currentSlide = 8;
                } else {
                    currentSlide--;
                }
            } else {
                // Mobil: 1 kart gözüken, ilk karttaysa son karta git
                if (currentSlide <= 0) {
                    currentSlide = 10;
                } else {
                    currentSlide--;
                }
            }
            console.log('New current slide:', currentSlide);
            updateSlider();
            resetAutoSlide();
        };
        
        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
            console.log('Next button listener added successfully');
        } else {
            console.error('Next button not found!');
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlide);
            console.log('Prev button listener added successfully');
        } else {
            console.error('Prev button not found!');
        }
        
        const startAutoSlide = () => {
            autoSlideInterval = setInterval(() => {
                nextSlide();
            }, 7000);
        };
        
        const resetAutoSlide = () => {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
            }
            startAutoSlide();
        };
        
        // İlk yüklemede slider'ı sıfırla
        updateSlider();
        
        // Slider'ın doğru pozisyonda başlaması için kısa bir gecikme
        setTimeout(() => {
            updateSlider();
        }, 100);
        
        // Otomatik kaydırmayı başlat
        startAutoSlide();
        

        
        // Responsive için resize listener ekle
        window.addEventListener('resize', updateSlider);
        
        console.log('=== CAROUSEL INIT END ===');
    }
    
    static initTestimonialsCarousel() {
        const slider = document.querySelector('.testimonials-slider');
        const slides = document.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.slider-arrow.prev-arrow');
        const nextBtn = document.querySelector('.slider-arrow.next-arrow');
        
        console.log('Initializing testimonials carousel:', {
            slider: !!slider,
            slidesCount: slides.length,
            prevBtn: !!prevBtn,
            nextBtn: !!nextBtn
        });
        
        if (!slider || !slides.length) return;
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        // Responsive için görünen kart sayısını belirle
        const getVisibleSlides = () => {
            if (window.innerWidth <= 768) return 1; // Mobil: 1 kart
            if (window.innerWidth <= 900) return 1; // iPad/Tablet: 1 kart
            if (window.innerWidth <= 1024) return 1; // Tablet: 1 kart
            return 2; // Desktop: 2 kart
        };
        
        const updateSlider = () => {
            const visibleSlides = getVisibleSlides();
            const slideWidth = 100 / visibleSlides;
            const translateX = -(currentSlide * slideWidth);
            slider.style.transform = `translateX(${translateX}%)`;
            
            console.log('Slider updated:', {
                currentSlide,
                totalSlides,
                visibleSlides,
                slideWidth,
                translateX
            });
        };
        
        const nextSlide = () => {
            const visibleSlides = getVisibleSlides();
            const maxSlide = Math.max(0, totalSlides - visibleSlides);
            
            if (currentSlide >= maxSlide) {
                // Son kartlara ulaştıysa başa dön
                currentSlide = 0;
            } else {
                currentSlide++;
            }
            updateSlider();
        };
        
        const prevSlide = () => {
            if (currentSlide <= 0) {
                // İlk karttaysa sona git
                const visibleSlides = getVisibleSlides();
                const maxSlide = Math.max(0, totalSlides - visibleSlides);
                currentSlide = maxSlide;
            } else {
                currentSlide--;
            }
            updateSlider();
        };
        
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        
        // Auto slide
        setInterval(nextSlide, 10000);
        
        // Responsive için resize listener
        window.addEventListener('resize', updateSlider);
    }
}

// ============================================================================
// UI MANAGER
// ============================================================================

class UIManager {
    static init() {
        this.initMobileMenu();
        this.initSmoothScrolling();
        this.initNavbarScroll();
        this.initContactForm();
        this.initWhatsAppFab();
        this.initAnimations();
    }
    
    static initMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
            
            // Close menu when clicking links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    }
    
    static initSmoothScrolling() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const offsetTop = target.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    static initNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    navbar.style.background = 'rgba(18, 18, 18, 0.98)';
                } else {
                    navbar.style.background = 'rgba(18, 18, 18, 0.95)';
                }
            });
        }
    }
    
    static async initContactForm() {
        const form = document.querySelector('.contact-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Gönderiliyor...';
                submitBtn.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    alert('Mesajınız başarıyla gönderildi!');
                    form.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 1000);
            });
        }
    }
    
    static initWhatsAppFab() {
        const fab = document.getElementById('whatsapp-fab');
        if (fab) {
            const phone = fab.getAttribute('data-phone')?.replace(/[^\d]/g, '');
            const message = fab.getAttribute('data-message') || '';
            
            if (phone) {
                const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
                fab.setAttribute('href', url);
            }
        }
    }
    
    static initAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.feature, .project-card, .testimonial, .stat').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// ============================================================================
// RELATED PROJECTS MANAGER
// ============================================================================

class RelatedProjectsManager {
    static init() {
        const cards = document.querySelectorAll('.projects .project-card');
        const relatedSection = document.getElementById('related-projects');
        const relatedGrid = relatedSection?.querySelector('.related-grid');
        const backBtn = relatedSection?.querySelector('#related-back-btn');
        
        if (!cards.length || !relatedSection || !relatedGrid) return;
        
        cards.forEach(card => {
            card.addEventListener('click', async (e) => {
                e.preventDefault();
                
                const serviceId = this.getServiceIdFromCard(card);
                const headerText = card.querySelector('.project-content h3')?.textContent || '';
                
                if (card.classList.contains('active')) {
                    card.classList.remove('active');
                    relatedSection.classList.remove('open');
                } else {
                    cards.forEach(c => c.classList.remove('active'));
                    card.classList.add('active');
                    await this.loadRelatedProjects(serviceId, headerText, relatedGrid, relatedSection);
                }
            });
        });
        
        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const projectsSection = document.getElementById('projects');
                if (projectsSection) {
                    const offsetTop = projectsSection.offsetTop - 70;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
            });
        }
    }
    
    static getServiceIdFromCard(card) {
        return card.getAttribute('data-service-id');
    }
    
    static async loadRelatedProjects(serviceId, headerText, relatedGrid, relatedSection) {
        // Statik projelerle çalış
        console.log('Statik projeler yükleniyor...');
        const staticProjects = this.getStaticProjects(serviceId);
        console.log('Statik projeler:', staticProjects);
        relatedGrid.innerHTML = staticProjects.map(project => `
            <a href="${project.url || 'javascript:void(0)'}" class="project-card project-${project.category || 'general'}">
                <div class="project-image">
                    <img class="project-photo" src="${project.image || 'https://i.hizliresim.com/crbhiuk.png'}" alt="${project.title}">
                    <div class="project-overlay"></div>
                </div>
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                </div>
            </a>
        `).join('');
        
        relatedSection.classList.add('open');
        
        const offsetTop = relatedSection.offsetTop - 70;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
    
    static getStaticProjects(serviceId) {
        console.log('getStaticProjects called with serviceId:', serviceId, typeof serviceId);
        // ServiceId'yi number'a çevir
        const id = parseInt(serviceId);
        console.log('Converted serviceId:', id);
        
        // ServiceId 1 için örnek projeler
        if (id === 1) {
            return [
                {
                    id: 1,
                    title: "Modern E-Ticaret Platformu",
                    description: "React ve Node.js kullanılarak geliştirilmiş tam özellikli e-ticaret web uygulaması. Kullanıcı dostu arayüz, güvenli ödeme sistemi ve admin paneli içerir.",
                    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    category: "Web Geliştirme",
                    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
                    link: "#"
                },
                {
                    id: 2,
                    title: "Kurumsal Web Sitesi",
                    description: "Profesyonel kurumsal web sitesi. SEO optimizasyonu, hızlı yükleme süreleri ve modern tasarım ile marka değerini artıran çözüm.",
                    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80",
                    category: "Web Tasarım",
                    technologies: ["HTML5", "CSS3", "JavaScript", "WordPress"],
                    link: "#"
                },
                {
                    id: 3,
                    title: "Blog Platformu",
                    description: "Kişisel ve kurumsal bloglar için geliştirilmiş modern platform. Zengin içerik editörü, kategoriler ve sosyal medya entegrasyonu.",
                    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    category: "Web Geliştirme",
                    technologies: ["Vue.js", "Laravel", "MySQL", "Redis"],
                    link: "#"
                }
            ];
        }
        
        // ServiceId 2 için örnek projeler
        if (id === 2) {
            return [
                {
                    id: 4,
                    title: "Mobil Uygulama",
                    description: "iOS ve Android için geliştirilmiş cross-platform mobil uygulama. Flutter framework kullanılarak hızlı ve performanslı çözüm.",
                    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    category: "Mobil Geliştirme",
                    technologies: ["Flutter", "Dart", "Firebase", "REST API"],
                    link: "#"
                },
                {
                    id: 5,
                    title: "Fitness Takip Uygulaması",
                    description: "Kişisel fitness hedeflerini takip eden mobil uygulama. Egzersiz planları, beslenme takibi ve ilerleme raporları.",
                    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    category: "Mobil Geliştirme",
                    technologies: ["React Native", "Node.js", "MongoDB", "Push Notifications"],
                    link: "#"
                },
                {
                    id: 6,
                    title: "E-Ticaret Mobil Uygulaması",
                    description: "Mobil e-ticaret deneyimi için özel olarak tasarlanmış uygulama. Hızlı alışveriş, güvenli ödeme ve kişiselleştirilmiş öneriler.",
                    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    category: "Mobil Geliştirme",
                    technologies: ["Swift", "Kotlin", "Firebase", "Stripe"],
                    link: "#"
                }
            ];
        }
        
        // ServiceId 3 için örnek projeler
        if (id === 3) {
            return [
                {
                    id: 7,
                    title: "Veri Analizi Dashboard",
                    description: "Gerçek zamanlı veri analizi ve raporlama dashboard'u. Kullanıcı dostu arayüz ile karmaşık verileri anlaşılır hale getiren çözüm.",
                    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    category: "Veri Analizi",
                    technologies: ["Python", "Django", "Chart.js", "PostgreSQL"],
                    link: "#"
                },
                {
                    id: 8,
                    title: "Makine Öğrenmesi Modeli",
                    description: "Müşteri davranışlarını analiz eden makine öğrenmesi modeli. Tahmin algoritmaları ve otomatik raporlama sistemi.",
                    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    category: "Veri Analizi",
                    technologies: ["Python", "Scikit-learn", "TensorFlow", "Jupyter"],
                    link: "#"
                },
                {
                    id: 9,
                    title: "İş Zekası Raporlama",
                    description: "Kurumsal iş zekası ve raporlama sistemi. KPI takibi, performans analizi ve stratejik karar destek sistemi.",
                    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    category: "Veri Analizi",
                    technologies: ["Power BI", "Tableau", "SQL Server", "Azure"],
                    link: "#"
                }
            ];
        }
        
        // ServiceId 4 için örnek projeler
        if (id === 4) {
            return [
                {
                    id: 10,
                    title: "Dijital Pazarlama Kampanyası",
                    description: "Sosyal medya ve Google Ads entegrasyonu ile kapsamlı dijital pazarlama kampanyası. Hedef kitle analizi ve ROI optimizasyonu.",
                    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80",
                    category: "Dijital Pazarlama",
                    technologies: ["Google Ads", "Facebook Ads", "Instagram", "Analytics"],
                    link: "#"
                },
                {
                    id: 11,
                    title: "SEO Optimizasyonu",
                    description: "Arama motoru optimizasyonu ile web sitesi trafiğini artıran kapsamlı SEO çalışması. Anahtar kelime analizi ve içerik stratejisi.",
                    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    category: "SEO",
                    technologies: ["Google Analytics", "Search Console", "Keyword Research", "Content Marketing"],
                    link: "#"
                },
                {
                    id: 12,
                    title: "İçerik Pazarlama Stratejisi",
                    description: "Blog, video ve sosyal medya içerikleri ile marka bilinirliğini artıran kapsamlı içerik pazarlama stratejisi.",
                    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    category: "İçerik Pazarlama",
                    technologies: ["WordPress", "YouTube", "LinkedIn", "Email Marketing"],
                    link: "#"
                }
            ];
        }
        
        // ServiceId 5 için örnek projeler
        if (id === 5) {
            return [
                {
                    id: 13,
                    title: "Grafik Tasarım Projesi",
                    description: "Marka kimliği ve kurumsal kimlik tasarımı. Logo, kartvizit, broşür ve sosyal medya görselleri tasarımı.",
                    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    category: "Grafik Tasarım",
                    technologies: ["Adobe Photoshop", "Adobe Illustrator", "InDesign", "Figma"],
                    link: "#"
                },
                {
                    id: 14,
                    title: "UI/UX Tasarım",
                    description: "Kullanıcı deneyimi odaklı arayüz tasarımı. Wireframe, prototip ve kullanıcı testleri ile optimize edilmiş tasarım.",
                    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    category: "UI/UX",
                    technologies: ["Figma", "Sketch", "Adobe XD", "InVision"],
                    link: "#"
                },
                {
                    id: 15,
                    title: "Web Sitesi Tasarımı",
                    description: "Modern ve responsive web sitesi tasarımı. Kullanıcı deneyimi odaklı, SEO dostu ve hızlı yüklenen tasarım.",
                    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80",
                    category: "Web Tasarım",
                    technologies: ["Figma", "Adobe XD", "Sketch", "InVision"],
                    link: "#"
                }
            ];
        }
        
        // ServiceId 6 için örnek projeler
        if (id === 6) {
            return [
                {
                    id: 16,
                    title: "Sistem Entegrasyonu",
                    description: "Farklı sistemler arası veri entegrasyonu ve API geliştirme. Otomatik veri senkronizasyonu ve raporlama sistemi.",
                    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    category: "Sistem Entegrasyonu",
                    technologies: ["REST API", "SOAP", "JSON", "XML"],
                    link: "#"
                },
                {
                    id: 17,
                    title: "Bulut Çözümleri",
                    description: "AWS, Azure ve Google Cloud platformları üzerinde bulut tabanlı çözümler. Ölçeklenebilir ve güvenli altyapı.",
                    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    category: "Bulut Çözümleri",
                    technologies: ["AWS", "Azure", "Google Cloud", "Docker"],
                    link: "#"
                },
                {
                    id: 18,
                    title: "DevOps Otomasyonu",
                    description: "Sürekli entegrasyon ve sürekli dağıtım (CI/CD) pipeline'ları. Otomatik test, build ve deployment süreçleri.",
                    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    category: "DevOps",
                    technologies: ["Jenkins", "GitLab CI", "Docker", "Kubernetes"],
                    link: "#"
                }
            ];
        }
        
        // Diğer serviceId'ler için boş döndür
        return [];
    }
}

// ============================================================================
// VIDEO MANAGER
// ============================================================================

class VideoManager {
    static init() {
        this.loadVideo();
    }
    
    static async loadVideo() {
        // Sabit video kullan
        this.updateVideo('https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&color=white&modestbranding=1&controls=1&playsinline=1');
    }
    
    static updateVideo(videoUrl) {
        const iframe = document.getElementById('youtube-video');
        if (iframe && videoUrl) {
            iframe.src = videoUrl;
        }
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Load data from backend
    DataManager.loadAbout();
    DataManager.loadServices();
    DataManager.loadTeam();
    DataManager.loadTestimonials();
    DataManager.loadPartners();
    
    // Initialize UI components
    UIManager.init();
    MatrixManager.init();
    VideoManager.init();
    
    // Initialize carousel for team cards after data loads
    setTimeout(() => {
        CarouselManager.initTeamCarousel();
    }, 500);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    MatrixManager.cleanup();
});

// Performance optimization - throttle scroll events
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

window.addEventListener('scroll', throttle(() => {
    // Scroll handling if needed
}, 16));
