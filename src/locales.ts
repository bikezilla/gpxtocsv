interface LocaleStrings {
  columns: {
    name: string;
    color: string;
    distance: string;
    ascent: string;
    descent: string;
    grade: string;
    profile: string;
  };
  profiles: {
    ascend: string;
    descend: string;
    flat: string;
  };
  colors: {
    [key: string]: string;
  };
}

interface Locales {
  [key: string]: LocaleStrings;
}

export const locales: Locales = {
  en: {
    columns: {
      name: "Track Name",
      color: "Track Color",
      distance: "Distance (km)",
      ascent: "Ascent (m)",
      descent: "Descent (m)",
      grade: "Average Grade (%)",
      profile: "Profile",
    },
    profiles: {
      ascend: "ascend",
      descend: "descend",
      flat: "flat",
    },
    colors: {
      Blue: "Blue",
      Green: "Green",
      Red: "Red",
      Yellow: "Yellow",
      Purple: "Purple",
      Orange: "Orange",
      Pink: "Pink",
      Brown: "Brown",
      Black: "Black",
      White: "White",
    },
  },
  bg: {
    columns: {
      name: "Име на маршрута",
      color: "Цвят на маршрута",
      distance: "Разстояние (км)",
      ascent: "Изкачване (м)",
      descent: "Спускане (м)",
      grade: "Среден наклон (%)",
      profile: "Профил",
    },
    profiles: {
      ascend: "изкачване",
      descend: "спускане",
      flat: "равен",
    },
    colors: {
      Blue: "Син",
      Green: "Зелен",
      Red: "Червен",
      Yellow: "Жълт",
      Purple: "Лилав",
      Orange: "Оранжев",
      Pink: "Розов",
      Brown: "Кафяв",
      Black: "Черен",
      White: "Бял",
    },
  },
};
