// react
import { useState, useEffect } from 'react';

// router
import { Routes, Route } from "react-router-dom";

// supabase
import { supabase } from "./utils/supabase";

// auth
import Register from './auth/Register';
import Login from './auth/Login';
import ProtectedRoute from "./auth/ProtectedRoute";
import PublicRoute from "./auth/PublicRoute";

// pages
import Index from './pages/Index';
import Accounts from './pages/Accounts';
import AccountHistory from './pages/AccountHistory';
import Assets from './pages/Assets';
import Liabilities from './pages/Liabilities';
import UpdateNetworth from './pages/UpdateNetworth';
import NetworthHistory from './pages/NetworthHistory';

// forms
import AccountForm from './pages/AccountForm';

// styles
import './App.css'

export default function App() {
  /* --- Auth State --- */
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* --- Effects --- */
  useEffect(() => {
    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
      setLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>
  }

  /* --- Render --- */
  return (
    <>
      <Routes>

        {/* Public Routes */}
        <Route path="/register"
          element={
            <PublicRoute user={user}>
              <Register />
            </PublicRoute>
          }
        />
        <Route path="/login"
          element={
            <PublicRoute user={user}>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route path="/"
          element={
            <ProtectedRoute user={user}>
              <Index />
            </ProtectedRoute>
          }
        />
        <Route path="/account-form"
          element={
            <ProtectedRoute user={user}>
              <AccountForm />
            </ProtectedRoute>
          }
        />
        <Route path="/account-form/:id/edit"
          element={
            <ProtectedRoute user={user}>
              <AccountForm />
            </ProtectedRoute>
          }
        />
        <Route path="/accounts"
          element={
            <ProtectedRoute user={user}>
              <Accounts />
            </ProtectedRoute>
          }
        />
        <Route path="account/:accountId/history"
          element={
            <ProtectedRoute user={user}>
              <AccountHistory/>
            </ProtectedRoute>
          }
          />
        <Route path="/assets"
          element={
            <ProtectedRoute user={user}>
              <Assets />
            </ProtectedRoute>
          }
        />
        <Route path="/liabilities"
          element={
            <ProtectedRoute user={user}>
              <Liabilities />
            </ProtectedRoute>
          }
        />
        <Route path="/update-networth"
          element={
            <ProtectedRoute user={user}>
              <UpdateNetworth />
            </ProtectedRoute>
          }
        />
        <Route path="/networth-history"
          element={
            <ProtectedRoute user={user}>
              <NetworthHistory />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}
