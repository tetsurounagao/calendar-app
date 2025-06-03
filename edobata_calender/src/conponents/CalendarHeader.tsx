interface HeaderProps {
  year: number;
  month: number;
}

// const monthNames = [
//   'January', 'February', 'March', 'April', 'May', 'June',
//   'July', 'August', 'September', 'October', 'November', 'December'
// ];

export default function CalendarHeader({ year, month }: HeaderProps) {
  return (
    <div className="text-center mb-4">
      <div className="text-red-500 text-sm">{year}</div>
      <div className="text-3xl font-bold tracking-wide">{month + 1}月の営業日</div>
    </div>
  );
}
