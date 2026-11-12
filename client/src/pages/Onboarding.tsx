import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh flex-col justify-between bg-primary p-8 text-white">
      <div />

      <div>
        <h1 className="text-4xl font-bold leading-tight">Manage What To Do</h1>
        <p className="mt-3 text-white/80">
          The best way to manage what you have to do, don't forget your plans
        </p>
      </div>

      <button
        type="button"
        onClick={() => navigate('/home')}
        className="w-full rounded-full bg-white py-3.5 font-semibold text-primary"
      >
        Get Started
      </button>
    </div>
  );
}
