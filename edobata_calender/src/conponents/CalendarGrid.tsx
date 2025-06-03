import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import { useState } from 'react';

interface Props {
  year: number;
  month: number;
}

export default function CalendarGrid({ year, month }: Props) {
  const [editing, setEditing] = useState(false);
  const [crossedDates, setCrossedDates] = useState<Date[]>([]);

  const today = new Date(year, month);
  const start = startOfWeek(startOfMonth(today), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(today), { weekStartsOn: 0 });

  const toggleCross = (date: Date) => {
    if (!editing) return;
    const exists = crossedDates.find((d) => isSameDay(d, date));
    if (exists) {
      setCrossedDates(crossedDates.filter((d) => !isSameDay(d, date)));
    } else {
      setCrossedDates([...crossedDates, date]);
    }
  };

  const isCrossed = (date: Date) => {
    return date.getDay() === 1 || date.getDay() === 2 || crossedDates.some((d) => isSameDay(d, date));
  };

  const rows = [];
  let day = start;
  while (day <= end) {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const current = day;
      const inMonth = isSameMonth(current, today);
      const crossed = isCrossed(current);
      days.push(
        <div
          key={current.toISOString()}
          className={`w-10 h-10 flex items-center justify-center text-sm ${!inMonth ? 'text-gray-300' : ''} ${
            current.getDay() === 0 ? 'text-red-500' : current.getDay() === 6 ? 'text-blue-500' : ''
          }`}
          onClick={() => toggleCross(current)}
        >
          <div className="relative">
            {current.getDate()}
            {crossed && <span className="absolute top-1 left-1 text-black opacity-60">×</span>}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toISOString()} className="flex justify-center gap-1">
        {days}
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex justify-center gap-1 mb-1 text-xs text-gray-700">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="w-10 text-center">
            {d}
          </div>
        ))}
      </div>
      {rows}
      <button onClick={() => setEditing(!editing)} className="mt-4 px-4 py-1 border rounded text-sm">
        {editing ? '編集モード終了' : '× をつける'}
      </button>
    </div>
  );
}
