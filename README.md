# Calmly SignsEtu 🔕

A comprehensive quiet hours management application built with Next.js, featuring automated email reminders and user-friendly scheduling interface.

## 🌟 Features

- **📅 Smart Scheduling**: Create and manage quiet hour blocks with intuitive date/time selection
- **📧 Automated Reminders**: Get email notifications 10 minutes before your quiet hours begin
- **🔐 Secure Authentication**: Integrated with Clerk for seamless user authentication
- **🚫 Overlap Prevention**: Built-in database constraints prevent conflicting time blocks
- **🕐 IST Support**: All times are handled in Indian Standard Time (IST)
- **✨ Modern UI**: Clean, responsive interface built with shadcn/ui components
- **⚡ Real-time Updates**: Instant feedback and updates using React state management
- **🔄 CRUD Operations**: Full create, read, update, delete functionality for quiet hours
- **📱 Mobile Responsive**: Works seamlessly on desktop and mobile devices

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: Clerk
- **Database**: PostgreSQL (Neon)
- **Email Service**: Resend
- **Deployment**: Vercel-ready
- **Cron Jobs**: Built-in API routes for automated reminders

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 18 or higher)
- npm or pnpm
- Git

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Shubhkesarwani02/calmly-signsetu.git
cd calmly-signsetu
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
# or
pnpm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=your_neon_database_url
POSTGRES_URL=your_postgres_url

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key

# Optional: Additional Neon configurations
NEON_PROJECT_ID=your_neon_project_id
```

### 4. Database Setup

The application will automatically create the required database schema. You can verify the connection:

```bash
npm run test-db
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🗄️ Database Schema

The application uses a PostgreSQL database with the following main table:

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

## 📧 Email Notifications

The application sends automated email reminders using the Resend service:

- **Timing**: Reminders are sent 10 minutes before the scheduled quiet hour
- **Frequency**: Cron job runs every 5 minutes to check for upcoming sessions
- **Content**: Professional HTML email templates with session details
- **Timezone**: All times displayed in Indian Standard Time (IST)

## 🔐 Authentication

User authentication is handled by Clerk, providing:

- **Social Login**: Multiple authentication providers
- **User Management**: Complete user profile management
- **Session Management**: Secure session handling
- **Authorization**: Protected routes and API endpoints

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on every push to main branch

### Environment Variables for Production

Ensure all environment variables are properly configured in your deployment platform:

- Database URLs (Neon PostgreSQL)
- Clerk authentication keys
- Resend API key for email service

## 📚 API Endpoints

### Quiet Hours Management
- `GET /api/quiet-hours` - Fetch user's quiet hours
- `POST /api/quiet-hours` - Create new quiet hour block
- `PUT /api/quiet-hours/[id]` - Update existing quiet hour
- `DELETE /api/quiet-hours/[id]` - Delete quiet hour block

### Utilities
- `POST /api/test-email` - Send test email
- `POST /api/cron/check-reminders` - Manual trigger for reminder check

## 🕐 Timezone Configuration

The application is configured to work with Indian Standard Time (IST):

- All timestamps are stored in UTC in the database
- Frontend displays times in IST (UTC+5:30)
- Email notifications show times in IST format
- Cron jobs consider IST for reminder calculations

## 🧪 Testing

### Database Connection
```bash
npm run test-db
```

### Configuration Verification
```bash
npm run verify-config
```

### Manual Email Test
Use the test email API endpoint to verify email functionality.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Shubhkesarwani02/calmly-signsetu/issues) page
2. Create a new issue with detailed information
3. Contact the maintainer

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Authentication by [Clerk](https://clerk.com/)
- Database hosting by [Neon](https://neon.tech/)
- Email service by [Resend](https://resend.com/)

## 📊 Project Status

- ✅ Core functionality complete
- ✅ Authentication integrated
- ✅ Database schema optimized
- ✅ Email notifications working
- ✅ IST timezone support
- ✅ Production ready

---

**Made with ❤️ for better time management and productivity**