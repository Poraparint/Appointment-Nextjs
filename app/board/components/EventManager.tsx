"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Swal from "sweetalert2";

interface EventManagerProps {
  selectedDate: Date;
  boardId: string; // ค่าที่รับมาจะเป็น string
}

const EventManager: React.FC<EventManagerProps> = ({
  selectedDate,
  boardId,
}) => {
  const [events, setEvents] = useState<any>({});
  const [eventTexts, setEventTexts] = useState<any>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    if (!userId || !boardId || !selectedDate) return;

    const fetchEvents = async () => {
      try {
        const { data } = await supabase
          .from("APM")
          .select("*")
          .eq("date", selectedDate.toLocaleDateString("sv-SE"))
          .eq("board_id", boardId) // Filter by boardId

        const eventsData = data?.reduce((acc: any, event: any) => {
          acc[event.time] = {
            id: event.id,
            name: event.name,
            transaction: event.transaction,
            user_id: event.user_id,
          };
          return acc;
        }, {});
        setEvents(eventsData || {});
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };

    fetchEvents();
  }, [selectedDate, userId, boardId]);

  const handleEventSubmit = async (
    time: string,
    name: string,
    transaction: string
  ) => {
    if (!name.trim() || !transaction.trim() || !userId || !boardId) return;

    try {
      const date = selectedDate.toLocaleDateString("sv-SE");

      const { error } = await supabase.from("APM").insert({
        name,
        date,
        time,
        transaction,
        user_id: userId,
        board_id: boardId, // Add board_id when inserting
      });

      if (error) throw error;

      setEvents((prevEvents: any) => ({
        ...prevEvents,
        [time]: { name, transaction, user_id: userId },
      }));

      setEventTexts((prevTexts: any) => ({
        ...prevTexts,
        [time]: { name: "", transaction: "" },
      }));

      setShowModal(false);
    } catch (error) {
      console.error("Error saving event", error);
    }
  };

  const handleDeleteEvent = async (time: string) => {
    const event = events[time];
    if (!event) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this event?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase
          .from("APM")
          .delete()
          .eq("id", event.id)
          .eq("board_id", boardId); // Make sure we are deleting only from the correct board
        if (error) throw error;

        setEvents((prevEvents: any) => {
          const updatedEvents = { ...prevEvents };
          delete updatedEvents[time];
          return updatedEvents;
        });

        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: "success",
          title: "Event deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting event", error);
        Swal.fire("Error", "There was an error deleting the event.", "error");
      }
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

    return times.map((time) => {
      const hasEvent = !!events[time];
      return (
        <div
          key={time}
          className={`border flex items-center tracking-wider gap-1 text-xl mb-5 rounded-md ${
            hasEvent
              ? "bg-gray-100 border-pain text-pain"
              : "border-text text-text"
          }`}
        >
          <div className="border-r px-5 py-5 my-1 text-2xl max-sm:text-xl">
            {time}
          </div>
          <div className="w-full">
            <div className="flex w-full gap-2 justify-between">
              {hasEvent ? (
                <>
                  <div className="flex flex-col w-full px-4 gap-4 my-5">
                    <div className="text-3xl max-sm:text-xl">
                      {events[time]?.name}
                    </div>
                    <div className="text-2xl font-light max-sm:text-lg">
                      : {events[time]?.transaction}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(time)}
                    className="border-l px-3 border-pain"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setSelectedTime(time);
                    setShowModal(true);
                  }}
                  className="py-6 rounded-md hover:bg-slate-100 duration-75 w-full"
                >
                  Add Event
                </button>
              )}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="event-manager pb-20 px-5 bg-bg rounded-b-md shadow-md text-text">
      <div className="border border-text rounded-md text-2xl text-text w-max px-6 py-3">
        {selectedDate.toDateString()}
      </div>
      <hr className="border-light my-5" />
      {renderEventInputs()}

      {showModal && selectedTime && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="modal modal-open">
            <div className="modal-box bg-bg text-text">
              <h2 className="text-3xl mb-7 text-pain mt-2">เพิ่มกิจกรรม</h2>
              <div className="flex flex-col gap-5">
                <input
                  type="text"
                  placeholder="กรอกชื่ออีเว้นท์..."
                  className="border border-text rounded-md p-2 w-full bg-bg text-xl"
                  value={eventTexts[selectedTime]?.name || ""}
                  onChange={(e) =>
                    setEventTexts({
                      ...eventTexts,
                      [selectedTime]: {
                        ...eventTexts[selectedTime],
                        name: e.target.value,
                      },
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="กรอกรายละเอียด..."
                  className="border border-text rounded-md p-2 w-full bg-bg text-xl"
                  value={eventTexts[selectedTime]?.transaction || ""}
                  onChange={(e) =>
                    setEventTexts({
                      ...eventTexts,
                      [selectedTime]: {
                        ...eventTexts[selectedTime],
                        transaction: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="modal-action">
                <button
                  onClick={() =>
                    handleEventSubmit(
                      selectedTime,
                      eventTexts[selectedTime]?.name || "",
                      eventTexts[selectedTime]?.transaction || ""
                    )
                  }
                  className="btn btn-primary"
                >
                  เพิ่มกิจกรรม
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManager;
