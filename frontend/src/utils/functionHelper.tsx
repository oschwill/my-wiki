export const clockFN = (): { date: string; time: string } => {
  const date = new Date();
  const dateString = date.toLocaleDateString();
  const timeString = date.toLocaleTimeString();

  return { date: dateString, time: timeString };
};

export const hoverPrevElement = (event: React.MouseEvent<HTMLElement>, colorCode: string) => {
  event.stopPropagation();

  const target = event.target as HTMLElement;
  if (target && target.previousElementSibling) {
    const line = target.previousElementSibling as HTMLElement;
    line.style.background = colorCode;
  }
};
