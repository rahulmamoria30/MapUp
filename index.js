// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const turf = require("@turf/turf");

// Create Express application
const app = express();
app.use(bodyParser.json());

// Define the authentication middleware
const authenticate = (req, res, next) => {
  // Check if the authorization header is present and valid
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Perform additional authentication checks if needed

  // Authentication successful, proceed to the next middleware or route handler
  next();
};

// Define the API endpoint
app.post("/api/intersections", authenticate, (req, res) => {
  try {
    // Validate the request body
    const { linestring } = req.body;
    if (!linestring) {
      return res.status(400).json({ error: "Missing linestring" });
    }

    // Perform intersection calculations
    const lines = generateRandomLines();
    const result = findIntersections(linestring, lines);

    // Return the result
    res.json(result);
  } catch (error) {
    // Log and handle any errors
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Helper function to generate random lines
function generateRandomLines() {
  const lines = [];

  // Generate 50 random lines
  for (let i = 1; i <= 50; i++) {
    const line = {
      id: `L${i.toString().padStart(2, "0")}`,
      start: [getRandomCoordinate(), getRandomCoordinate()],
      end: [getRandomCoordinate(), getRandomCoordinate()],
    };
    lines.push(line);
  }

  return lines;
}

// Helper function to get a random coordinate between -100 and 100
function getRandomCoordinate() {
  return Math.random() * 200 - 100;
}

// Helper function to find intersections
function findIntersections(linestring, lines) {
  const result = [];

  // Perform intersection calculations using turf.js
  const linestringGeoJSON = turf.lineString(linestring.coordinates);

  lines.forEach((line) => {
    const lineStringGeoJSON = turf.lineString([line.start, line.end]);
    const intersection = turf.lineIntersect(
      linestringGeoJSON,
      lineStringGeoJSON
    );

    if (intersection.features.length > 0) {
      result.push({
        id: line.id,
        intersection: intersection.features[0].geometry.coordinates,
      });
    }
  });

  return result;
}

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
