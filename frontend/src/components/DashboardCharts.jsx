import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

export default function DashboardCharts({ patients, appointments }) {
  // Mock data derivation for charts
  const ageData = [
    { name: '0-18', count: patients.filter(p => p.age <= 18).length },
    { name: '19-35', count: patients.filter(p => p.age > 18 && p.age <= 35).length },
    { name: '36-50', count: patients.filter(p => p.age > 35 && p.age <= 50).length },
    { name: '51+', count: patients.filter(p => p.age > 50).length },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
      <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '15px' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Patient Age Demographics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ageData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{ background: '#222', border: 'none', borderRadius: '8px' }} />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
