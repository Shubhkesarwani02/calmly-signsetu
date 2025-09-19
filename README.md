# Calmly SignsEtu

> **Professional quiet hours management system with intelligent scheduling and automated notifications**

A modern web application designed to optimize productivity through structured quiet time management. Built with Next.js and featuring real-time scheduling, automated email reminders, and comprehensive time zone support for Indian Standard Time.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791)](https://neon.tech/)

## 🎯 Key Features

- **Smart Scheduling** - Intuitive date/time selection with overlap prevention
- **Automated Notifications** - Email reminders 10 minutes before scheduled sessions
- **IST Time Zone Support** - All operations in Indian Standard Time (UTC+5:30)
- **Secure Authentication** - Clerk-powered user management and session handling
- **Real-time Updates** - Instant UI feedback with optimistic updates
- **Mobile Responsive** - Seamless experience across all devices
- **Professional UI** - Built with shadcn/ui components and Tailwind CSS

## � Technology Stack

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Authentication** | Clerk |
| **Database** | PostgreSQL (Neon) |
| **Email** | Resend API |
| **Deployment** | Vercel |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Git
- npm/pnpm

### Installation

1. **Clone and setup**
   ```bash
   git clone https://github.com/Shubhkesarwani02/calmly-signsetu.git
   cd calmly-signsetu
   npm install --legacy-peer-deps
   ```

2. **Environment configuration**
   
   Create `.env.local` with your credentials:
   ```env
   # Database
   DATABASE_URL=your_neon_database_url
   
   # Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # Email Service
   RESEND_API_KEY=your_resend_api_key
   ```

3. **Database setup & verification**
   ```bash
   npm run test-db
   npm run final-check
   ```

4. **Start development**
   ```bash
   npm run dev
   ```
   
   → Application available at `http://localhost:3000`

## � Core Architecture

### Database Schema
```sql
CREATE TABLE quiet_hours (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  email VARCHAR(255) NOT NULL,
  notification_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/quiet-hours` | Fetch user's scheduled blocks |
| `POST` | `/api/quiet-hours` | Create new quiet hour block |
| `PUT` | `/api/quiet-hours/[id]` | Update existing block |
| `DELETE` | `/api/quiet-hours/[id]` | Remove block |
| `POST` | `/api/cron/check-reminders` | Trigger reminder check |
| `POST` | `/api/test-email` | Send test notification |

### Notification System
- **Trigger**: 5-10 minutes before scheduled time
- **Frequency**: Cron job every 5 minutes
- **Format**: Professional HTML email templates
- **Timezone**: All times displayed in IST (UTC+5:30)

## ⚙️ Development

### Available Scripts
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint check
npm run test-db      # Database connection test
npm run test-ist     # Timezone functionality test
npm run final-check  # Pre-deployment verification
```

### Testing & Verification
- **Database**: `npm run test-db` - Verifies connection and schema
- **Configuration**: `npm run final-check` - Complete environment check
- **Timezone**: `npm run test-ist` - IST functionality validation

## 🚀 Deployment

### Production Deployment (Vercel)
1. Push to GitHub repository
2. Import project in Vercel dashboard
3. Configure environment variables
4. Auto-deploy on every commit to `main`

### Environment Variables (Production)
Ensure these are configured in your deployment platform:
- `DATABASE_URL` - Neon PostgreSQL connection
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY` - Authentication
- `RESEND_API_KEY` - Email notifications

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/enhancement`)
3. **Commit** changes (`git commit -m 'Add enhancement'`)
4. **Push** to branch (`git push origin feature/enhancement`)
5. **Open** a Pull Request

## � License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

## 🔗 Links & Resources

- **Live Demo**: [Deploy to see live version]
- **GitHub**: [Shubhkesarwani02/calmly-signsetu](https://github.com/Shubhkesarwani02/calmly-signsetu)
- **Issues**: [Report bugs or request features](https://github.com/Shubhkesarwani02/calmly-signsetu/issues)

## 🙏 Acknowledgments

Built with modern technologies and services:
- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Clerk](https://clerk.com/) - Authentication
- [Neon](https://neon.tech/) - PostgreSQL hosting
- [Resend](https://resend.com/) - Email delivery

---

<div align="center">

**Made with ❤️ for enhanced productivity and focus management**

*Calmly SignsEtu - Where productivity meets tranquility*

</div>