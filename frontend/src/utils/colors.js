const COLORS = ['#6c5ce7', '#00b894', '#fdcb6e', '#e17055', '#0984e3'];

export function pickRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}
