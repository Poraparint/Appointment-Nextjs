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

      // Fetch board metadata and data
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

  if (loading) {
    return <div>กำลังโหลดข้อมูล...</div>;
  }

  if (accessDenied) {
    return <div>คุณไม่มีสิทธิ์เข้าถึงบอร์ดนี้</div>;
  }

  if (!boardData) {
    return <div>ไม่พบข้อมูลบอร์ดนี้</div>;
  }
  
  // Function to generate calendar dates
  const generateDates = () => {
    const daysInWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const numberOfDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const datesArray: DateObject[] = [];

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
        <div className="bg-bg rounded-md p-5 flex flex-col gap-2 text-text">
          <h1 className="font-semibold text-3xl my-3">
            {boardData.board_name}
          </h1>
          {boardData?.description ? (
            <p className="text-gray-500 text-lg flex text-center max-sm:text-sm">
              {boardData.description}
            </p>
          ) : (
            <p className="text-gray-500 text-lg flex text-center max-sm:text-sm"></p>
          )}
          <hr className="border-light my-3" />
          <BoardMemberInfo
            creatorUsername={boardData.users?.username}
            members={members}
            loading={loading}
          />
        </div>

        {/* Calendar and Event Management */}
        <div className="calendar-container text-sec flex flex-col items-center">
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
                <span className="max-sm:text-base">{displayMonth}</span>
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
                    className={`date-item p-4 mx-1 text-xl max-sm:text-base rounded-md text-center cursor-pointer transition-all duration-100 hover:bg-gray-100 ${
                      date.toDateString() === today?.toDateString()
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

            {/* Event Management for selected date */}
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
      <Footer />
    </div>
  );
};

export default AppointmentBoard;
