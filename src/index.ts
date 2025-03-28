import { createObjectCsvWriter } from "csv-writer";
import * as fs from "fs";
import { parseStringPromise } from "xml2js";
import { locales } from "./locales";

interface Track {
  number: string;
  name: string;
  color: string;
  distance: number;
  ascent: number;
  descent: number;
  grade: number;
  profile: string;
}

function extractTrackNumber(name: string): { number: string; name: string } {
  const match = name.match(/^(\d+[хx]?)\s*-\s*(.+)$/);
  if (match) {
    return {
      number: match[1],
      name: match[2].trim(),
    };
  }
  return {
    number: "",
    name: name,
  };
}

async function convertGPXtoCSV(
  inputFile: string,
  outputFile: string,
  locale: string = "en"
): Promise<void> {
  try {
    // Validate locale
    if (!locales[locale]) {
      throw new Error(
        `Unsupported locale: ${locale}. Supported locales are: ${Object.keys(
          locales
        ).join(", ")}`
      );
    }

    const strings = locales[locale];

    // Read and parse GPX file
    const gpxContent = fs.readFileSync(inputFile, "utf-8");
    const result = await parseStringPromise(gpxContent);

    if (!result.gpx.trk || result.gpx.trk.length === 0) {
      throw new Error("No tracks found in GPX file");
    }

    // Extract track information
    const tracks: Track[] = result.gpx.trk.map((track: any) => {
      const fullName = track.name?.[0] || "";
      const { number, name } = extractTrackNumber(fullName);
      const color =
        track.extensions?.[0]?.["gpxx:TrackExtension"]?.[0]?.[
          "gpxx:DisplayColor"
        ]?.[0] || "";

      // Calculate distance, ascent, and descent from track points
      let distance = 0;
      let ascent = 0;
      let descent = 0;

      if (track.trkseg && track.trkseg[0].trkpt) {
        const points = track.trkseg[0].trkpt;
        for (let i = 1; i < points.length; i++) {
          const prev = points[i - 1];
          const curr = points[i];
          const prevLat = parseFloat(prev.$.lat);
          const prevLon = parseFloat(prev.$.lon);
          const currLat = parseFloat(curr.$.lat);
          const currLon = parseFloat(curr.$.lon);
          const prevEle = parseFloat(prev.ele?.[0] || "0");
          const currEle = parseFloat(curr.ele?.[0] || "0");

          // Calculate distance using Haversine formula
          const R = 6371e3; // Earth's radius in meters
          const φ1 = (prevLat * Math.PI) / 180;
          const φ2 = (currLat * Math.PI) / 180;
          const Δφ = ((currLat - prevLat) * Math.PI) / 180;
          const Δλ = ((currLon - prevLon) * Math.PI) / 180;

          const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

          distance += R * c;

          // Calculate elevation changes
          const eleDiff = currEle - prevEle;
          if (eleDiff > 0) {
            ascent += eleDiff;
          } else {
            descent += Math.abs(eleDiff);
          }
        }
      }

      // Calculate average grade
      const totalElevationChange = ascent - descent;
      const grade = distance > 0 ? (totalElevationChange / distance) * 100 : 0;

      // Determine track profile
      let profile = strings.profiles.flat;
      if (ascent > 100 && ascent > descent) {
        profile = strings.profiles.ascend;
      } else if (descent > 100 && descent > ascent) {
        profile = strings.profiles.descend;
      }

      return {
        number,
        name,
        color: strings.colors[color] || color,
        distance: Number((distance / 1000).toFixed(3)),
        ascent: Math.round(ascent),
        descent: Math.round(descent),
        grade: Number(grade.toFixed(2)),
        profile,
      };
    });

    // Create CSV writer
    const csvWriter = createObjectCsvWriter({
      path: outputFile,
      header: [
        { id: "number", title: strings.columns.number },
        { id: "name", title: strings.columns.name },
        { id: "color", title: strings.columns.color },
        { id: "distance", title: strings.columns.distance },
        { id: "ascent", title: strings.columns.ascent },
        { id: "descent", title: strings.columns.descent },
        { id: "grade", title: strings.columns.grade },
        { id: "profile", title: strings.columns.profile },
      ],
    });

    // Write to CSV
    await csvWriter.writeRecords(tracks);
    console.log(`Successfully converted ${inputFile} to ${outputFile}`);
    console.log(`Found ${tracks.length} tracks`);
  } catch (error) {
    console.error("Error converting GPX to CSV:", error);
    throw error;
  }
}

// Get command line arguments
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log("Usage: npm start <input.gpx> <output.csv> [locale]");
  console.log("Supported locales: en, bg");
  process.exit(1);
}

const [inputFile, outputFile, locale = "en"] = args;
convertGPXtoCSV(inputFile, outputFile, locale).catch(console.error);
