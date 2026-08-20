import { useState } from 'react'
import {
  Sparkles,
  CheckSquare,
  Trash2,
  CalendarDays,
} from 'lucide-react'

import { useGame } from '../game/GameContext.jsx'
import HabitItem from '../components/HabitItem.jsx'
import AddHabitModal from '../components/AddHabitModal.jsx'
import ScheduleCalendarModal from '../components/ScheduleCalendarModal.jsx'

export default function Habits() {
  const {
    habits,
    toggleHabit,
    updateHabitTimer,
    updateHabitNumeric,
    removeHabit,
  } = useGame()

  const [modalOpen, setModalOpen] =
    useState(false)

  const [modalKind, setModalKind] =
    useState('habit')

  const [scheduleOpen, setScheduleOpen] =
    useState(false)

  const [scheduledDate, setScheduledDate] =
    useState(null)

  function openModal(kind, date = null) {
    setModalKind(kind)
    setScheduledDate(date)
    setModalOpen(true)
  }

  function handleScheduleDate(date) {
    setScheduleOpen(false)

    // Open task creation for the selected date.
    openModal('task', date)
  }

  return (
    <div className="max-w-3xl">
      {/* Page heading */}
      <h1 className="text-2xl font-bold mb-1">
        Your quests
      </h1>

      <p className="text-gray-400 text-sm mb-6">
        Add, edit, and organize the habits and tasks you're building.
      </p>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3 mb-6">
        {/* Schedule */}
        <button
          onClick={() => setScheduleOpen(true)}
          className="flex items-center gap-1.5 bg-surface border border-border text-white font-semibold text-sm px-4 py-2.5 rounded-lg hover:border-teal hover:text-teal hover:-translate-y-0.5 transition-all duration-200"
        >
          <CalendarDays size={16} />
          Schedule
        </button>

        {/* New habit */}
        <button
          onClick={() => openModal('habit')}
          className="flex items-center gap-1.5 bg-teal text-bg font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-teal-light hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          <Sparkles size={16} />
          New habit
        </button>

        {/* New task */}
        <button
          onClick={() => openModal('task')}
          className="flex items-center gap-1.5 bg-gold text-bg font-semibold text-sm px-4 py-2.5 rounded-lg hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          <CheckSquare size={16} />
          New task
        </button>
      </div>

      {/* Schedule calendar */}
      <ScheduleCalendarModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        onSelectDate={handleScheduleDate}
      />

      {/* Add habit/task */}
      <AddHabitModal
        open={modalOpen}
        initialKind={modalKind}
        scheduledDate={scheduledDate}
        onClose={() => {
          setModalOpen(false)
          setScheduledDate(null)
        }}
      />

      {/* HABIT LIST */}
      <div className="flex flex-col gap-3">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="group relative"
          >
            <HabitItem
              habit={habit}
              onToggle={() =>
                toggleHabit(habit.id)
              }
              onUpdateTimer={
                updateHabitTimer
              }
              onUpdateNumeric={
                updateHabitNumeric
              }
            />

            {/* Delete */}
            <button
              onClick={() =>
                removeHabit(habit.id)
              }
              aria-label={`Delete ${habit.title}`}
              className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-surface border border-border text-gray-500 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:text-red-400 hover:border-red-400/40 hover:scale-110 transition-all duration-150"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}

        {habits.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8">
            No quests yet. Add your first one above.
          </p>
        )}
      </div>
    </div>
  )
}