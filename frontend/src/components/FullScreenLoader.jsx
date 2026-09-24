import React from 'react';
import { Loader } from 'lucide-react';

export default function FullScreenLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#0d1117',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <Loader className="anim-spin" size={48} color="#3b82f6" />
        <span style={{ color: '#8B949E', fontSize: '16px', fontWeight: 500 }}>Loading Silver GYM...</span>
      </div>
    </div>
  );
}
