export const formatTimeOnly = (d: Date): string => {
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `0000-00-00T${hh}:${mm}:00`;
};