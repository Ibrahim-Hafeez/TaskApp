import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { logoutUser } from "../../services/logoutService";
import { clearTaskCache } from "../../services/taskService";
import styles from "./DashboardLayout.module.css";

function DashboardLayout() {
  const handleLogout = async () => {
    try {
      await logoutUser();
      clearTaskCache();
      window.location.href = "/login";
    } catch (err) {
      alert(err.message || "Logout failed");
    }
  };

  return (
    <div className={styles.layout}>
      <Sidebar onLogout={handleLogout} />

      <div className={styles.content}>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
