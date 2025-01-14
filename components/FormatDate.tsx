import React from "react";

interface FormatDateProps {
  dateString: string | undefined;
}

const FormatDate: React.FC<FormatDateProps> = ({ dateString }) => {
  if (!dateString) return null;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // เดือนเริ่มจาก 0
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return <>{formatDate(dateString)}</>;
};

export default FormatDate;
