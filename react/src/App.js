import ErrorBoundary from './ErrorBoundary';
import './App.css';
import Home from './pages/Home';

function App() {
  return (
    <ErrorBoundary>
      <div data-easytag="id1-src/App.js" className="min-h-screen w-full flex items-center justify-center">
        <Home />
      </div>
    </ErrorBoundary>
  );
}

export default App;
