import { useEffect, useRef, useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  subMonths,
  addMonths,
} from 'date-fns';

export default function App() {
  const [year, setYear] = useState(() => parseInt(localStorage.getItem('year') || '2025'));
  const [month, setMonth] = useState(() => parseInt(localStorage.getItem('month') || '5'));
  const [editing, setEditing] = useState(false);
  const [crossedDates, setCrossedDates] = useState<Date[]>(() => {
    const saved = localStorage.getItem('crossedDates');
    return saved ? JSON.parse(saved).map((d: string) => new Date(d)) : [];
  });
  const [note, setNote] = useState(localStorage.getItem('note') || 'Wed, Thu, Sun 11:30-19:00\nFri, Sat 11:30-22:00');
  const [phone, setPhone] = useState(localStorage.getItem('phone') || '080-9675-5426');

  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('year', year.toString());
    localStorage.setItem('month', month.toString());
    localStorage.setItem('crossedDates', JSON.stringify(crossedDates));
    localStorage.setItem('note', note);
    localStorage.setItem('phone', phone);
  }, [year, month, crossedDates, note, phone]);

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
    return crossedDates.some((d) => isSameDay(d, date));
  };

  const addClosedByWeekday = (weekday: number) => {
    const datesToAdd: Date[] = [];
    let day = start;
    while (day <= end) {
      if (day.getDay() === weekday && day.getMonth() === month && day.getFullYear() === year && !isCrossed(day)) {
        datesToAdd.push(new Date(day));
      }
      day = addDays(day, 1);
    }
    setCrossedDates([...crossedDates, ...datesToAdd]);
  };

  const resetCrosses = () => {
    setCrossedDates(crossedDates.filter((date) => date.getMonth() !== month || date.getFullYear() !== year));
  };

  const renderCalendar = () => {
    const rows = [];
    let day = start;
    while (day <= end) {
      const days = [];
      for (let i = 0; i < 7; i++) {
        const current = day;
        const inMonth = isSameMonth(current, today);
        const crossed = isCrossed(current);
        const dateStr = current.getDate().toString();
        const isSingleDigit = dateStr.length === 1;
        const weekday = current.getDay();

        const baseColor = weekday === 0 ? 'text-red-500' : weekday === 6 ? 'text-blue-500' : 'text-gray-700';
        const textColor = inMonth ? baseColor : 'text-gray-300 opacity-70';

        days.push(
          <div
            key={current.toISOString()}
            className={`w-10 h-10 flex items-center justify-center text-base sm:text-lg ${textColor}`}
            onClick={() => toggleCross(current)}
          >
            <div className="relative">
              {dateStr}
              {crossed && (
                <span
                  className="absolute top-[-0px] text-black opacity-90 text-xl font-bold"
                  style={{ left: isSingleDigit ? '-5px' : '0px' }}
                >
                  ×
                </span>
              )}
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
    return rows;
  };

  const handleExport = async () => {
    const html2canvas = (await import('html2canvas')).default;
    const arrows = document.getElementById('arrows');
    const controls = document.getElementById('ui-controls');
    if (arrows) arrows.style.display = 'none';
    if (controls) controls.style.display = 'none';

    if (canvasRef.current) {
      html2canvas(canvasRef.current, {
        scale: 3,
        width: 402,
        height: 600,
        backgroundColor: '#ffffff',
      }).then((canvas) => {
        const dataURL = canvas.toDataURL();

        // ダウンロードリンクも残す（PC向け）
        const link = document.createElement('a');
        link.download = `calendar-${year}-${month + 1}.png`;
        link.href = dataURL;
        link.click();

        // プレビュー表示（iOS向け）
        const preview = document.getElementById('preview');
        if (preview) {
          preview.innerHTML = '';
          const img = document.createElement('img');
          img.src = dataURL;
          img.alt = 'Exported Calendar';
          img.className = 'mt-4 border w-full';
          preview.appendChild(img);
        }

        if (arrows) arrows.style.display = 'flex';
        if (controls) controls.style.display = 'flex';
      });
    }
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderStyledNote = () => {
    const parts = note.split(/(Sun|Sat)/g);
    return parts.map((part, idx) => {
      if (part === 'Sun')
        return (
          <span key={idx} className="text-red-500">
            Sun
          </span>
        );
      if (part === 'Sat')
        return (
          <span key={idx} className="text-blue-500">
            Sat
          </span>
        );
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-4 font-serif">
      <div className="w-[402px] h-[600px] mx-auto pt-14 pb-8 border border-gray-300 shadow" ref={canvasRef}>
        <div className="flex justify-between items-center mb-2 px-4" id="arrows">
          <button onClick={() => setMonth((prev) => (prev === 0 ? (setYear((y) => y - 1), 11) : prev - 1))}>
            &larr;
          </button>
          <button onClick={() => setMonth((prev) => (prev === 11 ? (setYear((y) => y + 1), 0) : prev + 1))}>
            &rarr;
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="text-red-500 text-sm">{year}</div>
          <div className="text-3xl font-bold tracking-wide mt-4">{month + 1}月の営業日</div>
        </div>

        <div className="flex justify-center gap-1 mb-1 text-sm text-gray-700">
          {weekdays.map((d) => (
            <div key={d} className="w-10 text-center">
              {d}
            </div>
          ))}
        </div>

        {renderCalendar()}

        <div className="mt-5 text-base text-gray-800 text-right pr-14">
          {editing ? (
            <textarea
              className="w-full text-right text-base leading-relaxed resize-none outline-none font-serif"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          ) : (
            <div className="whitespace-pre-wrap text-base text-right font-serif">{renderStyledNote()}</div>
          )}

          {editing ? (
            <input
              type="text"
              className="w-full text-right mt-2 text-xl opacity-90 outline-none font-serif"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          ) : (
            <div className="mt-2 text-xl text-right opacity-90 font-serif">{phone}</div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center gap-2" id="ui-controls">
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <span>定休日を設定:</span>
          {weekdays.map((d, i) => (
            <button key={d} className="px-2 py-1 border rounded" onClick={() => addClosedByWeekday(i)}>
              {d}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-2">
          <button onClick={() => setEditing(!editing)} className="px-4 py-1 border rounded text-sm">
            {editing ? '編集終了' : '編集する'}
          </button>

          <button onClick={handleExport} className="px-4 py-1 border rounded text-sm" disabled={editing}>
            画像を書き出す
          </button>

          <button onClick={resetCrosses} className="px-4 py-1 border rounded text-sm">
            休業日をリセット
          </button>
        </div>
      </div>

      <div id="preview" className="w-full max-w-[402px] mt-6" />
    </div>
  );
}
