<p><strong>Tagline</strong><p>
A simple, private way to track your financial progress over time.

<p><strong>Overview</strong><p>
Net Worth Tracker is a personal finance application designed to make tracking net worth simple, visual, and easy to understand. Users can record assets and liabilities, monitor changes in their net worth over time, and view their financial progress through charts and historical snapshots.

Rather than functioning as a budgeting platform or financial institution, Net Worth Tracker focuses on one core purpose: giving users a clear picture of their overall financial position and how it changes over time.

The application was built as a personal development project to strengthen my skills in React, database design, authentication, data visualization, and responsive interface development.

<p><strong>Features</strong><p>

<ul>
<li>Secure user authentication</li>
<li>Add and manage financial accounts</li>
<li>Track assets and liabilities</li>
<li>Calculate total net worth</li>
<li>Save historical net worth snapshots</li>
<li>View net worth changes over time</li>
<li>Interactive net worth history chart</li>
<li>Asset allocation visualization</li>
<li>Monthly percentage change tracking</li>
<li>Expandable account history</li>
<li>Responsive design for desktop and mobile</li>
</ul>

<p><strong>Technology Stack</strong><p>

<ul>
<li>React</li>
<li>Vite</li>
<li>Supabase</li>
<li>React Router</li>
<li>Recharts</li>
<li>CSS3</li>
</ul>

<p><strong>Data & Privacy</strong><p>
Net Worth Tracker uses Supabase for authentication and data storage. User financial information is associated with the authenticated user's account and protected through Supabase Row Level Security (RLS).

The application is designed so users can track their financial information without relying on a third party financial aggregation service or connecting external bank accounts.

<p><strong>Installation</strong><p>

git clone https://github.com/yourusername/Net-Worth-Tracker.git<br>
cd Net-Worth-Tracker<br>
npm install<br>
npm run dev

<p><strong>Environment Variables</strong><p>

Create a .env file in the root directory and add:

VITE_SUPABASE_URL=<br>
VITE_SUPABASE_PUBLISHABLE_KEY=

<p><strong>License</strong><p>
MIT License
