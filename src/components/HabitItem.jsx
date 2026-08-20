// import { useEffect, useRef, useState } from "react";
// import {
//   Check,
//   Play,
//   Pause,
//   RotateCcw,
//   Minus,
//   Plus,
//   CalendarDays,
//   X,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { getIcon, colorClasses } from "../game/iconRegistry.js";
// import { useGame } from "../game/GameContext.jsx";

// const DIFFICULTY_STYLES = {
//   Easy: "text-teal bg-teal/10",
//   Medium: "text-blue-300 bg-blue-400/10",
//   Hard: "text-orange-300 bg-orange-400/10",
//   Epic: "text-purple bg-purple/10",
// };

// function formatSeconds(total) {
//   const m = Math.floor(total / 60);
//   const s = total % 60;
//   return `${m}:${String(s).padStart(2, "0")}`;
// }

// function dateKey(date) {
//   const y = date.getFullYear();
//   const m = String(date.getMonth() + 1).padStart(2, "0");
//   const d = String(date.getDate()).padStart(2, "0");
//   return `${y}-${m}-${d}`;
// }

// function isSameDay(a, b) {
//   return (
//     a.getFullYear() === b.getFullYear() &&
//     a.getMonth() === b.getMonth() &&
//     a.getDate() === b.getDate()
//   );
// }

// function getCalendarDays(year, month) {
//   const firstDay = new Date(year, month, 1);
//   const startDay = firstDay.getDay();
//   const mondayOffset = startDay === 0 ? 6 : startDay - 1;

//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const previousMonthDays = new Date(year, month, 0).getDate();

//   const days = [];

//   for (let i = mondayOffset - 1; i >= 0; i -= 1) {
//     days.push({
//       date: new Date(
//         year,
//         month - 1,
//         previousMonthDays - i
//       ),
//       currentMonth: false,
//     });
//   }

//   for (let day = 1; day <= daysInMonth; day += 1) {
//     days.push({
//       date: new Date(year, month, day),
//       currentMonth: true,
//     });
//   }

//   while (days.length < 42) {
//     const nextDay =
//       days.length - mondayOffset - daysInMonth + 1;

//     days.push({
//       date: new Date(year, month + 1, nextDay),
//       currentMonth: false,
//     });
//   }

//   return days;
// }

// function HabitCalendar({ habit }) {
//   const { completionHistory = {} } = useGame();

//   const [open, setOpen] = useState(false);
//   const today = new Date();

//   const [currentMonth, setCurrentMonth] = useState(
//     today.getMonth()
//   );
//   const [currentYear, setCurrentYear] = useState(
//     today.getFullYear()
//   );

//   if (!open) {
//     return (
//       <button
//         type="button"
//         onClick={() => setOpen(true)}
//         aria-label={`Open calendar for ${habit.title}`}
//         title="View habit calendar"
//         className="w-8 h-8 rounded-lg bg-surface-light text-gray-400 flex items-center justify-center shrink-0 hover:text-teal hover:bg-teal/10 hover:scale-110 active:scale-95 transition-all duration-200"
//       >
//         <CalendarDays size={15} />
//       </button>
//     );
//   }

//   const days = getCalendarDays(
//     currentYear,
//     currentMonth
//   );

//   function previousMonth() {
//     if (currentMonth === 0) {
//       setCurrentMonth(11);
//       setCurrentYear((year) => year - 1);
//     } else {
//       setCurrentMonth((month) => month - 1);
//     }
//   }

//   function nextMonth() {
//     if (currentMonth === 11) {
//       setCurrentMonth(0);
//       setCurrentYear((year) => year + 1);
//     } else {
//       setCurrentMonth((month) => month + 1);
//     }
//   }

//   function isScheduled(date) {
//     if (!habit.scheduledDate) return true;

//     const start = new Date(
//       `${habit.scheduledDate}T00:00:00`
//     );

//     if (date < start) return false;

//     if (habit.kind === "task") {
//       return dateKey(date) === habit.scheduledDate;
//     }

//     if (habit.frequency === "Weekly") {
//       return date.getDay() === start.getDay();
//     }

//     return true;
//   }

//   function getStatus(date) {
//     if (!isScheduled(date)) return "none";

//     const key = `${habit.id}:${dateKey(date)}`;
//     const completed = Boolean(completionHistory[key]);

//     if (completed) return "done";

//     if (date < new Date(
//       today.getFullYear(),
//       today.getMonth(),
//       today.getDate()
//     )) {
//       return "missed";
//     }

//     return "future";
//   }

//   let completedCount = 0;
//   let scheduledCount = 0;

//   days.forEach(({ date, currentMonth: inMonth }) => {
//     if (!inMonth || !isScheduled(date)) return;

//     const status = getStatus(date);

//     if (status === "done") completedCount += 1;
//     if (status !== "future") scheduledCount += 1;
//   });

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
//       <div
//         className="relative w-full max-w-lg bg-surface border border-border rounded-2xl p-6 shadow-2xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           type="button"
//           onClick={() => setOpen(false)}
//           aria-label="Close calendar"
//           className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-surface-light text-gray-400 flex items-center justify-center hover:text-white transition"
//         >
//           <X size={16} />
//         </button>

//         <div className="mb-5 pr-10">
//           <h2 className="text-lg font-bold">
//             {habit.title}
//           </h2>

//           <p className="text-xs text-gray-500 mt-1">
//             {habit.frequency === "Once"
//               ? "One-time task"
//               : `${habit.frequency} habit`}
//           </p>
//         </div>

//         <div className="flex items-center justify-between mb-5">
//           <button
//             type="button"
//             onClick={previousMonth}
//             className="w-9 h-9 rounded-lg bg-surface-light text-gray-400 flex items-center justify-center hover:text-white"
//           >
//             <ChevronLeft size={18} />
//           </button>

//           <div className="text-center">
//             <h3 className="font-bold">
//               {new Date(
//                 currentYear,
//                 currentMonth
//               ).toLocaleString("default", {
//                 month: "long",
//               })}
//             </h3>
//             <p className="text-xs text-gray-500">
//               {currentYear}
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={nextMonth}
//             className="w-9 h-9 rounded-lg bg-surface-light text-gray-400 flex items-center justify-center hover:text-white"
//           >
//             <ChevronRight size={18} />
//           </button>
//         </div>

//         <div className="grid grid-cols-7 mb-2">
//           {[
//             "Mon",
//             "Tue",
//             "Wed",
//             "Thu",
//             "Fri",
//             "Sat",
//             "Sun",
//           ].map((day) => (
//             <div
//               key={day}
//               className="text-center text-[11px] font-semibold text-gray-500 py-1"
//             >
//               {day}
//             </div>
//           ))}
//         </div>

//         <div className="grid grid-cols-7 gap-2">
//           {days.map(({ date, currentMonth: inMonth }) => {
//             const status = getStatus(date);
//             const todayDate = isSameDay(date, today);

//             let cellClass =
//               "bg-surface-light border-border text-gray-500";

//             if (status === "done") {
//               cellClass =
//                 "bg-teal/20 border-teal text-teal";
//             } else if (status === "missed") {
//               cellClass =
//                 "bg-pink-500/10 border-pink-400/50 text-pink-400";
//             } else if (status === "future") {
//               cellClass =
//                 "bg-surface-light border-border text-gray-400";
//             } else if (!inMonth) {
//               cellClass =
//                 "bg-transparent border-transparent text-gray-700";
//             }

//             return (
//               <div
//                 key={dateKey(date)}
//                 className={`relative h-11 rounded-lg border flex items-center justify-center text-xs font-semibold ${cellClass} ${
//                   todayDate
//                     ? "ring-1 ring-teal"
//                     : ""
//                 }`}
//               >
//                 {inMonth && status === "done" && (
//                   <Check
//                     size={13}
//                     className="absolute top-1 right-1"
//                     strokeWidth={3}
//                   />
//                 )}

//                 {inMonth &&
//                   status === "missed" && (
//                     <X
//                       size={12}
//                       className="absolute top-1 right-1"
//                       strokeWidth={3}
//                     />
//                   )}

//                 {date.getDate()}
//               </div>
//             );
//           })}
//         </div>

//         <div className="flex items-center justify-center gap-5 mt-5 text-[11px]">
//           <span className="flex items-center gap-1.5 text-teal">
//             <span className="w-2.5 h-2.5 rounded-full bg-teal" />
//             Completed
//           </span>

//           <span className="flex items-center gap-1.5 text-pink-400">
//             <span className="w-2.5 h-2.5 rounded-full bg-pink-400" />
//             Missed
//           </span>

//           <span className="flex items-center gap-1.5 text-gray-500">
//             <span className="w-2.5 h-2.5 rounded-full bg-surface-light border border-border" />
//             Upcoming
//           </span>
//         </div>

//         <div className="mt-5 pt-4 border-t border-border text-center">
//           <span className="text-xs text-gray-500">
//             This month
//           </span>
//           <p className="text-xl font-bold text-teal mt-1">
//             {completedCount}
//             <span className="text-sm text-gray-500">
//               {" "}
//               / {scheduledCount || 0}
//             </span>
//           </p>
//           <p className="text-xs text-gray-500">
//             completions
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// function HabitFrame({ habit, children }) {
//   const {
//     icon,
//     color,
//     title,
//     frequency,
//     xp,
//     coins,
//     done,
//     difficulty,
//     kind,
//   } = habit;

//   const Icon = getIcon(icon);
//   const { text: iconColor, bg: iconBg } =
//     colorClasses(color);

//   return (
//     <div
//       className={`flex items-center gap-3 bg-surface border rounded-xl px-4 py-3 transition-colors ${
//         done
//           ? "border-teal/30"
//           : "border-border hover:border-teal/30"
//       }`}
//     >
//       <span
//         className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 ${iconBg}`}
//       >
//         <Icon size={17} className={iconColor} />
//       </span>

//       <span className="flex-1 min-w-0">
//         <span className="flex items-center gap-2 flex-wrap">
//           <p
//             className={`text-sm font-medium truncate ${
//               done
//                 ? "line-through text-gray-500"
//                 : "text-white"
//             }`}
//           >
//             {title}
//           </p>

//           {difficulty && (
//             <span
//               className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${DIFFICULTY_STYLES[difficulty]}`}
//             >
//               {difficulty}
//             </span>
//           )}

//           {kind === "task" && (
//             <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded text-gold bg-gold/10">
//               Task
//             </span>
//           )}
//         </span>

//         <p className="text-xs text-gray-500">
//           {frequency}
//         </p>
//       </span>

//       {children}

//       {/* Per-habit calendar button */}
//       <HabitCalendar habit={habit} />

//       <span className="flex flex-col items-end shrink-0 pl-1">
//         <span className="text-sm font-medium text-teal">
//           +{xp} XP
//         </span>
//         <span className="text-xs text-gold">
//           +{coins} coins
//         </span>
//       </span>
//     </div>
//   );
// }

// function TickControl({ habit, onToggle }) {
//   return (
//     <button
//       onClick={onToggle}
//       aria-label={
//         habit.done
//           ? "Mark incomplete"
//           : "Mark complete"
//       }
//       className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 transition-all duration-200 hover:scale-110 active:scale-95 ${
//         habit.done
//           ? "bg-teal border-teal"
//           : "border-gray-500 hover:border-teal"
//       }`}
//     >
//       {habit.done && (
//         <Check
//           size={16}
//           className="text-bg"
//           strokeWidth={3}
//         />
//       )}
//     </button>
//   );
// }

// function TimerControl({
//   habit,
//   onUpdateTimer,
// }) {
//   const [localElapsed, setLocalElapsed] =
//     useState(habit.timerElapsedSeconds);
//   const [running, setRunning] =
//     useState(false);
//   const intervalRef = useRef(null);

//   useEffect(() => {
//     if (!running) return;

//     intervalRef.current = setInterval(() => {
//       setLocalElapsed((prev) => {
//         const next = Math.min(
//           prev + 1,
//           habit.timerTargetSeconds
//         );

//         if (
//           next >=
//           habit.timerTargetSeconds
//         ) {
//           clearInterval(
//             intervalRef.current
//           );
//           setRunning(false);
//           onUpdateTimer(next);
//         }

//         return next;
//       });
//     }, 1000);

//     return () =>
//       clearInterval(
//         intervalRef.current
//       );
//   }, [
//     running,
//     habit.timerTargetSeconds,
//     onUpdateTimer,
//   ]);

//   useEffect(
//     () => () =>
//       clearInterval(
//         intervalRef.current
//       ),
//     []
//   );

//   function toggleRunning() {
//     if (running) {
//       clearInterval(
//         intervalRef.current
//       );
//       setRunning(false);
//       onUpdateTimer(localElapsed);
//     } else {
//       setRunning(true);
//     }
//   }

//   function reset() {
//     clearInterval(
//       intervalRef.current
//     );
//     setRunning(false);
//     setLocalElapsed(0);
//     onUpdateTimer(0);
//   }

//   const pct = Math.min(
//     100,
//     Math.round(
//       (localElapsed /
//         habit.timerTargetSeconds) *
//         100
//     )
//   );

//   return (
//     <div className="flex items-center gap-2.5 shrink-0">
//       <div className="w-24">
//         <div className="flex justify-between text-[11px] text-gray-500 mb-1">
//           <span
//             className={
//               running
//                 ? "text-teal font-medium"
//                 : ""
//             }
//           >
//             {formatSeconds(
//               localElapsed
//             )}
//           </span>
//           <span>
//             {formatSeconds(
//               habit.timerTargetSeconds
//             )}
//           </span>
//         </div>

//         <div className="h-1.5 bg-surface-light rounded-full overflow-hidden">
//           <div
//             className="h-full bg-teal rounded-full transition-all duration-300 ease-out"
//             style={{
//               width: `${pct}%`,
//             }}
//           />
//         </div>
//       </div>

//       <button
//         onClick={toggleRunning}
//         aria-label={
//           running
//             ? "Pause timer"
//             : "Start timer"
//         }
//         disabled={habit.done}
//         className="w-8 h-8 rounded-lg bg-teal/10 text-teal flex items-center justify-center hover:bg-teal/20 hover:scale-110 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:hover:scale-100"
//       >
//         {running ? (
//           <Pause size={14} />
//         ) : (
//           <Play
//             size={14}
//             className="ml-0.5"
//           />
//         )}
//       </button>

//       <button
//         onClick={reset}
//         aria-label="Reset timer"
//         className="w-8 h-8 rounded-lg bg-surface-light text-gray-400 flex items-center justify-center hover:text-white hover:scale-110 active:scale-95 transition-all duration-200"
//       >
//         <RotateCcw size={13} />
//       </button>
//     </div>
//   );
// }

// function NumericControl({
//   habit,
//   onUpdateNumeric,
// }) {
//   const step = Math.max(
//     1,
//     Math.round(
//       habit.numericTarget / 10
//     )
//   );

//   function adjust(delta) {
//     onUpdateNumeric(
//       Math.max(
//         0,
//         habit.numericValue + delta
//       )
//     );
//   }

//   const pct = Math.min(
//     100,
//     Math.round(
//       (habit.numericValue /
//         habit.numericTarget) *
//         100
//     )
//   );

//   return (
//     <div className="flex items-center gap-2.5 shrink-0">
//       <div className="w-28">
//         <div className="flex justify-between text-[11px] text-gray-500 mb-1">
//           <span
//             className={
//               habit.done
//                 ? "text-teal font-medium"
//                 : ""
//             }
//           >
//             {habit.numericValue} /{" "}
//             {habit.numericTarget}
//           </span>

//           <span className="truncate max-w-[60px]">
//             {habit.numericUnit}
//           </span>
//         </div>

//         <div className="h-1.5 bg-surface-light rounded-full overflow-hidden">
//           <div
//             className="h-full bg-purple rounded-full transition-all duration-300 ease-out"
//             style={{
//               width: `${pct}%`,
//             }}
//           />
//         </div>
//       </div>

//       <button
//         onClick={() => adjust(-step)}
//         aria-label="Decrease"
//         className="w-7 h-7 rounded-lg bg-surface-light text-gray-400 flex items-center justify-center hover:text-white hover:scale-110 active:scale-95 transition-all duration-200"
//       >
//         <Minus size={13} />
//       </button>

//       <button
//         onClick={() => adjust(step)}
//         aria-label="Increase"
//         className="w-7 h-7 rounded-lg bg-purple/10 text-purple flex items-center justify-center hover:bg-purple/20 hover:scale-110 active:scale-95 transition-all duration-200"
//       >
//         <Plus size={13} />
//       </button>
//     </div>
//   );
// }

// export default function HabitItem({
//   habit,
//   onToggle,
//   onUpdateTimer,
//   onUpdateNumeric,
// }) {
//   return (
//     <HabitFrame habit={habit}>
//       {habit.trackingType ===
//         "timer" && (
//         <TimerControl
//           habit={habit}
//           onUpdateTimer={(v) =>
//             onUpdateTimer?.(
//               habit.id,
//               v
//             )
//           }
//         />
//       )}

//       {habit.trackingType ===
//         "numeric" && (
//         <NumericControl
//           habit={habit}
//           onUpdateNumeric={(v) =>
//             onUpdateNumeric?.(
//               habit.id,
//               v
//             )
//           }
//         />
//       )}

//       {(habit.trackingType ===
//         "tick" ||
//         !habit.trackingType) && (
//         <TickControl
//           habit={habit}
//           onToggle={onToggle}
//         />
//       )}
//     </HabitFrame>
//   );
// }
import { useEffect, useRef, useState } from "react";
import {
  Check,
  Play,
  Pause,
  RotateCcw,
  Minus,
  Plus,
  CalendarDays,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getIcon, colorClasses } from "../game/iconRegistry.js";
import { useGame } from "../game/GameContext.jsx";

const DIFFICULTY_STYLES = {
  Easy: "text-teal bg-teal/10",
  Medium: "text-blue-300 bg-blue-400/10",
  Hard: "text-orange-300 bg-orange-400/10",
  Epic: "text-purple bg-purple/10",
};

function formatSeconds(total) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const mondayOffset = startDay === 0 ? 6 : startDay - 1;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const previousMonthDays = new Date(year, month, 0).getDate();

  const days = [];

  for (let i = mondayOffset - 1; i >= 0; i -= 1) {
    days.push({
      date: new Date(
        year,
        month - 1,
        previousMonthDays - i
      ),
      currentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push({
      date: new Date(year, month, day),
      currentMonth: true,
    });
  }

  while (days.length < 42) {
    const nextDay =
      days.length - mondayOffset - daysInMonth + 1;

    days.push({
      date: new Date(year, month + 1, nextDay),
      currentMonth: false,
    });
  }

  return days;
}

function HabitCalendar({ habit }) {
  const { completionHistory = {} } = useGame();

  const [open, setOpen] = useState(false);
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    today.getMonth()
  );
  const [currentYear, setCurrentYear] = useState(
    today.getFullYear()
  );

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open calendar for ${habit.title}`}
        title="View habit calendar"
        className="w-8 h-8 rounded-lg bg-surface-light text-gray-400 flex items-center justify-center shrink-0 hover:text-teal hover:bg-teal/10 hover:scale-110 active:scale-95 transition-all duration-200"
      >
        <CalendarDays size={15} />
      </button>
    );
  }

  const days = getCalendarDays(
    currentYear,
    currentMonth
  );

  function previousMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((year) => year - 1);
    } else {
      setCurrentMonth((month) => month - 1);
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((year) => year + 1);
    } else {
      setCurrentMonth((month) => month + 1);
    }
  }

  function isScheduled(date) {
    if (!habit.scheduledDate) return true;

    const start = new Date(
      `${habit.scheduledDate}T00:00:00`
    );

    if (date < start) return false;

    if (habit.kind === "task") {
      return dateKey(date) === habit.scheduledDate;
    }

    if (habit.frequency === "Weekly") {
      return date.getDay() === start.getDay();
    }

    return true;
  }

  function getStatus(date) {
    if (!isScheduled(date)) return "none";

    const key = `${habit.id}:${dateKey(date)}`;
    const completed = Boolean(completionHistory[key]);

    if (completed) return "done";

    if (
      date <
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      )
    ) {
      return "missed";
    }

    return "future";
  }

  let completedCount = 0;
  let scheduledCount = 0;

  days.forEach(({ date, currentMonth: inMonth }) => {
    if (!inMonth || !isScheduled(date)) return;

    const status = getStatus(date);

    if (status === "done") completedCount += 1;
    if (status !== "future") scheduledCount += 1;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div
        className="relative w-full max-w-lg bg-surface border border-border rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close calendar"
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-surface-light text-gray-400 flex items-center justify-center hover:text-white transition"
        >
          <X size={16} />
        </button>

        <div className="mb-5 pr-10">
          <h2 className="text-lg font-bold">
            {habit.title}
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            {habit.frequency === "Once"
              ? "One-time task"
              : `${habit.frequency} habit`}
          </p>
        </div>

        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            onClick={previousMonth}
            className="w-9 h-9 rounded-lg bg-surface-light text-gray-400 flex items-center justify-center hover:text-white"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="text-center">
            <h3 className="font-bold">
              {new Date(
                currentYear,
                currentMonth
              ).toLocaleString("default", {
                month: "long",
              })}
            </h3>
            <p className="text-xs text-gray-500">
              {currentYear}
            </p>
          </div>

          <button
            type="button"
            onClick={nextMonth}
            className="w-9 h-9 rounded-lg bg-surface-light text-gray-400 flex items-center justify-center hover:text-white"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {[
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
          ].map((day) => (
            <div
              key={day}
              className="text-center text-[11px] font-semibold text-gray-500 py-1"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map(({ date, currentMonth: inMonth }) => {
            const status = getStatus(date);
            const todayDate = isSameDay(date, today);

            let cellClass =
              "bg-surface-light border-border text-gray-500";

            if (status === "done") {
              cellClass =
                "bg-teal/20 border-teal text-teal";
            } else if (status === "missed") {
              cellClass =
                "bg-pink-500/10 border-pink-400/50 text-pink-400";
            } else if (status === "future") {
              cellClass =
                "bg-surface-light border-border text-gray-400";
            } else if (!inMonth) {
              cellClass =
                "bg-transparent border-transparent text-gray-700";
            }

            return (
              <div
                key={dateKey(date)}
                className={`relative h-11 rounded-lg border flex items-center justify-center text-xs font-semibold ${cellClass} ${
                  todayDate
                    ? "ring-1 ring-teal"
                    : ""
                }`}
              >
                {inMonth && status === "done" && (
                  <Check
                    size={13}
                    className="absolute top-1 right-1"
                    strokeWidth={3}
                  />
                )}

                {inMonth &&
                  status === "missed" && (
                    <X
                      size={12}
                      className="absolute top-1 right-1"
                      strokeWidth={3}
                    />
                  )}

                {date.getDate()}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-5 mt-5 text-[11px]">
          <span className="flex items-center gap-1.5 text-teal">
            <span className="w-2.5 h-2.5 rounded-full bg-teal" />
            Completed
          </span>

          <span className="flex items-center gap-1.5 text-pink-400">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-400" />
            Missed
          </span>

          <span className="flex items-center gap-1.5 text-gray-500">
            <span className="w-2.5 h-2.5 rounded-full bg-surface-light border border-border" />
            Upcoming
          </span>
        </div>

        <div className="mt-5 pt-4 border-t border-border text-center">
          <span className="text-xs text-gray-500">
            This month
          </span>

          <p className="text-xl font-bold text-teal mt-1">
            {completedCount}
            <span className="text-sm text-gray-500">
              {" "}
              / {scheduledCount || 0}
            </span>
          </p>

          <p className="text-xs text-gray-500">
            completions
          </p>
        </div>
      </div>
    </div>
  );
}

function HabitFrame({ habit, children }) {
  const {
    icon,
    color,
    title,
    frequency,
    xp,
    coins,
    done,
    difficulty,
    kind,
  } = habit;

  const Icon = getIcon(icon);
  const { text: iconColor, bg: iconBg } =
    colorClasses(color);

  return (
    <div
      className={`grid grid-cols-[minmax(0,1fr)_220px_40px_80px] items-center gap-3 bg-surface border rounded-xl px-4 py-3 transition-colors ${
        done
          ? "border-teal/30"
          : "border-border hover:border-teal/30"
      }`}
    >
      <div className="min-w-0 flex items-center gap-3">
        <span
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 ${iconBg}`}
        >
          <Icon
            size={17}
            className={iconColor}
          />
        </span>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p
              className={`text-sm font-medium truncate ${
                done
                  ? "line-through text-gray-500"
                  : "text-white"
              }`}
            >
              {title}
            </p>

            {difficulty && (
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${DIFFICULTY_STYLES[difficulty]}`}
              >
                {difficulty}
              </span>
            )}

            {kind === "task" && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded text-gold bg-gold/10 shrink-0">
                Task
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500">
            {frequency}
          </p>
        </div>
      </div>

      {/* FIXED TRACKING CONTROL COLUMN */}
      <div className="w-[220px] min-w-[220px] flex items-center justify-end">
        {children}
      </div>

      {/* FIXED CALENDAR COLUMN */}
      <div className="w-10 min-w-10 flex items-center justify-center">
        <HabitCalendar habit={habit} />
      </div>

      {/* FIXED XP / COINS COLUMN */}
      <div className="w-20 min-w-20 flex flex-col items-end">
        <span className="text-sm font-medium text-teal whitespace-nowrap">
          +{xp} XP
        </span>

        <span className="text-xs text-gold whitespace-nowrap">
          +{coins} coins
        </span>
      </div>
    </div>
  );
}

function TickControl({ habit, onToggle }) {
  return (
    <div className="w-full flex items-center justify-end">
      <button
        onClick={onToggle}
        aria-label={
          habit.done
            ? "Mark incomplete"
            : "Mark complete"
        }
        className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ${
          habit.done
            ? "bg-teal border-teal"
            : "border-gray-500 hover:border-teal"
        }`}
      >
        {habit.done && (
          <Check
            size={16}
            className="text-bg"
            strokeWidth={3}
          />
        )}
      </button>
    </div>
  );
}

function TimerControl({
  habit,
  onUpdateTimer,
}) {
  const [localElapsed, setLocalElapsed] =
    useState(habit.timerElapsedSeconds);

  const [running, setRunning] =
    useState(false);

  const intervalRef = useRef(null);

  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setLocalElapsed((prev) => {
        const next = Math.min(
          prev + 1,
          habit.timerTargetSeconds
        );

        if (
          next >=
          habit.timerTargetSeconds
        ) {
          clearInterval(
            intervalRef.current
          );

          setRunning(false);
          onUpdateTimer(next);
        }

        return next;
      });
    }, 1000);

    return () =>
      clearInterval(
        intervalRef.current
      );
  }, [
    running,
    habit.timerTargetSeconds,
    onUpdateTimer,
  ]);

  useEffect(
    () => () =>
      clearInterval(
        intervalRef.current
      ),
    []
  );

  function toggleRunning() {
    if (running) {
      clearInterval(
        intervalRef.current
      );

      setRunning(false);
      onUpdateTimer(localElapsed);
    } else {
      setRunning(true);
    }
  }

  function reset() {
    clearInterval(
      intervalRef.current
    );

    setRunning(false);
    setLocalElapsed(0);
    onUpdateTimer(0);
  }

  const pct = Math.min(
    100,
    Math.round(
      (localElapsed /
        habit.timerTargetSeconds) *
        100
    )
  );

  return (
    <div className="w-full flex items-center justify-end gap-2.5">
      <div className="w-24">
        <div className="flex justify-between text-[11px] text-gray-500 mb-1">
          <span
            className={
              running
                ? "text-teal font-medium"
                : ""
            }
          >
            {formatSeconds(
              localElapsed
            )}
          </span>

          <span>
            {formatSeconds(
              habit.timerTargetSeconds
            )}
          </span>
        </div>

        <div className="h-1.5 bg-surface-light rounded-full overflow-hidden">
          <div
            className="h-full bg-teal rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${pct}%`,
            }}
          />
        </div>
      </div>

      <button
        onClick={toggleRunning}
        aria-label={
          running
            ? "Pause timer"
            : "Start timer"
        }
        disabled={habit.done}
        className="w-8 h-8 rounded-lg bg-teal/10 text-teal flex items-center justify-center hover:bg-teal/20 hover:scale-110 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:hover:scale-100"
      >
        {running ? (
          <Pause size={14} />
        ) : (
          <Play
            size={14}
            className="ml-0.5"
          />
        )}
      </button>

      <button
        onClick={reset}
        aria-label="Reset timer"
        className="w-8 h-8 rounded-lg bg-surface-light text-gray-400 flex items-center justify-center hover:text-white hover:scale-110 active:scale-95 transition-all duration-200"
      >
        <RotateCcw size={13} />
      </button>
    </div>
  );
}

function NumericControl({
  habit,
  onUpdateNumeric,
}) {
  const step = Math.max(
    1,
    Math.round(
      habit.numericTarget / 10
    )
  );

  function adjust(delta) {
    onUpdateNumeric(
      Math.max(
        0,
        habit.numericValue + delta
      )
    );
  }

  const pct = Math.min(
    100,
    Math.round(
      (habit.numericValue /
        habit.numericTarget) *
        100
    )
  );

  return (
    <div className="w-full flex items-center justify-end gap-2.5">
      <div className="w-28">
        <div className="flex justify-between text-[11px] text-gray-500 mb-1">
          <span
            className={
              habit.done
                ? "text-teal font-medium"
                : ""
            }
          >
            {habit.numericValue} /{" "}
            {habit.numericTarget}
          </span>

          <span className="truncate max-w-[60px]">
            {habit.numericUnit}
          </span>
        </div>

        <div className="h-1.5 bg-surface-light rounded-full overflow-hidden">
          <div
            className="h-full bg-purple rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${pct}%`,
            }}
          />
        </div>
      </div>

      <button
        onClick={() => adjust(-step)}
        aria-label="Decrease"
        className="w-7 h-7 rounded-lg bg-surface-light text-gray-400 flex items-center justify-center hover:text-white hover:scale-110 active:scale-95 transition-all duration-200"
      >
        <Minus size={13} />
      </button>

      <button
        onClick={() => adjust(step)}
        aria-label="Increase"
        className="w-7 h-7 rounded-lg bg-purple/10 text-purple flex items-center justify-center hover:bg-purple/20 hover:scale-110 active:scale-95 transition-all duration-200"
      >
        <Plus size={13} />
      </button>
    </div>
  );
}

export default function HabitItem({
  habit,
  onToggle,
  onUpdateTimer,
  onUpdateNumeric,
}) {
  return (
    <HabitFrame habit={habit}>
      {habit.trackingType ===
        "timer" && (
        <TimerControl
          habit={habit}
          onUpdateTimer={(v) =>
            onUpdateTimer?.(
              habit.id,
              v
            )
          }
        />
      )}

      {habit.trackingType ===
        "numeric" && (
        <NumericControl
          habit={habit}
          onUpdateNumeric={(v) =>
            onUpdateNumeric?.(
              habit.id,
              v
            )
          }
        />
      )}

      {(habit.trackingType ===
        "tick" ||
        !habit.trackingType) && (
        <TickControl
          habit={habit}
          onToggle={onToggle}
        />
      )}
    </HabitFrame>
  );
}