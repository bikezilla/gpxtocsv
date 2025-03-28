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
npm start <input.gpx> <output.csv>
```

For example:

```bash
npm start track.gpx output.csv
```

## Output Format

The CSV file will contain the following columns:

- **Track Name**: Name of the track from the GPX file
- **Track Color**: Color assigned to the track in the GPX file
- **Distance (km)**: Total track distance in kilometers (3 decimal places)
- **Ascent (m)**: Total elevation gain in meters
- **Descent (m)**: Total elevation loss in meters
- **Average Grade (%)**: Overall track grade as a percentage (2 decimal places)
  - Positive values indicate uphill tracks
  - Negative values indicate downhill tracks
- **Profile**: Track profile classification
  - "ascend": Track with more than 100m ascent and ascent > descent
  - "descend": Track with more than 100m descent and descent > ascent
  - "flat": Track with less than 100m total elevation change

### Example Output

```
Track Name,Track Color,Distance (km),Ascent (m),Descent (m),Average Grade (%),Profile
1xx - Заека,Blue,1.488,4,278,-18.37,descend
1хх - Белащица - Куклен,Green,7.164,210,207,0.04,ascend
1хх - Брестнишката,Green,5.792,85,466,-6.58,descend
```

## Development

To run the script directly with TypeScript (without building):

```bash
npm run dev <input.gpx> <output.csv>
```
