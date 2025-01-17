function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0"); // День с ведущим нулем
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяц с ведущим нулем
  const year = date.getFullYear(); // Год
  return `${day}-${month}-${year}`; // Формат ДД-ММ-ГГГГ
}

function generateSchedule() {
  const startDateInput = document.getElementById("start-date").value;
  const intervalDaysInput = document.getElementById("interval-days").value; // Интервал дней
  const person1 = document.getElementById("person1").value;
  const person2 = document.getElementById("person2").value;

  const scheduleTable = document.querySelector("#schedule-table tbody");
  scheduleTable.innerHTML = ""; // Очистка таблицы

  const interval = parseInt(intervalDaysInput, 10); // Преобразуем интервал в число
  let currentDate = new Date(startDateInput);
  const endDate = new Date(currentDate); // Создаем копию начальной даты
  endDate.setFullYear(currentDate.getFullYear() + 1); // Добавляем 12 месяцев

  let toggle = true; // Переключатель для чередования статусов

  while (currentDate < endDate) {
    const row1 = document.createElement("tr");
    const dateCell = document.createElement("td");
    dateCell.textContent = formatDate(currentDate); // Преобразование даты
    dateCell.rowSpan = 2; // Объединение строк для даты
    dateCell.className = "date-cell";
    dateCell.contentEditable = "true"; // Делаем дату редактируемой
    row1.appendChild(dateCell);

    // Добавляем данные для первой строки
    const person1Cell = document.createElement("td");
    person1Cell.textContent = toggle ? person1 : person2;
    person1Cell.className = "name-cell";
    row1.appendChild(person1Cell);

    const status1Cell = document.createElement("td");
    status1Cell.textContent = "ON";
    status1Cell.className = "status on";
    row1.appendChild(status1Cell);

    scheduleTable.appendChild(row1);

    // Добавляем данные для второй строки
    const row2 = document.createElement("tr");
    const person2Cell = document.createElement("td");
    person2Cell.textContent = toggle ? person2 : person1;
    person2Cell.className = "name-cell";
    row2.appendChild(person2Cell);

    const status2Cell = document.createElement("td");
    status2Cell.textContent = "OFF";
    status2Cell.className = "status off";
    row2.appendChild(status2Cell);

    scheduleTable.appendChild(row2);

    // Переключаем статус для следующей даты
    toggle = !toggle;

    // Увеличиваем текущую дату на указанный интервал
    currentDate.setDate(currentDate.getDate() + interval);
  }
}


function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  // Устанавливаем цвет фона (RGB или HEX)
  pdf.setFillColor(0, 238, 255); // Светло-серый фон
  pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'F'); // Заливка всей страницы
  pdf.text("Work Schedule", 20, 10);

  pdf.autoTable({
    html: "#schedule-table", // Берем данные из HTML таблицы
    startY: 20,
    styles: {
      lineColor: [17, 0, 246], // Цвет рамки (#1700F6)
      lineWidth: 0.5,
      fillColor: [240, 240, 240], // Общий цвет фона
      textColor: [0, 0, 0], // Цвет текста
      fontSize: 10, // Размер шрифта
      cellPadding: 2, // Отступ внутри ячеек
      fontStyle: 'bolditalic',
      halign: 'center', // Центрирование текста в колонке
      valign: 'middle', // Вертикальное выравнивание по центру
    },
    headStyles: {
      fillColor: [255, 96, 0], // Оранжевый фон заголовков (#FF6000)
      textColor: [0, 0, 0], // Белый текст
      fontSize: 12, // Размер шрифта в заголовках
    },
    alternateRowStyles: {
      fillColor: [220, 230, 241], // Светло-голубой цвет чередующихся строк
    },
    columnStyles: {
      // Настройка для колонки с текстом "status"
      0: { // Индекс колонки (нумерация начинается с 0)
        fillColor: [255, 250, 192],
      },
      1: { // Индекс колонки (нумерация начинается с 0)
        halign: 'left', // Горизонтальное центрирование
        valign: 'middle', // Вертикальное центрирование
        fillColor: [206, 216, 105],
      },
    },
  });

  pdf.save("schedule.pdf");
}

function printTable() {
  // Получаем HTML-код таблицы
  const tableHTML = document.getElementById("schedule-table").outerHTML;

  // Создаем новое окно для печати
  const printWindow = window.open("", "_blank");

  // Заполняем содержимое нового окна
  printWindow.document.open();
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Poppins", sans-serif;
        }
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          background-color: #00eeff;
          color-adjust: exact; /* Поддержка в Safari */
          -webkit-print-color-adjust: exact; /* Поддержка в Webkit */
          print-color-adjust: exact; /* Общая поддержка */
        }
        h1 {
          text-align: center;
          font-size: 2rem; /* Увеличенный размер текста */
          color: #333333;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-spacing: 0;
          margin: 0 auto;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        th,
        td {
          font-size: 16px;
          padding: 5px;
          text-align: center;
          border: 1px solid #000000;
        }
        th {
          background-color: #ff6000;
          color: #000000;
        }
        td {
          background-color: #ced869;
        }
        .date-cell {
          text-align: center;
          vertical-align: middle;
          font-weight: bold;
          background-color: #fffac0;
        }
        .name-cell {
          font-weight: 600;
        }
        .status.on {
          background-color: #F44336;
          color: black;
          font-weight: bold;
        }
        .status.off {
          background-color: #4CAF50;
          color: black;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <h1>Work Schedule</h1> <!-- Добавляем заголовок -->
      ${tableHTML} <!-- Вставляем таблицу -->
    </body>
    </html>
  `);

  printWindow.document.close();

  // Запускаем печать
  printWindow.print();
}





window.onload = generateSchedule;