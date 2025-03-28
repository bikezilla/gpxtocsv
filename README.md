# GPX to CSV Converter

A simple Node.js script that converts GPX (GPS Exchange Format) files to CSV format, with detailed track analysis.

## Features

- Converts GPX track data to CSV format
- Extracts track-level information including:
  - Track name and color
  - Distance in kilometers
  - Total ascent and descent in meters
  - Average grade as a percentage
  - Track profile classification (ascend/descend/flat)
- Handles multiple tracks and segments
- TypeScript support
- Localization support (English and Bulgarian)

## Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

## Usage

1. Build the TypeScript code:

```bash
npm run build
```

2. Run the script:

```bash
npm start <input.gpx> <output.csv> [locale]
```

For example:

```bash
# English output (default)
npm start track.gpx output.csv

# Bulgarian output
npm start track.gpx output.csv bg
```

## Output Format

The CSV file will contain the following columns (shown in both English and Bulgarian):

| English           | Bulgarian         |
| ----------------- | ----------------- |
| Track Name        | Име на маршрута   |
| Track Color       | Цвят на маршрута  |
| Distance (km)     | Разстояние (км)   |
| Ascent (m)        | Изкачване (м)     |
| Descent (m)       | Спускане (м)      |
| Average Grade (%) | Среден наклон (%) |
| Profile           | Профил            |

### Profile Types

| English | Bulgarian |
| ------- | --------- |
| ascend  | изкачване |
| descend | спускане  |
| flat    | равен     |

### Color Names

| English | Bulgarian |
| ------- | --------- |
| Blue    | Син       |
| Green   | Зелен     |
| Red     | Червен    |
| Yellow  | Жълт      |
| Purple  | Лилав     |
| Orange  | Оранжев   |
| Pink    | Розов     |
| Brown   | Кафяв     |
| Black   | Черен     |
| White   | Бял       |

### Example Output (English)

```
Track Name,Track Color,Distance (km),Ascent (m),Descent (m),Average Grade (%),Profile
1xx - Заека,Blue,1.488,4,278,-18.37,descend
1хх - Белащица - Куклен,Green,7.164,210,207,0.04,ascend
1хх - Брестнишката,Green,5.792,85,466,-6.58,descend
```

### Example Output (Bulgarian)

```
Име на маршрута,Цвят на маршрута,Разстояние (км),Изкачване (м),Спускане (м),Среден наклон (%),Профил
1xx - Заека,Син,1.488,4,278,-18.37,спускане
1хх - Белащица - Куклен,Зелен,7.164,210,207,0.04,изкачване
1хх - Брестнишката,Зелен,5.792,85,466,-6.58,спускане
```

## Development

To run the script directly with TypeScript (without building):

```bash
npm run dev <input.gpx> <output.csv> [locale]
```
