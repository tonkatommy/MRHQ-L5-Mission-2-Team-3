const express = require("express");
const router = express.Router();

/**
 * Handles the GET request for risk rating
 * This function is used to test the API is working correctly
 * It returns a sample response with a risk rating
 */
router.get("/", (req, res, next) => {
  res.status(200).json({
    riskRating: 3,
    breakdown: {
      collide: 1,
      crash: 1,
      scratch: 0,
      bump: 0,
      smash: 1,
    },
  });
});

/**
 * Handles the POST request to analyze claim history for risk keywords
 * This function extracts the claim history from the request body and processes it
 * It counts the occurrences of predefined risk keywords and returns the results
 * The results include a total keyword count and a breakdown by individual keyword
 */
router.post("/", (req, res, next) => {
  try {
    // Extract the claim history text from the request body
    const { claimHistory } = req.body;
    // Optional : comment this out for production
    // console.log("Claim History:", claimHistory);
    // Validate the input
    if (typeof claimHistory !== "string") {
      // Optional console log the error
      // console.error("Invalid claimHistory field");
      return res.status(400).json({ error: "there is an error" });
    }

    // Define our base keyword stems - these are the core action words we want to detect
    const keywordStems = ["collide", "crash", "scratch", "bump", "smash"];

    /**
     * Creates a regular expression pattern that matches a word stem plus common endings
     * This function builds patterns that catch variations like: crash, crashed, crashes, crashing
     *
     * @param {string} stem - The base word we want to match
     * @returns {RegExp} - A regex pattern with word boundaries and optional endings
     */
    const createStemPattern = (stem) => {
      // \b creates word boundaries to ensure we match complete words only
      // (ed|es|ing)? creates an optional group for our three target endings
      // g flag finds all matches, i flag ignores case
      // return new RegExp(`\\b${stem}(ed|es|ing)?\\b`, "gi");
      return new RegExp(`\\b${stem}\\b`, "gi");
    };

    /**
     * Counts how many times a word stem (and its variations) appears in text
     * This handles all the variations we defined in our pattern
     *
     * @param {string} text - The text to search within
     * @param {string} stem - The base word stem to search for
     * @returns {number} - Count of matches found
     */
    const countStemMatches = (text, stem) => {
      // Create the pattern for this specific stem
      const pattern = createStemPattern(stem);

      // Find all matches, defaulting to empty array if none found
      const matches = text.match(pattern) || [];

      // Return the count of matches
      return matches.length;
    };

    /**
     * Process each keyword stem and count its occurrences
     * This creates an array of counts, one for each stem
     */
    const stemCounts = keywordStems.map((stem) => {
      const count = countStemMatches(claimHistory, stem);
      // Optional: Uncomment this line if you want to see what's being matched during development
      // console.log(`Stem "${stem}": found ${count} matches`);
      return count;
    });

    /**
     * Calculate the total count across all stems
     * This gives us the overall "keyword density" of the claim text
     */
    const riskRating = stemCounts.reduce((accumulator, currentCount) => {
      return accumulator + currentCount;
    }, 1); // Start with 1 as our initial value

    // Send back the results as JSON
    res.status(200).json({
      riskRating: riskRating > 5 ? 5 : riskRating,
      // Optional: Include individual counts for more detailed analysis
      // You can uncomment this if you want to see the breakdown
      breakdown: keywordStems.reduce((obj, stem, index) => {
        obj[stem] = stemCounts[index];
        return obj;
      }, {}),
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(400).json({ error: "there is an error" });
  }
});

module.exports = router;
