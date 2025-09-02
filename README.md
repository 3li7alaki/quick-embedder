# Quick Embedder

A modern Next.js application that allows you to upload HTML files to Supabase and get embeddable links for presentations (perfect for Pitch, Google Slides, etc.).

## ✨ Features

- 🚀 **Drag & Drop Upload**: Beautiful upload interface with drag-and-drop support
- 🔗 **Instant Embeddable Links**: Get clean, trustworthy links served from your domain
- ✏️ **Filename Editing**: Click to rename files inline with real-time updates
- 📜 **Scrollable File List**: Efficiently browse through your uploaded files
- 📋 **Smart Copy Links**: One-click copying with visual feedback
- 🔔 **Toast Notifications**: Real-time feedback using Sonner for all actions
- 🎨 **Modern Design**: Clean SaaS-style interface with greenish-blue gradients
- 📱 **Fully Responsive**: Works beautifully on all devices
- 🗑️ **File Management**: Easy file deletion with confirmation
- 🎯 **Presentation Ready**: Perfect for embedding in Pitch, Google Slides, PowerPoint, etc.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Database & Storage**: Supabase
- **Notifications**: Sonner toast library
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 🚀 Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo>
cd quick-embedder
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase-setup.sql`
3. Create a storage bucket named `html-files` in **Storage**
4. Make the bucket public for file serving
5. Copy your project URL and anon key from **Settings > API**

### 3. Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app!

### 5. Deploy to Vercel

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## 📖 How It Works

1. **Upload**: Users upload HTML files through a beautiful drag-and-drop interface
2. **Storage**: Files are stored in Supabase Storage with metadata in PostgreSQL database
3. **Management**: Files can be renamed, copied, and deleted with real-time feedback
4. **Serving**: Files are served through `/view/[id]` route with your domain
5. **Embedding**: Clean URLs can be embedded anywhere presentations are needed

## 📁 File Structure

```
├── app/
│   ├── api/
│   │   ├── upload/route.ts              # Upload endpoint
│   │   └── files/
│   │       ├── route.ts                 # List files
│   │       └── [id]/
│   │           ├── route.ts             # Delete file
│   │           └── rename/route.ts      # Rename file
│   ├── view/[id]/page.tsx               # Serve HTML files
│   ├── page.tsx                         # Home page with modern UI
│   ├── layout.tsx                       # Root layout with Sonner
│   └── globals.css                      # Tailwind CSS v4 styles
├── components/
│   ├── ui/                              # shadcn/ui components
│   ├── upload-form.tsx                  # Modern upload component
│   └── files-list.tsx                   # File management component
├── lib/
│   ├── supabase.ts                      # Supabase client
│   └── utils.ts                         # Utility functions
├── tailwind.config.ts                   # Tailwind CSS v4 config
└── postcss.config.mjs                   # PostCSS with @tailwindcss/postcss
```

## 🔧 API Endpoints

- `POST /api/upload` - Upload new HTML file
- `GET /api/files` - List all uploaded files
- `DELETE /api/files/[id]` - Delete specific file
- `PUT /api/files/[id]/rename` - Rename specific file
- `GET /view/[id]` - Serve HTML file content

## 🔒 Security & Limits

- **File Types**: Only `.html` files accepted
- **File Size**: Configurable limit (default: reasonable size for HTML files)
- **Public Access**: Files are publicly accessible by design for embedding
- **No Authentication**: Currently open for simplicity (consider adding auth for production)
- **Input Validation**: Proper validation on all API endpoints

## 💡 Usage Example

1. Visit your deployed app
2. Drag and drop `my-dashboard.html` or click to browse
3. Optionally rename the file by clicking the edit icon
4. Copy the generated link: `https://your-app.vercel.app/view/abc123`
5. Paste into Pitch/Google Slides as an embedded iframe
6. Your interactive HTML content renders perfectly in the presentation!

## 🎨 Design Features

- **Modern SaaS Interface**: Clean, professional design
- **Greenish-Blue Gradients**: Beautiful color scheme throughout
- **Interactive Elements**: Hover effects, smooth transitions
- **Toast Notifications**: Real-time feedback for all user actions
- **Responsive Layout**: Mobile-first design that works everywhere
- **Accessibility**: Proper contrast, focus states, and semantic HTML

## 🤝 Contributing

Feel free to open issues or submit pull requests to improve the app! Some ideas:

- User authentication and private files
- File organization with folders
- Batch operations
- Analytics and usage tracking
- Custom domains

## 📄 License

MIT License - feel free to use this for your projects.

---

Built with ❤️ for creators who need to embed interactive HTML content in presentations.