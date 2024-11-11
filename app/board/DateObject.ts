interface DateObject {
  dayOfWeek: string; // ชื่อของวันในสัปดาห์ (เช่น "Mon", "Tue", ...)
  day: number; // วันที่ (1-31)
  date: Date; // วันที่ (Date object)
  formattedDate?: string; // วันในรูปแบบสตริง (ใช้เพื่อการแสดงผลหรือเปรียบเทียบ)
}
