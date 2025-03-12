"use client";

import { createClient } from "@/utils/supabase/client";

import { useState, useEffect, Suspense } from "react";

import { fetchBoardData, fetchBoardMetadata } from "@/lib/fetchBoardData";
import EventManager from "../components/EventManager";
import Footer from "@/components/Footer";

//Components

import BoardMemberInfo from "../components/BoardMemberInfo";

// Define a custom type for `PageProps` to handle asynchronous `params`
type PageProps = {
  params: Promise<{ id: string }>;
};

const AppointmentBoard = ({ params }: PageProps) => {
  const [userId, setUserId] = useState<string | null>(null); // Store userId
  const [boardData, setBoardData] = useState<any>(null); // Store board data
  const [members, setMembers] = useState<any[]>([]); // Store members
  const [loading, setLoading] = useState(true); // Loading state
  const [dates, setDates] = useState<DateObject[]>([]); // Store calendar dates
  const [currentMonth, setCurrentMonth] = useState<number>(0);
  const [currentYear, setCurrentYear] = useState<number>(0);
  const [today, setToday] = useState<Date | null>(null); // Use useEffect to set today date on client-side
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [displayMonth, setDisplayMonth] = useState<string>("");
  const [metadata, setMetadata] = useState({ title: "Appointment Board" }); // State for metadata
  const [accessDenied, setAccessDenied] = useState(false);
  const supabase = createClient();

  // Fetch user session
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data?.session?.user) {
        setAccessDenied(true);
        return;
      }
      setUserId(data.session.user.id);
    };

    fetchUser();
  }, []);

  // Fetch metadata and board data
  useEffect(() => {
    const fetchData = async () => {
      const resolvedParams = await params;
      const boardId = resolvedParams.id;

      if (!userId) return; // Wait until userId is available

      const metadataResult = await fetchBoardMetadata(boardId);
      const boardResult = await fetchBoardData(boardId);

      // Check if user is a member or creator
      const { data: memberCheck, error } = await supabase
        .from("board_members")
        .select("user_id")
        .eq("board_id", boardId)
        .eq("user_id", userId);

      if (
        error ||
        (!memberCheck.length && boardResult?.creator_id !== userId)
      ) {
        setAccessDenied(true);
        return;
      }

      setMetadata(metadataResult);
      setBoardData(boardResult);
      fetchBoardMembers(boardId);
      setLoading(false);

      if (boardResult) {
        fetchBoardMembers(boardResult.id); // Fetch board members after getting board data
      }
    };

    fetchData();
  }, [params, userId]);

  // Function to fetch board members
  const fetchBoardMembers = async (boardId: string) => {
    const { data, error } = await supabase
      .from("board_members")
      .select("user_id, users(username, avatar_url)") // Fetch members of the board
      .eq("board_id", boardId);

    if (error) {
      console.error("Error fetching board members:", error);
      return;
    }

    setMembers(data); // Update board members
  };



  if (accessDenied) {
    return <div>คุณไม่มีสิทธิ์เข้าถึงบอร์ดนี้</div>;
  }

  

  // Function to generate calendar dates
  const generateDates = () => {
    const daysInWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const numberOfDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const datesArray: DateObject[] = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      datesArray.push({ dayOfWeek: "", day: -1, date: new Date(0) }); // Use -1 or a dummy date for empty cells
    }

    for (let day = 1; day <= numberOfDays; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dayOfWeek = daysInWeek[date.getDay()];
      datesArray.push({ dayOfWeek, day, date });
    }

    setDates(datesArray);
  };

  // Set current month and year and today's date on client side
  useEffect(() => {
    const todayDate = new Date();
    setCurrentMonth(todayDate.getMonth());
    setCurrentYear(todayDate.getFullYear());
    setToday(todayDate); // Set today date only on client side
  }, []);

  // Generate calendar dates whenever month or year changes
  useEffect(() => {
    if (today) {
      generateDates();
    }
  }, [currentMonth, currentYear, today]);

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

  if (loading) {
    return <div>กำลังโหลดข้อมูล...</div>;
  }

  if (!boardData) {
    return <div>ไม่พบข้อมูลบอร์ดนี้</div>;
  }

  return (
    <div className="w-full">
      <div className="appointment-board px-10 max-sm:px-3 flex flex-col gap-5 w-full">
        {/* Calendar and Event Management */}
        <div className="calendar-container flex flex-col items-center">
          <div className="w-full text-text flex gap-5 max-xl:flex-col">
            <div className="xl:w-8/12 w-full xl:border">
              <div className="bg-bg shadow-md rounded-md xl:sticky top-2 flex flex-col">
                <div className="calendar-header flex justify-between items-center p-8 text-2xl ">
                  <span className="text-2xl max-sm:text-xl font-semibold">
                    {displayMonth}
                  </span>
                  <div className="flex">
                    <button
                      onClick={handlePrevMonth}
                      className="px-5 py-3 flex gap-3 items-center max-sm:text-base border border-text rounded-l-md hover:bg-gray-100"
                    >
                      <i className="fas fa-caret-left text-2xl"></i>
                    </button>
                    <button
                      onClick={handleNextMonth}
                      className="px-5 py-3 flex gap-3 items-center max-sm:text-base border border-text rounded-r-md hover:bg-gray-100"
                    >
                      <i className="fas fa-caret-right text-2xl"></i>
                    </button>
                  </div>
                </div>
                <hr className="m-2 border-light" />
                <div className="grid grid-cols-7 gap-2 p-3 max-sm:gap-0 text-center text-2xl font-medium max-sm:text-lg">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day, index) => (
                      <div key={index} className=" flex items-center justify-center">
                        {day}
                      </div>
                    )
                  )}
                </div>
                <div className="grid grid-cols-7 gap-2 px-3 pb-9 max-sm:gap-0">
                  {dates.map(({ day, date }, index) => (
                    <div
                      key={index}
                      className={`p-3 w-24 h-24 justify-center items-center flex text-2xl rounded-full cursor-pointer transition-all border-2 text-text max-sm:text-lg ${
                        day === -1 // Check for -1
                          ? "border-transparent cursor-default" // If day is -1, disable clicking and hide content
                          : date?.toDateString() === today?.toDateString()
                            ? "border-text bg-text text-white"
                            : selectedDate?.toDateString() ===
                                date?.toDateString()
                              ? "bg-pain text-white border-pain"
                              : "hover:bg-gray-200 border-transparent"
                      }`}
                      onClick={() => day !== -1 && handleDateClick(date)} // Disable click if day is -1
                    >
                      {day !== -1 && day !== 0 && (
                        <>
                          <span>{day}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Event Management for selected date */}
            <div className="bg-bg rounded-md w-4/12 shadow-md text-text max-xl:w-full">
              {selectedDate && (
                <Suspense fallback={<div>กำลังโหลดเหตุการณ์...</div>}>
                  <EventManager
                    selectedDate={selectedDate}
                    boardId={boardData.id}
                  />
                </Suspense>
              )}
            </div>
          </div>
        </div>
        <div className="bg-bg rounded-md p-5 flex flex-col gap-2 text-text shadow-md">
          <BoardMemberInfo
            creatorUsername={boardData.users?.username}
            members={members}
            loading={loading}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AppointmentBoard;
