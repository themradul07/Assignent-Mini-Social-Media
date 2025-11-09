
import './App.css'
import React, { useState } from 'react';

import Feed from './pages/Feed';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthForm from './components/AuthForm';

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  function handleLogin(data){
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }
  function handleLogout(){
    localStorage.removeItem('token'); localStorage.removeItem('user');
    setToken(''); setUser(null);
  }

  if(!token) {
    return (
      <div className="container">
       
        <div className="auth-row">
          <AuthForm onLogin={handleLogin} />          
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <div>
          <span style={{marginRight:12 , fontSize:"28px"}}>Hello, {user?.name}</span>
          <button onClick={handleLogout} className="btn">Logout</button>
        </div>
      </header>
        <h2 style={{width:"100%" , margin:"auto", textAlign:"center"}}>Social Feed</h2>
      <Feed token={token} />
    </div>
  );
}
