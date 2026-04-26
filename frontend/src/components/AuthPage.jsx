import React, { useState } from 'react';

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const res = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await (isLogin ? res.json() : res.text());
      
      if (!res.ok) {
        throw new Error(data.error || data || 'Authentication failed');
      }

      if (isLogin) {
        onLogin(data.token);
      } else {
        setIsLogin(true); // switch to login after successful register
        alert('Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <div style={{ background: 'var(--bg-secondary)', padding: '3rem', borderRadius: '15px', width: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', justifyContent: 'center'}}>
          <div className="logo-icon">H</div>
          <h2 style={{ margin: 0 }}>HealthSync</h2>
        </div>
        
        <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h3>
        
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input type="email" placeholder="Email Address" value={email} onChange={e=>setEmail(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
          <button type="submit" className="btn-primary" style={{ padding: '12px', marginTop: '10px' }}>
            {isLogin ? 'Log In' : 'Register'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign up' : 'Log in'}
          </span>
        </p>
      </div>
    </div>
  );
}
