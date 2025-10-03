# Memory Trainer Backend API

Professional backend server for Memory Trainer game application.

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Secure password hashing with bcrypt
  - Token verification endpoints

- **User Management**
  - User registration and login
  - Profile management
  - Password change
  - Account deletion

- **Game Scores**
  - Score submission with validation
  - Global leaderboards
  - Personal score history
  - Filtering by game type and difficulty

- **Statistics**
  - Detailed user statistics
  - Global statistics
  - Periodic reports (daily, weekly, monthly)
  - User comparison
  - Activity tracking

- **Achievements**
  - 18 different achievement types
  - Automatic achievement detection
  - Progress tracking
  - Points system

- **Security**
  - Helmet for security headers
  - Rate limiting protection
  - CORS configuration
  - Input validation
  - Error handling

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet, express-rate-limit
- **Logging**: Morgan
- **Password**: bcryptjs

## Installation

```bash
# Install dependencies
pnpm install

# Create .env file
cp .env.example .env

# Edit .env file with your configuration
# Required variables:
# - MONGODB_URI
# - JWT_SECRET
# - PORT (optional)
# - NODE_ENV (optional)
```

## Running the Server

```bash
# Development mode with auto-reload
pnpm run dev

# Production mode
pnpm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify token

### Users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update user profile
- `PUT /api/users/:userId/password` - Change password
- `GET /api/users/:userId/stats` - Get user stats
- `GET /api/users/:userId/statistics` - Get detailed statistics
- `GET /api/users/:userId/achievements` - Get user achievements
- `DELETE /api/users/:userId` - Delete account

### Scores
- `POST /api/scores` - Submit game score
- `GET /api/scores/global` - Get global scores
- `GET /api/scores/user/:userId` - Get user scores

### Leaderboard
- `GET /api/leaderboard` - Main leaderboard
- `GET /api/leaderboard/top-players` - Top players by total score
- `GET /api/leaderboard/by-game/:gameType` - Leaderboard by game type
- `GET /api/leaderboard/rank/:userId` - Get user rank

### Statistics
- `GET /api/statistics/global` - Global statistics
- `GET /api/statistics/report/:period` - Periodic report (day/week/month)
- `GET /api/statistics/compare/:userId1/:userId2` - Compare two users
- `GET /api/statistics/activity/:userId` - Recent activity

### Health
- `GET /api/health` - Server health check
- `GET /` - API documentation

## Environment Variables

```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/memory_trainer
JWT_SECRET=your_super_secret_key_here
CORS_ORIGIN=http://localhost:5173
```

## Project Structure

```
server/
├── config/
│   ├── database.js       # MongoDB connection
│   ├── logger.js         # Morgan logging setup
│   └── security.js       # Helmet security config
├── middleware/
│   ├── auth.js           # Authentication middleware
│   ├── errorHandler.js   # Error handling
│   ├── rateLimiter.js    # Rate limiting
│   └── validator.js      # Input validation
├── models/
│   ├── User.js           # User model
│   └── Score.js          # Score model
├── routes/
│   ├── authRoutes.js     # Auth endpoints
│   ├── userRoutes.js     # User endpoints
│   ├── scoreRoutes.js    # Score endpoints
│   ├── leaderboardRoutes.js  # Leaderboard endpoints
│   └── statisticsRoutes.js   # Statistics endpoints
├── services/
│   ├── achievementService.js # Achievement logic
│   └── statisticsService.js  # Statistics calculations
├── logs/                 # Log files (auto-generated)
├── .env.example          # Environment template
├── index.js              # Main server file
└── package.json
```

## Database Models

### User Model
- name, email, password
- stats (gamesPlayed, totalScore, bestScores, achievements)
- createdAt, lastLogin

### Score Model
- userId (reference to User)
- gameType (memory_card, number_sequence, color_sequence)
- score, difficulty (easy, medium, hard)
- timeSpent, moves
- timestamp, date

## Achievements

18 achievement types including:
- First game, Games milestones (5, 10, 50, 100)
- Score milestones (500, 1000, 1500)
- Total score milestones (5000, 10000)
- Difficulty achievements
- Speed achievements
- Perfect game achievements
- Top player achievements

## Security Features

- **Helmet**: Security headers
- **Rate Limiting**: 
  - API: 100 requests/15min
  - Auth: 5 requests/15min
  - Scores: 10 requests/min
- **CORS**: Configured origin
- **JWT**: Token-based authentication
- **Bcrypt**: Password hashing (10 rounds)
- **Validation**: Input validation middleware

## Error Handling

- Global error handler
- Validation error messages
- JWT error handling
- MongoDB error handling
- 404 handler

## License

ISC

