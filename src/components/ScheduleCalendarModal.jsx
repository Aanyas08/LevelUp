import { useState } from 'react'
import {
  X,
  ChevronLeft,
  ChevronRight,
  CalendarPlus,
} from 'lucide-react'

function formatDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')

  return `${y}-${m}-${d}`
}

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1)
  const startDay = firstDay.getDay()

  // Monday = 0
  const mondayOffset =
    startDay === 0 ? 6 : startDay - 1

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate()

  const previousMonthDays = new Date(
    year,
    month,
    0
  ).getDate()

  const days = []

  for (let i = mondayOffset - 1; i >= 0; i--) {
    days.push({
      date: new Date(
        year,
        month - 1,
        previousMonthDays - i
      ),
      currentMonth: false,
    })
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      date: new Date(year, month, day),
      currentMonth: true,
    })
  }

  while (days.length < 42) {
    const day = days.length - (
      mondayOffset + daysInMonth
    ) + 1

    days.push({
      date: new Date(year, month + 1, day),
      currentMonth: false,
    })
  }

  return days
}

export default function ScheduleCalendarModal({
  open,
  onClose,
  onSelectDate,
}) {
  const today = new Date()

  const [currentMonth, setCurrentMonth] =
    useState(today.getMonth())

  const [currentYear, setCurrentYear] =
    useState(today.getFullYear())

  if (!open) return null

  const days = getCalendarDays(
    currentYear,
    currentMonth
  )

  function previousMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((year) => year - 1)
    } else {
      setCurrentMonth((month) => month - 1)
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((year) => year + 1)
    } else {
      setCurrentMonth((month) => month + 1)
    }
  }

  function isToday(date) {
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    )
  }

  function handleDateClick(date) {
    onSelectDate(formatDateKey(date))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-surface border border-border rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold">
              Schedule
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Select a date to schedule a new quest.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-light text-gray-400 flex items-center justify-center hover:text-white transition"
          >
            <X size={17} />
          </button>
        </div>

        {/* Month navigation */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={previousMonth}
            className="w-9 h-9 rounded-lg bg-surface-light flex items-center justify-center text-gray-400 hover:text-white hover:bg-surface-light/80"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="text-center">
            <h3 className="font-bold text-lg">
              {new Date(
                currentYear,
                currentMonth
              ).toLocaleString('default', {
                month: 'long',
              })}
            </h3>

            <p className="text-xs text-gray-500">
              {currentYear}
            </p>
          </div>

          <button
            onClick={nextMonth}
            className="w-9 h-9 rounded-lg bg-surface-light flex items-center justify-center text-gray-400 hover:text-white hover:bg-surface-light/80"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 mb-2">
          {[
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat',
            'Sun',
          ].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar */}
        <div className="grid grid-cols-7 gap-2">
          {days.map(({ date, currentMonth: isCurrentMonth }) => {
            const dateKey = formatDateKey(date)

            return (
              <button
                key={dateKey}
                onClick={() =>
                  handleDateClick(date)
                }
                className={`
                  relative min-h-[70px]
                  rounded-xl border
                  flex flex-col items-center justify-center
                  transition-all
                  ${
                    isCurrentMonth
                      ? 'bg-surface-light border-border hover:border-teal hover:bg-teal/10'
                      : 'bg-transparent border-transparent text-gray-700'
                  }
                  ${
                    isToday(date)
                      ? 'ring-1 ring-teal'
                      : ''
                  }
                `}
              >
                <span
                  className={`text-sm font-semibold ${
                    isCurrentMonth
                      ? 'text-white'
                      : 'text-gray-600'
                  }`}
                >
                  {date.getDate()}
                </span>

                {isCurrentMonth && (
                  <span className="mt-2 flex items-center gap-1 text-[10px] text-teal">
                    <CalendarPlus size={11} />
                    Schedule
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <p className="text-xs text-gray-500 text-center mt-5">
          Click any date to create a habit or task for that day.
        </p>
      </div>
    </div>
  )
}