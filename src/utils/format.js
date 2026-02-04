export const todayStr = () => new Date().toISOString().slice(0, 10);

export const yesterdayStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

export const round2 = (n) => Math.round(n * 100) / 100;

export const fmt = (n) => `₹${round2(n).toFixed(2)}`;
