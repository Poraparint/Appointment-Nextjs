"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client"; // Adjust the path as needed
import EventManager from "@/components/EventManager"; // Import EventManager

interface DateObject {
  dayOfWeek: string;
  day: number;
  date: Date;
}

const Calendar = () => {
  const [dates, setDates] = useState<DateObject[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [today] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [displayMonth, setDisplayMonth] = useState<string>("");
  const calendarContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const generateDates = () => {
      const daysInWeek = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
      ];
      const numberOfDays = new Date(currentYear, currentMonth + 1, 0).getDate();
      const datesArray: DateObject[] = [];

      for (let day = 1; day <= numberOfDays; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dayOfWeek = daysInWeek[date.getDay()];
        datesArray.push({ dayOfWeek, day, date });
      }

      setDates(datesArray);
    };

    generateDates();
  }, [currentMonth, currentYear]);

  useEffect(() => {
    const monthString = new Date(currentYear, currentMonth).toLocaleString(
      "default",
      { month: "long", year: "numeric" }
    );
    setDisplayMonth(monthString);
  }, [currentMonth, currentYear]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) {
      setCurrentYear((prev) => prev + 1);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) {
      setCurrentYear((prev) => prev - 1);
    }
  };

  return (
    <div className="calendar-container text-sec flex flex-col items-center px-10 ">
      <div className="w-full text-text bg-bg rounded-md">
        <div className="">
          <div className="calendar-header flex justify-between items-center p-8 text-2xl">
            <button
              onClick={handlePrevMonth}
              className="px-4 py-2 text-xl flex gap-3 items-center max-sm:text-base"
            >
              <i className="fas fa-caret-left"></i>
              <p className="max-sm:hidden">Previous</p>
            </button>
            <span className="max-sm:text-base">{displayMonth}</span>{" "}
            {/* Display the month here */}
            <button
              onClick={handleNextMonth}
              className="px-4 py-2 text-xl flex gap-3 items-center max-sm:text-base"
            >
              <p className="max-sm:hidden">Next</p>
              <i className="fas fa-caret-right"></i>
            </button>
          </div>
          <hr className="m-5 border-light" />
          <div className="dates-grid flex overflow-x-auto whitespace-nowrap p-3">
            {dates.map(({ dayOfWeek, day, date }) => (
              <div
                key={day}
                className={`date-item p-4 mx-1 text-xl max-sm:text-base rounded-md text-center cursor-pointer transition-all duration-300 ${
                  date.toDateString() === today.toDateString()
                    ? "border-2 border-text"
                    : ""
                }`}
                onClick={() => handleDateClick(date)}
              >
                <div>
                  {dayOfWeek} {day}
                </div>
              </div>
            ))}
          </div>
          <hr className="m-5 border-light" />
        </div>

        {selectedDate && <EventManager selectedDate={selectedDate} />}
      </div>
    </div>
  );
};

export default Calendar;
