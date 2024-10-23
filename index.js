import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

const app = express();
const PORT = process.env.PORT || 3000;

// Function to scrape population data by country
async function getPopulationData() {
  const url = 'https://www.worldometers.info/world-population/population-by-country/';
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  const countries = [];

  // Scrape country names, populations, and yearly changes
  $('#example2 tbody tr').each((index, element) => {
    const country = $(element).find('td:nth-child(2)').text().trim();
    const population = $(element).find('td:nth-child(3)').text().trim().replace(/,/g, ''); // Remove commas
    const yearlyChange = $(element).find('td:nth-child(4)').text().trim(); // Yearly change

    // Check if values are valid before pushing
    if (country && population) {
      countries.push({ 
        country, 
        population: parseInt(population, 10),
        yearlyChange: yearlyChange || "N/A" // Use "N/A" if yearlyChange is not available
      });
    }
  });

  return countries;
}

// Function to scrape world population data by year, including yearly change and net change
async function getWorldPopulationByYear() {
  const url = 'https://www.worldometers.info/world-population/world-population-by-year/';
  
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    const populationByYear = [];
    console.log('Fetched HTML:', response.data); // Log the fetched HTML

    $('#example2 tbody tr').each((index, element) => {
      const year = $(element).find('td:nth-child(1)').text().trim();
      const population = $(element).find('td:nth-child(2)').text().trim().replace(/,/g, ''); // Population
      const yearlyChange = $(element).find('td:nth-child(3)').text().trim(); // Yearly change
      const netChange = $(element).find('td:nth-child(4)').text().trim(); // Net change

      // Log each value to verify
      console.log(`Row ${index}: Year=${year}, Population=${population}, Yearly Change=${yearlyChange}, Net Change=${netChange}`);

      // Ensure the data is valid before pushing to the array
      if (year && population) {
        populationByYear.push({ 
          year, 
          population: parseInt(population, 10),
          yearlyChange: yearlyChange || "N/A", // Use "N/A" if yearlyChange is not available
          netChange: netChange || "N/A" // Use "N/A" if netChange is not available
        });
      }
    });

    console.log('Population by year:', populationByYear); // Log the final data
    return populationByYear;

  } catch (error) {
    console.error('Error fetching world population by year:', error);
    throw error; // Rethrow to handle it in the API endpoint
  }
}

// API endpoint to get the leaderboard by country
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

// API endpoint to get world population by year, including yearly change and net change
app.get('/api/world-population-by-year', async (req, res) => {
  try {
    const worldPopulationData = await getWorldPopulationByYear();
    console.log('World Population Data:', worldPopulationData); // Log the fetched data
    res.json(worldPopulationData);
  } catch (error) {
    console.error('Error fetching world population by year:', error);
    res.status(500).json({ error: 'Failed to fetch world population by year data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
