import AppLayout from "./layout/AppLayout";
import styles from "./App.module.css";

function App() {
  return (
    <AppLayout>
      <h1 className={styles.heading}>App Loaded</h1>
      <p className={styles.text}>
        Mobile-first layout is ready.
      </p>
    </AppLayout>
  );
}

export default App;
