import PhotoGallery from './components/PhotoGallery';
import './App.css';

export default function App() {
  return (
    <>
      <div className="app-container">
        <div className="content-wrapper">
          <header className="app-header">
            <h1 className="app-title">Adaptive photo grid</h1>
          </header>
          <main>
            <PhotoGallery />
          </main>
        </div>
      </div>
    </>
  );
}
