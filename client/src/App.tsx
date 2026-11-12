import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import SearchPage from './pages/SearchPage';
import TaskFormPage from './pages/TaskFormPage';
import Weeks from './pages/Weeks';

export default function App() {
  return (
    // the app column - full width on a phone, centered card on desktop
    <div className="mx-auto min-h-dvh max-w-md bg-page shadow-xl">
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/home" element={<Home />} />
        <Route path="/weeks" element={<Weeks />} />
        <Route path="/tasks/new" element={<TaskFormPage />} />
        <Route path="/tasks/:id" element={<TaskFormPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </div>
  );
}
