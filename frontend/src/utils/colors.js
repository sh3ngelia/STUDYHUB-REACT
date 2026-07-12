export function usernameToColor(username = '') {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 65%, 50%)`;
}

export function pickRandomColor() {
  const COLORS = [
    '#6c5ce7', '#0984e3', '#00b894', '#e17055',
    '#fdcb6e', '#e84393', '#00cec9', '#a29bfe',
  ];
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}