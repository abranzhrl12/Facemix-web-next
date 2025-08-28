"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/shared/lib/supabase';
import { useAuth } from '@/features/authentication/hooks/useAuth';

export default function DebugAuth() {
  const { user, session, loading, error } = useAuth();
  const [supabaseConfig, setSupabaseConfig] = useState<any>(null);

  useEffect(() => {
    const checkSupabaseConfig = async () => {
      const config = {
        isConfigured: supabase.isConfigured(),
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '***' : 'No configurado'
      };
      setSupabaseConfig(config);
    };

    checkSupabaseConfig();
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 10, 
      right: 10, 
      background: '#f0f0f0', 
      padding: '10px', 
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <h4>🔍 Debug Auth</h4>
      <div>
        <strong>Supabase Config:</strong>
        <pre>{JSON.stringify(supabaseConfig, null, 2)}</pre>
      </div>
      <div>
        <strong>Auth State:</strong>
        <ul>
          <li>Loading: {loading ? 'Sí' : 'No'}</li>
          <li>User: {user ? user.email : 'No'}</li>
          <li>Session: {session ? 'Sí' : 'No'}</li>
          <li>Error: {error ? error.message : 'No'}</li>
        </ul>
      </div>
    </div>
  );
}
