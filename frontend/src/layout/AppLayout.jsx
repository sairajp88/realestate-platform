import styles from "./AppLayout.module.css";

function AppLayout({ children }) {
  return (
    <div className={styles.wrapper}>
      <main className={styles.container}>
        {children}
      </main>
    </div>
  );
}

export default AppLayout;
