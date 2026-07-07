import './ErrorMessage.css';

export default function ErrorMessage({ message }) {
  return (
    <div className="error-box" role="alert">
      <p>{message || 'დაფიქსირდა შეცდომა'}</p>
    </div>
  );
}
