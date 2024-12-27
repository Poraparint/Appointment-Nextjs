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
        // Step 1: ดึงข้อมูลจาก APM
        const { data: apmData, error: apmError } = await supabase
          .from("APM")
          .select("id, name, date, transaction, time, user_id")
          .eq("date", selectedDate.toLocaleDateString("sv-SE"))
          .eq("board_id", boardId);

        if (apmError) {
          console.error("Error fetching APM data:", apmError);
          return;
        }

        if (!apmData || apmData.length === 0) {
          setEvents({});
          return;
        }

        // สร้าง Set ของ user_id ที่ต้องดึงข้อมูล
        const userIds = Array.from(
          new Set(apmData.map((event) => event.user_id))
        );

        // Step 2: ดึงข้อมูล username จาก users
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id, username")
          .in("id", userIds);

        if (userError) {
          console.error("Error fetching users data:", userError);
          return;
        }

        // Mapping user_id -> username
        const userMap = userData?.reduce((acc: any, user: any) => {
          acc[user.id] = user.username;
          return acc;
        }, {});

        // Step 3: รวมข้อมูล APM และ Users
        const eventsData = apmData.reduce((acc: any, event: any) => {
          acc[event.time] = {
            id: event.id,
            name: event.name,
            transaction: event.transaction,
            user_id: event.user_id,
            username: userMap?.[event.user_id] || "Unknown", // ดึง username จาก userMap
          };
          return acc;
        }, {});

        setEvents(eventsData || {});
      } catch (error) {
        console.error("Error fetching events:", error);
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
      title: "แน่ใจนะ?",
      text: "ยืนยันที่จะลบรายการนี้?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ยืนยันที่จะลบ",
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

  const handleDeleteAllEvents = async () => {
    if (!selectedDate || !boardId) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete all events for this date?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete all!",
    });

    if (result.isConfirmed) {
      try {
        const date = selectedDate.toLocaleDateString("sv-SE");

        // Delete all events for the selected date and boardId
        const { error } = await supabase
          .from("APM")
          .delete()
          .eq("date", date)
          .eq("board_id", boardId);

        if (error) throw error;

        // Clear events state
        setEvents({});

        // Show success toast
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
          title: "All events deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting all events:", error);
        Swal.fire("Error", "There was an error deleting all events.", "error");
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
          className={`border rounded-md flex items-center gap-4 p-4 mb-5 transition-all duration-300 ease-in-out transform ${
            hasEvent ? "bg-gray-100 border-text" : "border-light "
          }`}
        >
          <div className="flex-shrink-0 text-xl font-medium text-text w-16 text-center border-r border-text">
            {time}
          </div>
          

          <div className="tracking-wide flex-grow flex flex-col gap-2">
            {hasEvent ? (
              <>
                <div className="text-2xl font-semibold text-text">
                  {events[time]?.name}
                </div>
                <div className="text-lg text-gray-600">
                  : {events[time]?.transaction}
                </div>
                <div className="text-base text-gray-500 mt-5 ">
                  เพิ่มโดย : {events[time]?.username}
                </div>

                <div className="flex flex-col items-end absolute right-3 ">
                  <button
                    onClick={() => handleDeleteEvent(time)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <i className="fa-solid fa-trash"></i> Delete
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => {
                  setSelectedTime(time);
                  setShowModal(true);
                }}
                className="py-3 px-6 text-lg text-bg bg-pain hover:bg-purple-900 rounded-md shadow-md transition-all duration-300 transform"
              >
                Add Event
              </button>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="event-manager pb-20 px-5 bg-bg rounded-b-md shadow-md text-text">
      <div className="flex justify-around">
        <div className="border border-text rounded-md text-2xl text-text w-max px-6 py-3">
        {selectedDate.toDateString()}
      </div>
      <button
        onClick={handleDeleteAllEvents}
        className="py-2 px-4 bg-red-500 border border-text text-white rounded-md hover:bg-red-700 transition-all duration-300"
      >
        <i className="fa-solid fa-trash"></i> Delete All Events
      </button></div>
      
      <hr className="border-light my-5" />
      {renderEventInputs()}

      {showModal && selectedTime && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="modal modal-open">
            <div className="modal-box bg-bg text-text">
              <h2 className="text-3xl text-pain mt-2">เพิ่มกิจกรรม</h2>
              <p className="text-xl my-5">
                เวลา: <span className="font-semibold">{selectedTime}</span>
              </p>
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
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={() =>
                    handleEventSubmit(
                      selectedTime,
                      eventTexts[selectedTime]?.name || "",
                      eventTexts[selectedTime]?.transaction || ""
                    )
                  }
                  className="btn bg-pain text-bg border-bg hover:bg-purple-900"
                >
                  เพิ่มกิจกรรม
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
