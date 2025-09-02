# Quick Embedder

A minimal Next.js app that allows you to upload HTML files to Supabase and get embeddable links for presentations (perfect for Pitch, Google Slides, etc.).

## Features

- 🚀 **Simple Upload**: Drag & drop or browse to upload `.html` files
- 🔗 **Embeddable Links**: Get clean, trustworthy links served from your domain
- 📱 **Responsive Design**: Works on all devices with shadcn/ui components
- 🗑️ **File Management**: Delete files with one click
- 📋 **Copy Links**: Easy one-click link copying
- 🎯 **Presentation Ready**: Perfect for embedding in Pitch, Google Slides, etc.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Database & Storage**: Supabase
- **Deployment**: Vercel

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo>
cd quick-embedder
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase-setup.sql`
3. Copy your project URL and anon key from **Settings > API**

### 3. Environment Variables

Create `.env.local` based on `.env.local.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # Change for production
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
4. Update `NEXT_PUBLIC_BASE_URL` to your Vercel domain
5. Deploy!

## How It Works

1. **Upload**: Users upload HTML files through a clean interface
2. **Storage**: Files are stored in Supabase Storage with metadata in database
3. **Serving**: Files are served through `/view/[id]` route with your domain
4. **Embedding**: Clean URLs can be embedded in presentations

## File Structure

```
├── app/
│   ├── api/
│   │   ├── upload/route.ts      # Upload endpoint
│   │   └── files/
│   │       ├── route.ts         # List files
│   │       └── [id]/route.ts    # Delete file
│   ├── view/[id]/page.tsx       # Serve HTML files
│   ├── page.tsx                 # Home page
│   └── layout.tsx              # Root layout
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── upload-form.tsx         # Upload component
│   └── files-list.tsx          # File list component
└── lib/
    ├── supabase.ts            # Supabase client
    └── utils.ts               # Utilities
```

## Security & Limits

- **File Types**: Only `.html` files accepted
- **File Size**: 5MB limit per file
- **No Auth**: Currently open for simplicity (consider adding auth for production)
- **Public Storage**: Files are publicly accessible (by design for embedding)

## Usage Example

1. Visit your deployed app
2. Upload `dashboard.html`
3. Copy the generated link: `https://your-app.vercel.app/view/abc123`
4. Paste into Pitch/Google Slides as an embedded link
5. Your HTML renders cleanly in the presentation!

## Contributing

Feel free to open issues or submit pull requests to improve the app!

## License

MIT License - feel free to use this for your projects.