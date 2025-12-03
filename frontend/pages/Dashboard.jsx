// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await api.get('/schemes');
        setSchemes(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSchemes();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Welcome, {user?.name}</h2>
      <h3>Available Schemes</h3>
      <ul>
        {schemes.map((s) => (
          <li key={s._id}>
            <strong>{s.title}</strong> – {s.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
