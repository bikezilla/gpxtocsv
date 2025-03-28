"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const csv_writer_1 = require("csv-writer");
const fs = __importStar(require("fs"));
const gpxParser = require("gpxparser");
async function convertGPXtoCSV(inputFile, outputFile) {
    try {
        // Read and parse GPX file
        const gpxContent = fs.readFileSync(inputFile, "utf-8");
        const gpx = new gpxParser();
        gpx.parse(gpxContent);
        if (!gpx.tracks || gpx.tracks.length === 0) {
            throw new Error("No tracks found in GPX file");
        }
        // Extract track points
        const trackPoints = [];
        for (const track of gpx.tracks) {
            for (const point of track.points) {
                trackPoints.push({
                    latitude: point.lat,
                    longitude: point.lon,
                    elevation: point.ele || 0,
                    time: point.time ? new Date(point.time).toISOString() : "",
                });
            }
        }
        // Create CSV writer
        const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
            path: outputFile,
            header: [
                { id: "latitude", title: "Latitude" },
                { id: "longitude", title: "Longitude" },
                { id: "elevation", title: "Elevation (m)" },
                { id: "time", title: "Time" },
            ],
        });
        // Write to CSV
        await csvWriter.writeRecords(trackPoints);
        console.log(`Successfully converted ${inputFile} to ${outputFile}`);
    }
    catch (error) {
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
