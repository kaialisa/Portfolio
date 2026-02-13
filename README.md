## Project Structure

```
kaialisa-2026/
  index.html          # Main page structure
  css/
    styles.css        # All styling
  js/
    projects.js       # Your project data (EDIT THIS to add/remove projects)
    scripts.js        # Site functionality
  img/                # Images (WebP format)
  optimize-images.js  # Script to convert new images to WebP
```

## Adding a New Project

Open `js/projects.js` and add a new object at the **top** of the `projects` array (new projects appear first on the page):

```javascript
{
  title: "My New Project",
  categories: ["video"], // or ["digital"] or ["research"] or mix
  img: "img/my-image.webp",
  type: "Video",
  year: "2026",
  video: "https://youtube.com/watch?v=...", // optional
  link: "https://example.com",              // optional
  role: "Director",
  desc: "Project description here.",
  grid: "normal",  // or "wide" or "tall"
  hover: "warm",   // see hover effects below
},
```

### Grid Sizes
- **normal** — 1x1 square
- **wide** — 2x1 horizontal rectangle
- **tall** — 1x2 vertical rectangle (becomes normal on mobile)

### Hover Effects
Each project needs a `hover` value that controls how the image transforms on hover:

- **warm** — zoom + warm sepia tint 
- **cold** — rotate + blue/cyan shift 
- **harsh** — hard zoom + high contrast
- **vivid** — saturate + slight rotate
- **grayscale** — zoom + desaturate to high-contrast B&W 
- **drift** — float upward + saturated hue shift 
- **invert** — zoom + slight invert 
- **skew** — zoom + skew angle 

## Adding New Images

1. Put your new image (jpg/png) in the `img/` folder
2. Run the optimizer:
   ```bash
   node optimize-images.js
   ```
3. This creates a WebP version at 82% quality, max width 1920px
4. Reference it in `projects.js` as `img/filename.webp`

The optimizer skips files that already have WebP versions, so it's safe to run repeatedly.