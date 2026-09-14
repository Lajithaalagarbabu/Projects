import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Camera, LogOut, LayoutDashboard, Calendar, Users, Image as ImageIcon } from 'lucide-react';

export const Navbar = () => {
  const { user, logoutUser, isAdmin, isTeamMember } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={isAdmin ? '/admin/dashboard' : '/team/dashboard'} className="navbar-brand">
          <div className="navbar-brand-icon">
            <Camera size={20} />
          </div>
          <span>LuminaShare</span>
        </Link>

        <ul className="navbar-links">
          {isAdmin && (
            <>
              <li>
                <Link to="/admin/dashboard" className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}>
                  <LayoutDashboard size={17} />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/events" className={`nav-link ${isActive('/admin/events') ? 'active' : ''}`}>
                  <Calendar size={17} />
                  <span>Events</span>
                </Link>
              </li>
            </>
          )}

          {isTeamMember && (
            <>
              <li>
                <Link to="/team/dashboard" className={`nav-link ${isActive('/team/dashboard') ? 'active' : ''}`}>
                  <LayoutDashboard size={17} />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/team/photos" className={`nav-link ${isActive('/team/photos') ? 'active' : ''}`}>
                  <ImageIcon size={17} />
                  <span>My Photos</span>
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="user-profile">
          <div className="user-avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {user.name}
            </span>
            <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-team'}`} style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem', alignSelf: 'flex-start' }}>
              {user.role}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-secondary btn-sm"
            title="Logout"
            style={{ marginLeft: '0.75rem' }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
