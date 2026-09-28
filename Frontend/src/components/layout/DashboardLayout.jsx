import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { logoutUser } from "../../services/logoutService";
import styles from "./DashboardLayout.module.css";

function DashboardLayout() {
  const handleLogout = async () => {
    try {
      await logoutUser();
      window.location.href = "/login";
    } catch (err) {
      alert(err.message || "Logout failed");
    }
  };

  return (
    <div className={styles.layout}>
      <Sidebar onLogout={handleLogout} />

      <div className={styles.content}>
        <div className={styles.pageTransition}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
