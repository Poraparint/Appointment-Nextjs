"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const EventManager = ({ selectedDate }: { selectedDate: Date }) => {
  const [events, setEvents] = useState<any>({});
  const [eventTexts, setEventTexts] = useState<any>({});
  const supabase = createClient();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await supabase
          .from("APM")
          .select("*")
          .eq("date", selectedDate.toISOString().split("T")[0]);
        const eventsData = data?.reduce((acc: any, event: any) => {
          acc[event.time] = {
            id: event.id,
            name: event.name,
            transaction: event.transaction,
          };
          return acc;
        }, {});
        setEvents(eventsData || {});
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };

    fetchEvents();
  }, [selectedDate]);

  const handleEventSubmit = async (
    time: string,
    name: string,
    transaction: string
  ) => {
    if (!name.trim() || !transaction.trim()) return;

    try {
      const date = selectedDate.toISOString().split("T")[0];
      const { error } = await supabase
        .from("APM")
        .insert({ name, date, time, transaction });

      if (error) throw error;

      setEvents((prevEvents: any) => ({
        ...prevEvents,
        [time]: { name, transaction },
      }));

      setEventTexts((prevTexts: any) => ({
        ...prevTexts,
        [time]: { name: "", transaction: "" },
      }));
    } catch (error) {
      console.error("Error saving event", error);
    }
  };

  const handleDeleteEvent = async (time: string) => {
    const event = events[time];
    if (!event) return;

    try {
      const { error } = await supabase.from("APM").delete().eq("id", event.id);
      if (error) throw error;

      setEvents((prevEvents: any) => {
        const updatedEvents = { ...prevEvents };
        delete updatedEvents[time];
        return updatedEvents;
      });
    } catch (error) {
      console.error("Error deleting event", error);
    }
  };

  const renderEventInputs = () => {
    const times = [
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
    ];

    return times.map((time) => (
      <div key={time} className="box-event flex items-center mb-4">
        <div className="text-3xl tracking-wide mr-4">{time}:</div>
        <div className="calendar-box-input flex items-center w-full">
          <div className="text-[30px] text-center w-[60%] text-gray-800">
            {events[time]?.name || ""}
          </div>
          <div className="box-input-submit w-[40%] flex items-center gap-2">
            {!events[time] && (
              <>
                <input
                  type="text"
                  placeholder="Name"
                  className="border border-gray-300 rounded-md p-2 w-1/2"
                  value={eventTexts[time]?.name || ""}
                  onChange={(e) =>
                    setEventTexts({
                      ...eventTexts,
                      [time]: { ...eventTexts[time], name: e.target.value },
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Transaction"
                  className="border border-gray-300 rounded-md p-2 w-1/2"
                  value={eventTexts[time]?.transaction || ""}
                  onChange={(e) =>
                    setEventTexts({
                      ...eventTexts,
                      [time]: {
                        ...eventTexts[time],
                        transaction: e.target.value,
                      },
                    })
                  }
                />
                <button
                  onClick={() =>
                    handleEventSubmit(
                      time,
                      eventTexts[time]?.name || "",
                      eventTexts[time]?.transaction || ""
                    )
                  }
                  className="btn-calen-add bg-blue-600 text-white rounded-md px-4 py-2 transition duration-300 hover:bg-blue-700"
                >
                  Add
                </button>
              </>
            )}
          </div>
          {events[time] && (
            <button
              onClick={() => handleDeleteEvent(time)}
              className="btn-calen-delete bg-red-600 text-white rounded-md px-4 py-2 transition duration-300 hover:bg-red-700"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="event-manager mt-6 p-4 bg-white rounded-md shadow-md">
      <h3 className="text-xl mb-4">{`Events for ${selectedDate.toDateString()}`}</h3>
      {renderEventInputs()}
    </div>
  );
};

export default EventManager;
