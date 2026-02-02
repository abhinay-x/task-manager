import React, { useState, useEffect } from 'react';
import { getMe, updateMe, getTasks } from '../services/api';

const Profile = () => {
  const [user, setUser] = useState({ name: '', email: '' });
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState({ error: '', success: '' });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, completed: 0, active: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  const computeStats = (tasks = []) => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === 'Completed').length;
    const active = total - completed;
    setStats({ total, completed, active });
    setStatsLoading(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const [userRes, taskRes] = await Promise.all([getMe(), getTasks()]);
        setUser(userRes.data);
        setFormData({ name: userRes.data.name, email: userRes.data.email });
        computeStats(taskRes.data);
      } catch (err) {
        setStatus((prev) => ({ ...prev, error: err.response?.data?.message || 'Failed to fetch profile' }));
        setStatsLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleTasksUpdated = (event) => {
      computeStats(event.detail || []);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('tasks:updated', handleTasksUpdated);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('tasks:updated', handleTasksUpdated);
      }
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatus({ error: '', success: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await updateMe(formData);
      setUser(data);
      setFormData({ name: data.name, email: data.email });

      const storedInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      localStorage.setItem('userInfo', JSON.stringify({ ...storedInfo, ...data }));

      setStatus({ error: '', success: 'Profile updated successfully' });
    } catch (err) {
      setStatus({ error: err.response?.data?.message || 'Failed to update profile', success: '' });
    } finally {
      setLoading(false);
    }
  };

  const userInitials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  return (
    <div className="glass-card p-6 h-full animate-slide-up">
      {/* Header with Avatar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 transform hover:scale-105 transition-transform duration-300">
          <span className="text-white text-xl font-bold">{userInitials}</span>
        </div>
        <div>
          <h2 className="text-xl font-bold gradient-text">Profile</h2>
          <p className="text-gray-400 text-sm">Manage your account</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[{
          label: 'Total',
          value: stats.total,
          accent: 'text-primary',
        }, {
          label: 'Done',
          value: stats.completed,
          accent: 'text-emerald-400',
        }, {
          label: 'Active',
          value: stats.active,
          accent: 'text-yellow-400',
        }].map(({ label, value, accent }) => (
          <div key={label} className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
            <p className={`text-2xl font-bold ${statsLoading ? 'text-muted' : accent}`}>
              {statsLoading ? '—' : value}
            </p>
            <p className="text-xs text-muted">{label}</p>
          </div>
        ))}
      </div>

      {/* Messages */}
      {status.error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg animate-slide-up">
          <p className="text-red-400 text-sm text-center">{status.error}</p>
        </div>
      )}
      {status.success && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg animate-slide-up">
          <p className="text-green-400 text-sm text-center">{status.success}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="field" data-filled={Boolean(formData.name)}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input-glass"
            placeholder=" "
            required
          />
          <label className="floating-label">Full Name</label>
        </div>

        <div className="field" data-filled={Boolean(formData.email)}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-glass"
            placeholder=" "
            required
          />
          <label className="floating-label">Email Address</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Save Changes</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Profile;
