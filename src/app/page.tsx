import TodoList from '../components/TodoList';

export default function Home() {
  return (
    <main className="main">
      <div className="container">
        <header className="header">
          <h1 className="header__title">📝 Todo App</h1>
          <p className="header__subtitle">Stay organized and get things done</p>
        </header>
        <TodoList />
      </div>
    </main>
  );
}
