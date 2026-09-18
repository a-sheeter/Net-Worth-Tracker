Tagline
A simple, private way to track your financial progress over time.

Overview
Net Worth Tracker is a personal finance application designed to make tracking net worth simple, visual, and easy to understand. Users can record assets and liabilities, monitor changes in their net worth over time, and view their financial progress through charts and historical snapshots.

Rather than functioning as a budgeting platform or financial institution, Net Worth Tracker focuses on one core purpose: giving users a clear picture of their overall financial position and how it changes over time.

The application was built as a personal development project to strengthen my skills in React, database design, authentication, data visualization, and responsive interface development.

Features

Secure user authentication
Add and manage financial accounts
Track assets and liabilities
Calculate total net worth
Save historical net worth snapshots
View net worth changes over time
Interactive net worth history chart
Asset allocation visualization
Monthly percentage change tracking
Expandable account history
Responsive design for desktop and mobile

Technology Stack

React
Vite
Supabase
React Router
Recharts
CSS3

Data & Privacy
Net Worth Tracker uses Supabase for authentication and data storage. User financial information is associated with the authenticated user's account and protected through Supabase Row Level Security (RLS).

The application is designed so users can track their financial information without relying on a third party financial aggregation service or connecting external bank accounts.

Installation

git clone https://github.com/yourusername/Net-Worth-Tracker.git
cd Net-Worth-Tracker
npm install
npm run dev

Environment Variables

Create a .env file in the root directory and add:

VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=

License
MIT License
