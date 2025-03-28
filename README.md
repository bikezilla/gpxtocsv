# GPX to CSV Converter

A simple Node.js script that converts GPX (GPS Exchange Format) files to CSV format.

## Features

- Converts GPX track data to CSV format
- Extracts latitude, longitude, elevation, and time information
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

- Latitude
- Longitude
- Elevation (m)
- Time (ISO format)

## Development

To run the script directly with TypeScript (without building):

```bash
npm run dev <input.gpx> <output.csv>
```
