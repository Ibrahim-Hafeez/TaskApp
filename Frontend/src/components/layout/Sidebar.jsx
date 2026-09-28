import styles from "./Sidebar.module.css";

function Sidebar({ onLogout }) {
  return (
    <aside className={styles.sidebar}>
      <div>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}>✓</div>

          <div>
            <h2>TaskApp</h2>
            <span>Stay organized</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className={styles.navigation}>
          <p className={styles.sectionTitle}>WORKSPACE</p>

          <a href="/tasks" className={`${styles.navItem} ${styles.active}`}>
            <span className={styles.navIcon}>▦</span>
            <span>My Tasks</span>
          </a>
        </nav>
      </div>

      {/* Bottom section */}
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
