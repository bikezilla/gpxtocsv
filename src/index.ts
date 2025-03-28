import { createObjectCsvWriter } from "csv-writer";
import * as fs from "fs";
import { parseStringPromise } from "xml2js";

interface Track {
  name: string;
  color: string;
  distance: number;
  ascent: number;
  descent: number;
}

async function convertGPXtoCSV(
  inputFile: string,
  outputFile: string
): Promise<void> {
  try {
    // Read and parse GPX file
    const gpxContent = fs.readFileSync(inputFile, "utf-8");
    const result = await parseStringPromise(gpxContent);

    if (!result.gpx.trk || result.gpx.trk.length === 0) {
      throw new Error("No tracks found in GPX file");
    }

    // Extract track information
    const tracks: Track[] = result.gpx.trk.map((track: any) => {
      const name = track.name?.[0] || "";
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

      return {
        name,
        color,
        distance: Number((distance / 1000).toFixed(3)),
        ascent: Math.round(ascent),
        descent: Math.round(descent),
      };
    });

    // Create CSV writer
    const csvWriter = createObjectCsvWriter({
      path: outputFile,
      header: [
        { id: "name", title: "Track Name" },
        { id: "color", title: "Track Color" },
        { id: "distance", title: "Distance (km)" },
        { id: "ascent", title: "Ascent (m)" },
        { id: "descent", title: "Descent (m)" },
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
if (args.length !== 2) {
  console.log("Usage: npm start <input.gpx> <output.csv>");
  process.exit(1);
}

const [inputFile, outputFile] = args;
convertGPXtoCSV(inputFile, outputFile).catch(console.error);
