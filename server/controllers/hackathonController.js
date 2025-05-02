import scraperService from "../services/scraper.js";
import Hackathon from "../models/Hackathon.js";

const hackathonController = {
  async getAllHackathons(req, res) {
    try {
      // Try to get hackathons from database first
      let hackathons = await Hackathon.find()
        .sort({ createdAt: -1 })
        .limit(20);

      // If no hackathons in database, scrape them
      if (hackathons.length === 0) {
        const scrapedHackathons = await scraperService.getAllHackathons();
        
        // Save scraped hackathons to database
        if (scrapedHackathons.length > 0) {
          const savedHackathons = await Hackathon.insertMany(
            scrapedHackathons.map(h => ({
              ...h,
              date: new Date(h.date),
              status: 'upcoming'
            }))
          );
          hackathons = savedHackathons;
        }
      }

      res.json(hackathons);
    } catch (error) {
      console.error('Error fetching hackathons:', error);
      // If database error occurs, try to get hackathons directly from scraper
      try {
        const scrapedHackathons = await scraperService.getAllHackathons();
        res.json(scrapedHackathons);
      } catch (scrapeError) {
        res.status(500).json({ 
          error: 'Failed to fetch hackathons',
          message: error.message 
        });
      }
    }
  },

  async createHackathon(req, res) {
    try {
      const hackathon = new Hackathon({
        ...req.body,
        source: 'User'
      });
      await hackathon.save();
      res.status(201).json(hackathon);
    } catch (error) {
      res.status(400).json({ 
        error: 'Failed to create hackathon',
        message: error.message 
      });
    }
  }
};

export default hackathonController; 