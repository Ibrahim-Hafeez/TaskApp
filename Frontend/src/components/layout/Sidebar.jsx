import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

function Sidebar({ onLogout }) {
  return (
    <aside className={styles.sidebar}>
      <div>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>✓</div>

          <div>
            <h2>TaskApp</h2>
            <span>Your daily workspace</span>
          </div>
        </div>

        <nav className={styles.navigation}>
          {/* Overview */}

          <p className={styles.sectionTitle}>OVERVIEW</p>

          <NavLink
            to="/today"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }
          >
            <span className={styles.navIcon}>⌂</span>
            <span>Today</span>
          </NavLink>

          {/* Work */}

          <p className={styles.sectionTitle}>WORK</p>

          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }
          >
            <span className={styles.navIcon}>▦</span>
            <span>My Tasks</span>
          </NavLink>

          <div className={styles.navItem}>
            <span className={styles.navIcon}>▣</span>
            <span>Projects</span>
          </div>

          {/* Productivity */}

          <p className={styles.sectionTitle}>PRODUCTIVITY</p>

          <div className={styles.navItem}>
            <span className={styles.navIcon}>🎯</span>
            <span>Focus</span>
          </div>

          <div className={styles.navItem}>
            <span className={styles.navIcon}>🔥</span>
            <span>Habits</span>
          </div>

          {/* Insights */}

          <p className={styles.sectionTitle}>INSIGHTS</p>

          <div className={styles.navItem}>
            <span className={styles.navIcon}>◈</span>
            <span>Insights</span>
          </div>
        </nav>
      </div>

      {/* Account */}

      <div className={styles.bottomSection}>
        <div className={styles.userCard}>
          <div className={styles.avatar}>U</div>

          <div className={styles.userInfo}>
            <strong>User</strong>
            <span>Personal workspace</span>
          </div>
        </div>

        <button onClick={onLogout} className={styles.logoutButton}>
          <span>↪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
