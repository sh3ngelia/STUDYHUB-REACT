import './Loader.css';

export default function Loader({ label = 'იტვირთება...' }) {
  return (
    <div className="loader-box" role="status">
      <div className="loader-spinner" />
      <p>{label}</p>
    </div>
  );
}
