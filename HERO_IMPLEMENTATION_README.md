# 🎯 Hero Section Implementation Guide

This repository contains two implementations of a full-screen Hero section featuring 3 realistic laptops and 1 mobile device with video content and scroll-based animations.

## 📁 Files Overview

- **`index.html`** - Main HTML with CSS-based laptop animations
- **`styles.css`** - Complete CSS styling for the Hero section
- **`script.js`** - JavaScript for CSS-based animations
- **`threejs-hero.html`** - Three.js version with true 3D video mapping
- **`threejs-hero.js`** - Three.js implementation
- **`HERO_IMPLEMENTATION_README.md`** - This documentation file

## 🎬 Features

### ✨ Core Functionality
- **3 Realistic Laptops** with individual video content
- **1 Mobile Device** with video content
- **Realistic Desk Surface** with 3D perspective
- **Scroll-Responsive Animations** - screens open/close based on scroll direction
- **Video Autoplay** - all videos loop, are muted, and autoplay
- **Smooth Hinge Animations** - realistic laptop screen opening/closing

### 🎥 Video Content
Each device displays different video content:
- **Laptop 1**: Web Development workflow
- **Laptop 2**: Mobile App development
- **Laptop 3**: Cloud Services
- **Mobile**: Mobile-first approach

## 🚀 Implementation Options

### Option 1: CSS-Based Implementation (Recommended for most use cases)

**File**: `index.html` + `styles.css` + `script.js`

**Pros**:
- ✅ Lightweight and fast
- ✅ No external dependencies
- ✅ Easy to customize
- ✅ Works on all devices
- ✅ SEO friendly

**Cons**:
- ❌ Limited 3D effects
- ❌ Videos are 2D overlays

**Usage**:
1. Include the HTML in your page
2. Add the CSS to your stylesheet
3. Include the JavaScript file
4. Videos will automatically autoplay and loop

### Option 2: Three.js Implementation (For advanced 3D effects)

**File**: `threejs-hero.html` + `threejs-hero.js`

**Pros**:
- ✅ True 3D video mapping
- ✅ Realistic shadows and lighting
- ✅ Advanced 3D animations
- ✅ Professional 3D rendering

**Cons**:
- ❌ Requires Three.js library (~500KB)
- ❌ More complex to customize
- ❌ Higher performance requirements

**Usage**:
1. Include Three.js and TWEEN.js libraries
2. Use the Three.js HTML file
3. Include the Three.js JavaScript file
4. Videos are mapped as textures on 3D geometry

## 🛠️ Customization Guide

### Changing Video Content

#### CSS Version
```html
<video class="screen-video" autoplay loop muted playsinline>
    <source src="your-video.mp4" type="video/mp4">
    <source src="your-backup-video.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>
```

#### Three.js Version
```javascript
const videoUrls = [
    'your-video-1.mp4',
    'your-video-2.mp4',
    'your-video-3.mp4'
];
```

### Adjusting Animation Timing

#### CSS Version
```css
.laptop-screen,
.laptop-lid {
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
```

#### Three.js Version
```javascript
const openAnimation = new TWEEN.Tween(screen.rotation)
    .to({ x: -Math.PI / 2 }, 800) // 800ms duration
    .easing(TWEEN.Easing.Cubic.Out);
```

### Modifying Colors and Styling

All colors are defined in CSS variables:
```css
:root {
    --bg-primary: #121212;
    --accent-primary: #00ff88;
    --text-primary: #ffffff;
    /* ... more variables */
}
```

## 📱 Responsive Design

The Hero section automatically adapts to different screen sizes:

- **Desktop**: Full 3D perspective with angled laptop positioning
- **Tablet**: Reduced perspective with maintained 3D effects
- **Mobile**: Vertical stacking with simplified transforms

## 🔧 Technical Details

### CSS Implementation
- Uses CSS 3D transforms for laptop positioning
- CSS transitions for smooth animations
- Intersection Observer for scroll detection
- Responsive design with media queries

### Three.js Implementation
- WebGL rendering with hardware acceleration
- Video textures mapped to 3D geometry
- Real-time lighting and shadow calculations
- Optimized for 60fps performance

### Performance Considerations
- Videos are muted and autoplay to avoid user interaction requirements
- CSS version is lightweight and works on all devices
- Three.js version includes performance optimizations for smooth animations

## 🚨 Browser Compatibility

### CSS Version
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers

### Three.js Version
- ✅ Chrome 60+ (WebGL support)
- ✅ Firefox 55+ (WebGL support)
- ✅ Safari 12+ (WebGL support)
- ✅ Edge 79+ (WebGL support)
- ⚠️ Mobile browsers (performance may vary)

## 📋 Integration Steps

### Step 1: Choose Implementation
Decide between CSS-based (lightweight) or Three.js (advanced 3D) version.

### Step 2: Add Files
Include the necessary HTML, CSS, and JavaScript files in your project.

### Step 3: Customize Content
Replace video sources, adjust colors, and modify text content as needed.

### Step 4: Test Responsiveness
Ensure the Hero section works properly on all target devices.

### Step 5: Optimize Performance
- Compress video files for faster loading
- Test on various devices and browsers
- Monitor performance metrics

## 🎨 Design Customization

### Laptop Appearance
- Modify colors in CSS variables
- Adjust laptop dimensions in CSS
- Change port configurations and branding

### Desk Surface
- Customize desk texture pattern
- Adjust perspective and shadows
- Modify desk dimensions and positioning

### Animation Effects
- Adjust timing and easing functions
- Modify scroll sensitivity
- Customize floating animations

## 🔍 Troubleshooting

### Common Issues

**Videos not autoplaying**:
- Ensure videos are muted
- Check browser autoplay policies
- Verify video file formats

**Animations not smooth**:
- Check device performance
- Reduce video quality if needed
- Optimize CSS transitions

**Three.js not working**:
- Verify Three.js library is loaded
- Check browser WebGL support
- Review console for errors

### Performance Tips

1. **Video Optimization**:
   - Use compressed MP4 format
   - Keep file sizes under 5MB
   - Consider multiple quality versions

2. **CSS Optimization**:
   - Use `transform` instead of `position` for animations
   - Minimize repaints and reflows
   - Use `will-change` property sparingly

3. **Three.js Optimization**:
   - Limit polygon count
   - Use texture compression
   - Implement level-of-detail (LOD)

## 📞 Support

For questions or customization requests:
- Review the code comments for implementation details
- Check browser console for error messages
- Test on different devices and browsers
- Consider performance implications of changes

## 📄 License

This implementation is provided as-is for educational and commercial use. Modify and adapt as needed for your project requirements.

---

**Note**: The CSS version is recommended for most websites due to its simplicity and performance. Use the Three.js version only when advanced 3D effects are required and performance is not a primary concern.

