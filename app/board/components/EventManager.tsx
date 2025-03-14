"use client";

import FormatDate from "@/components/FormatDate";
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
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUserId(user.id);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    if (!userId || !boardId || !selectedDate) return;

    const fetchEvents = async () => {
      try {
        // Reset events state ก่อนโหลดข้อมูลใหม่
        setEvents({});

        // Step 1: ดึงข้อมูลจาก APM
        const { data: apmData, error: apmError } = await supabase
          .from("APM")
          .select("id, name, date, transaction, tel, time, user_id")
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
            tel: event.tel,
            user_id: event.user_id,
            username: userMap?.[event.user_id] || "Unknown",
          };
          return acc;
        }, {});

        setEvents(eventsData || {});
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [selectedDate, userId, boardId]); // เพิ่ม selectedDate เป็น dependency

  const handleEventSubmit = async (
    time: string,
    name: string,
    transaction: string,
    tel: string
  ) => {
    if (
      !name.trim() ||
      !transaction.trim() ||
      !tel.trim() ||
      !userId ||
      !boardId
    )
      return;

    try {
      const date = selectedDate.toLocaleDateString("sv-SE");

      const { error } = await supabase.from("APM").insert({
        name,
        date,
        time,
        tel,
        transaction,
        user_id: userId,
        board_id: boardId, // Add board_id when inserting
      });

      if (error) throw error;

      setEvents((prevEvents: any) => ({
        ...prevEvents,
        [time]: { name, transaction, tel, user_id: userId },
      }));

      setEventTexts((prevTexts: any) => ({
        ...prevTexts,
        [time]: { name: "", transaction: "", tel: "" },
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
      title: "แน่ใจนะ?",
      text: "ยืนยันที่จะลบรายการทั้งหมดของวันนี้?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ยืนยันที่จะลบทั้งหมด",
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
      "17:30"
    ];

    return times.map((time) => {
      const hasEvent = !!events[time];
      return (
        <div
          key={time}
          className={`relative flex items-center mb-1 gap-4 p-4 transition-all duration-300 ease-in-out transform ${
            hasEvent
              ? "border-2 border-pain text-text rounded-md"
              : "border-b border-light"
          } hover:bg-gray-100`}
        >
          <div className="text-2xl font-medium border-r border-light pr-3 text-center">
            {time}
          </div>

          <div className="flex-grow flex flex-col gap-3">
            {hasEvent ? (
              <>
                <div className="flex justify-between">
                  <div className="text-xl font-semibold">
                    {events[time]?.name}
                  </div>
                  <div className="text-xl font-semibold text-gray-600">
                    Tel: {events[time]?.tel}
                  </div>
                </div>
                <div className="text-lg">: {events[time]?.transaction}</div>

                <div className="text-sm text-gray-500">
                  เพิ่มโดย: {events[time]?.username}
                </div>

                <button
                  onClick={() => handleDeleteEvent(time)}
                  className="absolute bottom-3 right-3 text-red-400 hover:text-red-600 transition-colors duration-200"
                  aria-label="Delete Event"
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
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-all duration-200"
              >
                เพิ่มรายการ
              </button>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="event-manager pb-20 bg-bg rounded-md shadow-md text-text">
      <div className="flex justify-between bg-gradient-to-r rounded-t-md from-pain to-indigo-600 p-9">
        <div className="text-2xl text-white ">
          {selectedDate.toDateString()}
        </div>
        <div className="flex items-center justify-center">
          <button
            onClick={handleDeleteAllEvents}
            className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md border border-red-700 transition-colors duration-200 shadow-sm"
          >
            ลบทั้งหมด
          </button>
        </div>
      </div>

      <div className="p-5">{renderEventInputs()}</div>

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
                  placeholder="รายชื่อ..."
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
                  placeholder="รายละเอียด..."
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
                <input
                  type="text"
                  placeholder="เบอร์โทร... (ถ้าไม่มีให้ใส่ - )"
                  className="border border-text rounded-md p-2 w-full bg-bg text-xl"
                  value={eventTexts[selectedTime]?.tel || ""}
                  onChange={(e) =>
                    setEventTexts({
                      ...eventTexts,
                      [selectedTime]: {
                        ...eventTexts[selectedTime],
                        tel: e.target.value,
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
                      eventTexts[selectedTime]?.transaction || "",
                      eventTexts[selectedTime]?.tel || ""
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
