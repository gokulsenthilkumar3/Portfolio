# 🚀 GitHub Pages Setup Guide

## 📋 **Option 1: GitHub Pages (Free Hosting)**

### **Step 1: Build Your Portfolio**
```bash
npm run build
```

### **Step 2: Enable GitHub Pages**
1. Go to your repository: https://github.com/gokulsenthilkumar3/Portfolio
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under "Build and deployment", select:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
5. Click **Save**

### **Step 3: Wait for Deployment**
- GitHub will build your site (takes 2-5 minutes)
- Your portfolio will be live at: https://gokulsenthilkumar3.github.io/Portfolio

---

## 📋 **Option 2: Vercel (Recommended - Better Performance)**

### **Step 1: Go to Vercel**
Visit: https://vercel.com

### **Step 2: Import Your Repository**
1. Click **"New Project"**
2. Click **"Import Git Repository"**
3. Enter: `gokulsenthilkumar3/Portfolio`
4. Click **"Import"**

### **Step 3: Deploy**
- Vercel will automatically detect Next.js
- Click **"Deploy"**
- Your portfolio will be live at a random Vercel URL

### **Step 4: Add Custom Domain (Optional)**
- In Vercel dashboard, go to **"Domains"**
- Add your custom domain if you have one

---

## 📋 **Option 3: Netlify (Alternative)**

### **Step 1: Build and Export**
```bash
npm run build
```

### **Step 2: Go to Netlify**
Visit: https://netlify.com

### **Step 3: Drag and Drop**
- Drag the `out` folder to Netlify
- Your site will be live instantly

---

## 🎯 **Recommended: Vercel**

**Why Vercel is better for this portfolio:**
- ✅ **Zero Configuration** - Automatic Next.js optimization
- ✅ **Better Performance** - Global CDN
- ✅ **HTTPS Included** - Free SSL certificate
- ✅ **Custom Domains** - Easy domain setup
- ✅ **Analytics** - Built-in performance monitoring
- ✅ **Preview Deployments** - Automatic previews for PRs

---

## 🚀 **Quick Start with Vercel**

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy from your project folder
vercel

# 4. Follow the prompts to link your GitHub account
```

---

## 📱 **After Deployment**

### **Customize Your Portfolio:**
1. Edit `src/config/portfolio.config.ts`
2. Make your changes
3. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update portfolio content"
   git push origin main
   ```
4. Your site will automatically update!

### **Check Your Live Site:**
- **GitHub Pages:** https://gokulsenthilkumar3.github.io/Portfolio
- **Vercel:** https://your-project-name.vercel.app
- **Netlify:** https://random-name.netlify.app

---

## 🎉 **Congratulations!**

Your ultra-efficient AI IDE portfolio is ready to be deployed and shared with the world! 🚀

Choose the hosting option that works best for you. I recommend **Vercel** for the best performance and ease of use.
