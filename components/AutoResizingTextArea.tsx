// AutoResizingTextarea.tsx
import { useRef, useEffect } from "react";

const AutoResizingTextarea = ({ detail }: { detail: string }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // รีเซ็ตความสูงก่อน
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // ปรับความสูงตามเนื้อหา
    }
  }, [detail]); // ทำงานเมื่อเนื้อหามีการเปลี่ยนแปลง

  return (
    <textarea
      ref={textareaRef}
      className="text-third font-light p-2 outline-none bg-bg tracking-wide text-lg"
      readOnly
      value={detail}
    />
  );
};

export default AutoResizingTextarea;
