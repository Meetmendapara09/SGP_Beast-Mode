# SyncroSpace - 2D Virtual Collaborative Workspace

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/Meetmendapara09/SGP_Beast-Mode)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black.svg)](https://nextjs.org/)

## 🌟 Overview

SyncroSpace is a revolutionary 2D virtual collaborative workspace that transforms remote team collaboration. Step into a pixel-art virtual office where teams can interact naturally through spatial audio, real-time chat, collaborative whiteboards, and AI-powered conversation starters.

### ✨ Key Features

- **🌍 2D Virtual World**: Navigate through a pixel-art office environment with your avatar
- **🎵 Spatial Audio**: Hear colleagues based on proximity for natural conversations
- **💬 Real-time Chat**: Text messaging with direct messages and team channels
- **🎥 Video Meetings**: Integrated video calls with screen sharing via Jitsi Meet
- **📝 Collaborative Whiteboards**: Real-time collaborative drawing and brainstorming
- **📋 Kanban Task Management**: Organize and track work with drag-and-drop boards
- **📊 Analytics Dashboard**: Track team engagement and productivity (Admin)
- **🔐 Secure Authentication**: Role-based access control with Supabase Auth
- **🎯 AI-Powered Features**: Smart conversation starters and chat summarization
- **📱 Responsive Design**: Works seamlessly across desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20.x or later
- **npm** or **yarn** package manager
- **Supabase Account** for backend services
- **Google AI API Key** for AI features (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Meetmendapara09/SGP_Beast-Mode.git
   cd SGP_Beast-Mode
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Google AI (Optional - for AI features)
   GOOGLE_GENAI_API_KEY=your_google_ai_api_key
   
   # Application Settings
   NEXT_PUBLIC_APP_URL=http://localhost:9002
   ```

4. **Database Setup**
   
   Run the SQL schema in your Supabase dashboard:
   ```bash
   # The SQL_SCHEMA.sql file contains all necessary tables and security policies
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:9002`

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages (login, signup)
│   ├── dashboard/         # Main dashboard
│   ├── world/             # 2D virtual world
│   ├── chat/              # Real-time messaging
│   ├── whiteboard/        # Collaborative drawing
│   ├── meetings/          # Video conferencing
│   ├── kanban/            # Task management
│   ├── admin/             # Admin panel
│   └── api/               # API routes
├── components/            # Reusable React components
│   ├── ui/                # Base UI components
│   ├── auth/              # Authentication components
│   ├── world/             # Virtual world components
│   ├── chat/              # Chat components
│   └── admin/             # Admin components
├── lib/                   # Utility libraries
│   ├── supabase/          # Database client
│   └── utils.ts           # Helper functions
├── hooks/                 # Custom React hooks
├── services/              # External service integrations
└── models/                # TypeScript type definitions
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

- **Unit Tests**: Individual component testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Complete user flow testing

Test files are located alongside their corresponding components in `__tests__` directories.

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint code linting
- `npm run typecheck` - Run TypeScript type checking
- `npm test` - Run test suite

### Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Game Engine**: Phaser.js for 2D world
- **Video Calls**: Jitsi Meet integration
- **Testing**: Jest, React Testing Library
- **State Management**: React Context + Custom hooks
- **AI Features**: Google Generative AI

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `SQL_SCHEMA.sql`
3. Configure Row Level Security (RLS) policies
4. Set up authentication providers as needed

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ |
| `GOOGLE_GENAI_API_KEY` | Google AI API key | ⚠️ Optional |
| `NEXT_PUBLIC_APP_URL` | Application base URL | ✅ |

## 🔒 Security & Privacy

### Data Protection

- **Encryption**: All data is encrypted in transit and at rest
- **Authentication**: Secure JWT-based authentication with Supabase
- **Authorization**: Role-based access control (Admin, TeamMember)
- **Privacy**: No sensitive data is logged or exposed to clients
- **GDPR Compliance**: User data can be exported/deleted on request

### Security Measures

- Row Level Security (RLS) on all database tables
- Input validation using Zod schemas
- XSS protection with Content Security Policy
- CSRF protection via SameSite cookies
- Secure API endpoints with proper authentication

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Ensure responsive design
- Maintain accessibility standards

## 📖 API Documentation

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout

### Core Features

- `GET /api/world/users` - Get online users in world
- `POST /api/world/update-position` - Update avatar position
- `GET /api/chat/messages` - Get chat messages
- `POST /api/whiteboard/[id]` - Update whiteboard content

## 🐛 Troubleshooting

### Common Issues

**Build fails with Supabase errors:**
- Ensure all environment variables are set correctly
- Check Supabase project is active and accessible

**Tests fail to run:**
- Make sure `ts-node` is installed: `npm install ts-node --save-dev`
- Verify Jest configuration in `jest.config.ts`

**2D World not loading:**
- Check browser console for Phaser.js errors
- Ensure WebGL is supported in your browser

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- 📧 Email: support@syncrospace.com
- 💬 GitHub Issues: [Create an issue](https://github.com/Meetmendapara09/SGP_Beast-Mode/issues)
- 📖 Documentation: [docs.syncrospace.com](https://docs.syncrospace.com)

---

**Built with ❤️ by the SyncroSpace Team**