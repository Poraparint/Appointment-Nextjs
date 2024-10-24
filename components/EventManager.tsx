"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const EventManager = ({ selectedDate }: { selectedDate: Date }) => {
  const [events, setEvents] = useState<any>({});
  const [eventTexts, setEventTexts] = useState<any>({});
  const [userId, setUserId] = useState<string | null>(null); // เก็บ user_id
  const supabase = createClient();

  // ดึง user_id ของผู้ใช้ที่ล็อกอินอยู่
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id); // เก็บ user_id
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    if (!userId) return; // ตรวจสอบว่ามี userId ก่อน

    const fetchEvents = async () => {
      try {
        const { data } = await supabase
          .from("APM")
          .select("*")
          .eq("date", selectedDate.toLocaleDateString("sv-SE"))
          .eq("user_id", userId); // กรองข้อมูลเฉพาะของผู้ใช้ที่ล็อกอิน

        const eventsData = data?.reduce((acc: any, event: any) => {
          acc[event.time] = {
            id: event.id,
            name: event.name,
            transaction: event.transaction,
            user_id: event.user_id, // เก็บ user_id ใน event
          };
          return acc;
        }, {});
        setEvents(eventsData || {});
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };

    fetchEvents();
  }, [selectedDate, userId]);

  const handleEventSubmit = async (
    time: string,
    name: string,
    transaction: string
  ) => {
    if (!name.trim() || !transaction.trim() || !userId) return;

    try {
      const date = selectedDate.toLocaleDateString("sv-SE");

      const { error } = await supabase
        .from("APM")
        .insert({ name, date, time, transaction, user_id: userId }); // เก็บ date ในรูปแบบ local

      if (error) throw error;

      setEvents((prevEvents: any) => ({
        ...prevEvents,
        [time]: { name, transaction, user_id: userId },
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
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
    ];

    return times.map((time) => (
      <div key={time} className="box-event mb-4">
        <div className="flex items-center">
          <div className="text-2xl tracking-wide mr-4 px-5">{time}:</div>
          <div className="calendar-box-input flex items-center w-full border p-4 rounded-md bg-gray-50">
            <div className="flex flex-col w-full gap-2">
              {events[time] ? (
                <>
                  <div className="text-xl border border-gray-300 rounded-md p-2 w-full bg-bg">
                    {events[time]?.name}
                  </div>
                  <div className="text-xl border border-gray-300 rounded-md p-2 w-full bg-bg">
                    {events[time]?.transaction}
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(time)}
                    className="bg-danger text-white rounded-md px-4 py-2"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center gap-2 w-full">
                    <input
                      type="text"
                      placeholder="ชื่อ"
                      className="border border-gray-300 rounded-md p-2 w-full bg-bg text-xl"
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
                      className="border border-gray-300 rounded-md p-2 w-full bg-bg text-xl"
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
                  </div>

                  <button
                    onClick={() =>
                      handleEventSubmit(
                        time,
                        eventTexts[time]?.name || "",
                        eventTexts[time]?.transaction || ""
                      )
                    }
                    className="bg-pain text-white rounded-md px-4 py-2"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <hr className="my-3 border-gray-300" />
      </div>
    ));
  };

  return (
    <div className="event-manager py-20 px-5 bg-bg rounded-b-md shadow-md text-text">
      <h3 className="text-2xl mb-5 font-medium">
        {selectedDate.toDateString()}
      </h3>
      {renderEventInputs()}
    </div>
  );
};

export default EventManager;
