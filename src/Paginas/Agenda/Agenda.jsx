import React, { useState, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from "date-fns";
import { FiChevronLeft, FiChevronRight, FiCalendar, FiX, FiPlus } from "react-icons/fi";
import { events } from "@/constants";
import { db, auth } from '../../Services/FirebaseConfig'
import { collection, doc, getDocs, setDoc, query } from 'firebase/firestore';

const Agenda = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [allEvents, setAllEvents] = useState(events);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState("");
  const eventsCollection = collection(db, 'events');
  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const userId = user.uid;
        const eventsRef = collection(db, `users/${userId}/events`);
        const q = query(eventsRef);
        getDocs(q).then((querySnapshot) => {
          const events = [];
          querySnapshot.forEach((doc) => {
            events.push({
              id: doc.id,
              title: doc.data().title,
              date: doc.data().date,
            });
          });
          setAllEvents(events);
        });
      } else {
        console.log('Usuário não autenticado');
      }
    });
    return unsubscribe;
  }, []);


  const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const dateStr = format(date, "yyyy-MM-dd");
    const dayEvents = allEvents.filter((event) => event.date === dateStr);
    setIsModalOpen(true);
  };

  const handleAddEvent = async () => {
    if (newEvent.trim()) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const userId = auth.currentUser.uid;
      const eventRef = doc(db, `users/${userId}/events/${dateStr}`);
      await setDoc(eventRef, {
        title: newEvent,
        date: dateStr,
      });
      setNewEvent("");
      setIsModalOpen(false);
      // Atualize a lista de eventos
      const eventsRef = collection(db, `users/${userId}/events`);
      const q = query(eventsRef);
      getDocs(q).then((querySnapshot) => {
        const events = [];
        querySnapshot.forEach((doc) => {
          events.push({
            id: doc.id,
            title: doc.data().title,
            date: doc.data().date,
          });
        });
        setAllEvents(events);
      });
    }
  };
  

  const EventModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            Add Event for {format(selectedDate, "MMMM d, yyyy")}
          </h3>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>
        <input
          type="text"
          value={newEvent}
          onChange={(e) => setNewEvent(e.target.value)}
          placeholder="Enter event description"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleAddEvent}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Event
          </button>
        </div>
        <div className="mt-4">
          <h4 className="text-lg font-semibold">Existing Events:</h4>
          <ul>
            {allEvents
              .filter((event) => event.date === format(selectedDate, "yyyy-MM-dd"))
              .map((event, index) => (
                <li key={index}>{event.title}</li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="title">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setSelectedDate(new Date());
                setIsModalOpen(true);
              }}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
            >
              <FiPlus className="mr-2" /> Adicionar Evento
            </button>
            <button
              onClick={handleToday}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            >
              <FiCalendar className="mr-2" /> Hoje
            </button>
            <button
              onClick={handlePreviousMonth}
              className="p-2 rounded hover:bg-gray-100"
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded hover:bg-gray-100"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-gray-600 py-2"
            >
              {day}
            </div>
          ))}
          {days.map((day) => {
  const dateStr = format(day, "yyyy-MM-dd");
  const dayEvents = allEvents.filter((event) => event.date === dateStr);
  return (
    <div
      key={day.toString()}
      onClick={() => handleDateClick(day)}
      className={`card ${isSameMonth(day, currentDate)
          ? "bg-white hover:bg-gray-50"
          : "bg-gray-50 text-gray-400"}`}
    >
      <div className="text-right">{format(day, "d")}</div>
      <div className="mt-1">
        {dayEvents.map((event, index) => (
          <div
            key={index}
            className="text-xs bg-blue-100 text-blue-700 p-1 rounded mb-1 truncate"
          >
            {event.title}
          </div>
        ))}
      </div>
    </div>
  );
})}
        </div>
      </div>
      {isModalOpen && <EventModal />}
    </div>
  );
};

export default Agenda;