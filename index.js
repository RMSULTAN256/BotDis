const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

// Function to scrape population data
async function getPopulationData() {
  const url = 'https://www.worldometers.info/world-population/population-by-country/';
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  const countries = [];

  // Scrape country names and populations
  $('#example2 tbody tr').each((index, element) => {
    const country = $(element).find('td:nth-child(2)').text().trim();
    const population = $(element).find('td:nth-child(3)').text().trim().replace(/,/g, ''); // Remove commas
    countries.push({ country, population: parseInt(population, 10) });
  });

  return countries;
}

// API endpoint to get the leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const populationData = await getPopulationData();
    // Sort countries by population in descending order
    populationData.sort((a, b) => b.population - a.population);
    res.json(populationData);
  } catch (error) {
    console.error('Error fetching population data:', error);
    res.status(500).json({ error: 'Failed to fetch population data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
