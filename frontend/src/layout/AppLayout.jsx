import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import styles from "./AppLayout.module.css";

function AppLayout({ children }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className={styles.wrapper}>
      {/* Top Bar */}
      <header className={styles.topbar}>
        {/* Brand */}
        <Link to="/" className={styles.brand}>
          <div className={styles.brandText}>
            <span className={styles.brandTop}>PROP</span>
            <span className={styles.brandDot}>◦</span>
            <span className={styles.brandBottom}>CHAINS</span>
          </div>
        </Link>

        {/* Actions */}
        <div className={styles.actions}>
          <button onClick={toggleTheme} className={styles.linkBtn}>
            {theme === "light" ? "Dark" : "Light"}
          </button>

          {!token ? (
            <>
              <Link to="/login" className={styles.linkBtn}>
                Login
              </Link>
              <Link to="/register" className={styles.linkBtn}>
                Register
              </Link>
            </>
          ) : (
            <>
              <span className={styles.username}>
                {user?.name}
              </span>
              <button onClick={handleLogout} className={styles.linkBtn}>
                Logout
              </button>
            </>
          )}
        </div>
      </header>

      {/* Page Content */}
      <main className={styles.container}>{children}</main>
    </div>
  );
}

export default AppLayout;
