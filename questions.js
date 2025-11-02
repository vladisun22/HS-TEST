// Универсальный банк вопросов
// Поддерживает:
//  - текстовые вопросы (options: [...], correct: индекс)
//  - текст + картинка (qImg: "img/xxx.jpg")
//  - варианты-изображения (type: "imageOptions", options: [{img, alt}], correct: индекс)

window.QUESTION_BANK = [

  // --- С фото в вопросе ---


 { q: "Что изображено на фото?",
    qImg: "img/fuse.png",
    options: ["Конденсатор", "Резистор", "Транзистор", "Предохранитель"],
    correct: 3 },


  // --- С фото-ответами (4 картинки) ---
  { q: "Выберите QR код",
    type: "imageOptions",
    options: [
      { img: "img/q1.png", alt: "A" },
      { img: "img/q2.png", alt: "B" },
      { img: "img/q3.png", alt: "C" },
      { img: "img/q4.png", alt: "D" }
    ],
    correct: 3 },


  { q: "Какой режим используется для проверки целостности цепей с помощью Мультиметра ?",
    type: "imageOptions",
    options: [
      { img: "img/V+.png", alt: "A" },
      { img: "img/V-.png", alt: "B" },
      { img: "img/Om.png", alt: "C" },
      { img: "img/11111.png", alt: "D" }
    ],
    correct: 3 },


{ q: "Выберите Транзистор",
    type: "imageOptions",
    options: [
      { img: "img/diod.png", alt: "A" },
      { img: "img/rez.png", alt: "B" },
      { img: "img/kon.png", alt: "C" },
      { img: "img/tran.png", alt: "D" }
    ],
    correct: 3 },


    { q: "Выберите Конденсатор",
    type: "imageOptions",
    options: [
      { img: "img/diod.png", alt: "A" },
      { img: "img/rez.png", alt: "B" },
      { img: "img/kon.png", alt: "C" },
      { img: "img/tran.png", alt: "D" }
    ],
    correct: 2 },


 { q: "Выберите разъём USB 3.0?",
    type: "imageOptions",
    options: [
      { img: "img/mini.png", alt: "A" },
      { img: "img/usb2.png", alt: "B" },
      { img: "img/usb3.png", alt: "C" },
      { img: "img/usbb.png", alt: "D" }
    ],
    correct: 2 },


  { q: "Выберите разъём RJ45?",
    type: "imageOptions",
    options: [
      { img: "img/rj45.png", alt: "A" },
      { img: "img/p1.png", alt: "B" },
      { img: "img/p2.png", alt: "C" },
      { img: "img/usbb.png", alt: "D" }
    ],
    correct: 0 },


   { q: "Выберите биту Imbus ?",
    type: "imageOptions",
    options: [
      { img: "img/cube.png", alt: "A" },
      { img: "img/imbus.png", alt: "B" },
      { img: "img/torx.png", alt: "C" },
      { img: "img/fork.png", alt: "D" }
    ],
    correct: 1 },


  // --- Текстовые вопросы (из первого файла) ---
  { q: "В чём измеряется сила тока ?", options: ["Вольт, V", "Ампер, A", "Ом, R", "Ват, W"], correct: 1 },
  { q: "Сколько жил в стандартном сетевом LAN кабеле RJ45 ?", options: ["10", "6", "8", "12"], correct: 2 },
  { q: "Как выглядит правильный IP-адресс ?", options: ["192.168.01.300", "192.168.1", "192.168.1.100", "192.168.1.1.1"], correct: 2 },
  { q: "Какое напряжение стандартного порта USB ?", options: ["1,5 V", "5 V", "9 V", "12 V"], correct: 1 },
  { q: "Что такое режим Гид-доступ в iOS ?", options: ["Быстрая зарядка", "Удалённое управление", "Резервное копирование", "Работа только в одном приложении"], correct: 3 },
  { q: "Что означает символ PE ?", options: ["Фаза", "Заземление", "Зануление", "Ноль"], correct: 1 },
  { q: "Что такое короткое замыкание ?", options: ["Пропажа напряжения", "Проблема заземления", "Соединение Ноля и Заземления", "Соединение Фазы и Ноля"], correct: 3 },
  { q: "Что за команда Ping ?", options: ["Автозагрузка", "Реестр", "Проверка подключения к сети", "Безопасность"], correct: 2 },
  { q: "Что не используется для пайки?", options: ["Припой", "Кислота", "Флюс", "Эпоксидка"], correct: 3 },
  { q: "Downgrade означает", options: ["Обновление", "Развёртывание", "Откат версии", "Бездействие"], correct: 2 },
  { q: "Как правильно выглядит MAC адресс ?", options: ["00:1A:2B:3C:4D:5E", "000:12A:22B:53C:44D:53E", "00:14A:2B:3C:4D:5E4", "00:1A:2B:3C:4D:5E:"], correct: 0 },
  { q: "Что за сетевая технология POE:", options: ["Питание по LAN кабелю", "Скоростной Wi-Fi", "Разъём подключения оптоволокна", "Стандарт беспроводной зарядки"], correct: 0 },
  { q: "Что такое Джеилбрейк ?", options: ["Взлом Apple", "Взлом Samsung", "Взлом Windows", "Взлом архифов"], correct: 0 },
  { q: "Где находятся удалённые таблицы, документы, презентации сервисов Google ?", options: ["Корзина операционной системы", "Документы удаляются безследно и невозможно восстановить", "Корзина Google Disk", "Документы не удаляются"], correct: 2 },

];
