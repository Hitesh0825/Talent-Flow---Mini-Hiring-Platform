import { NavLink, Outlet } from 'react-router-dom';
import './Layout.css';

export default function Layout() {
  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <h1>TalentFlow</h1>
          </div>
          <div className="nav-links">
            <NavLink to="/jobs" className={({ isActive }) => isActive ? 'active' : ''}>
              Jobs
            </NavLink>
            <NavLink to="/candidates" className={({ isActive }) => isActive ? 'active' : ''}>
              Candidates
            </NavLink>
            <NavLink to="/assessments" className={({ isActive }) => isActive ? 'active' : ''}>
              Assessments
            </NavLink>
          </div>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

