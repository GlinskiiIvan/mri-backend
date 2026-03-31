export const dicomDateToISO = (studyDate: string, studyTime: string): string | null => {
  if (!studyDate) return null;

  // Дата
  const year = parseInt(studyDate.slice(0, 4), 10);
  const month = parseInt(studyDate.slice(4, 6), 10) - 1; // JS: 0-11
  const day = parseInt(studyDate.slice(6, 8), 10);

  // Время (по умолчанию 00:00:00)
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (studyTime) {
    hours = parseInt(studyTime.slice(0, 2) || "0", 10);
    minutes = parseInt(studyTime.slice(2, 4) || "0", 10);
    seconds = parseInt(studyTime.slice(4, 6) || "0", 10);
  }

  // Создаём дату в UTC
  const date = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
  return date.toISOString();
}

// Пример использования
const studyDate = "20230807";
const studyTime = "142115";
console.log(dicomDateToISO(studyDate, studyTime)); 
// Вывод: "2023-08-07T14:21:15.000Z"