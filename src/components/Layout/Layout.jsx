import styles from './Layout.module.css';

export default function Layout({ children, sidebar }) {
  return (
    <div className={styles.layout}>
      <main className={styles.main}>{children}</main>
      {sidebar && <aside className={styles.sidebar}>{sidebar}</aside>}
    </div>
  );
}
