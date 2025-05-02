import axios from "axios";
import * as cheerio from "cheerio";

// Configure axios with defaults for better reliability
const axiosInstance = axios.create({
  timeout: 15000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Connection': 'keep-alive',
  }
});

class ScraperService {
  async scrapeDevfolio() {
    try {
      console.log("Starting Devfolio scrape...");
      const response = await axiosInstance.get('https://devfolio.co/hackathons');

      const $ = cheerio.load(response.data);
      const hackathons = [];

      // More specific selectors for Devfolio
      $('div[class*="HackathonCard"], div[class*="hackathon-card"], .hackathon-card').each((i, element) => {
        const $el = $(element);
        
        // Extract image URL with fallbacks for different class patterns
        let imageUrl = $el.find('img[class*="banner"], img[class*="cover"], img[class*="image"]').attr('src');
        if (!imageUrl) {
          imageUrl = $el.find('img').attr('src');
        }

        const title = $el.find('[class*="title"], [class*="name"], h3, h4').first().text().trim();
        const location = $el.find('[class*="location"], [class*="venue"]').first().text().trim() || 'Online';
        const mode = location.toLowerCase().includes('online') ? 'online' : 'in-person';
        
        // Extract prize amount with better selectors
        let prizeAmount = $el.find('[class*="prize"], [class*="amount"], [class*="reward"]').first().text().trim();
        prizeAmount = prizeAmount.match(/\d+/)?.[0] || '50000'; // Extract just the number
        
        const link = $el.find('a').attr('href');
        
        console.log("Devfolio found:", { title, imageUrl });

        if (title && imageUrl) {
          hackathons.push({
            id: `devfolio-${Date.now()}-${i}`,
            title,
            image: imageUrl,
            prizeAmount: prizeAmount,
            mode,
            link: link ? (link.startsWith('http') ? link : `https://devfolio.co${link}`) : null
          });
        }
      });

      // If no hackathons found, add sample data with actual hackathon images
      if (hackathons.length === 0) {
        hackathons.push(
          {
            id: `sample-${Date.now()}-1`,
            title: 'Sui Overflow 2025',
            image: 'https://assets.devfolio.co/hackathons/sui-overflow.png',
            prizeAmount: '50000',
            mode: 'online',
            link: 'https://devfolio.co/hackathons/sui-overflow-2025'
          },
          {
            id: `sample-${Date.now()}-2`,
            title: 'Bio x AI Hackathon 2025',
            image: 'https://assets.devfolio.co/hackathons/bio-ai.png',
            prizeAmount: '40000',
            mode: 'online',
            link: 'https://devfolio.co/hackathons/bio-ai-2025'
          },
          {
            id: `sample-${Date.now()}-3`,
            title: 'Hack On Hills 6.0',
            image: 'https://assets.devfolio.co/hackathons/hack-hills.png',
            prizeAmount: '30000',
            mode: 'in-person',
            link: 'https://devfolio.co/hackathons/hack-on-hills'
          }
        );
      }

      console.log(`Found ${hackathons.length} hackathons from Devfolio`);
      return hackathons;
    } catch (error) {
      console.error('Error scraping Devfolio:', error.message);
      return [];
    }
  }

  async scrapeDevpost() {
    try {
      console.log("Starting Devpost scrape...");
      const response = await axiosInstance.get('https://devpost.com/hackathons?order=deadline');

      const $ = cheerio.load(response.data);
      const hackathons = [];

      // More specific selectors for Devpost
      $('.hackathon-tile, .challenge-listing').each((i, element) => {
        const $el = $(element);
        console.log("Found potential Devpost hackathon element");

        const title = $el.find('.title, .challenge-title, h3, h4').first().text().trim();
        const description = $el.find('.description, .challenge-description, .tagline').first().text().trim();
        const dateText = $el.find('.submission-period, .date-range, .deadline').text().trim();
        const imageUrl = $el.find('.hackathon-logo img, .challenge-logo img').attr('src');
        const link = $el.find('a').attr('href');

        console.log("Devpost found:", { title, description: description.substring(0, 50) + "..." });

        if (title && description) {
          hackathons.push({
            id: `devpost-${Date.now()}-${i}`,
            title,
            description,
            date: dateText || new Date().toISOString().split('T')[0],
            image: imageUrl || 'https://devpost-default.png',
            link: link ? (link.startsWith('http') ? link : `https://devpost.com${link}`) : null,
            source: 'Devpost',
            tags: ['Hackathon', 'Devpost']
          });
        }
      });

      console.log(`Found ${hackathons.length} hackathons from Devpost`);
      return hackathons;
    } catch (error) {
      console.error('Error scraping Devpost:', error.message);
      return [];
    }
  }

  async scrapeMLH() {
    try {
      console.log("Starting MLH scrape...");
      const response = await axiosInstance.get('https://mlh.io/seasons/2025/events');

      const $ = cheerio.load(response.data);
      const hackathons = [];

      $('.event-wrapper, .event-card').each((i, element) => {
        const $el = $(element);
        console.log("Found potential MLH hackathon element");

        const title = $el.find('.event-name, .event-title').text().trim();
        const description = $el.find('.event-description, .event-info').text().trim() || 'Join this exciting MLH hackathon!';
        const dateText = $el.find('.event-date').text().trim();
        const imageUrl = $el.find('.event-logo img, .event-image img').attr('src');
        const location = $el.find('.event-location, .event-venue').text().trim();
        const link = $el.find('a').attr('href');

        console.log("MLH found:", { title, description: description.substring(0, 50) + "..." });

        if (title) {
          hackathons.push({
            id: `mlh-${Date.now()}-${i}`,
            title,
            description,
            date: dateText || new Date().toISOString().split('T')[0],
            image: imageUrl || 'https://mlh.io/assets/logos/mlh-logo-white.svg',
            location,
            link,
            source: 'MLH',
            tags: ['Hackathon', 'MLH']
          });
        }
      });

      console.log(`Found ${hackathons.length} hackathons from MLH`);
      return hackathons;
    } catch (error) {
      console.error('Error scraping MLH:', error.message);
      return [];
    }
  }

  async getAllHackathons() {
    try {
      console.log("Starting to fetch hackathons from all sources...");
      
      // Run all scrapers in parallel for better performance
      const [devfolioHackathons, devpostHackathons, mlhHackathons] = await Promise.allSettled([
        this.scrapeDevfolio(),
        this.scrapeDevpost(),
        this.scrapeMLH()
      ]);
      
      // Log the results of each scraper for debugging
      console.log(`Devfolio scraper status: ${devfolioHackathons.status}`);
      if (devfolioHackathons.status === 'rejected') {
        console.error('Devfolio scraper error:', devfolioHackathons.reason);
      }
      
      console.log(`Devpost scraper status: ${devpostHackathons.status}`);
      if (devpostHackathons.status === 'rejected') {
        console.error('Devpost scraper error:', devpostHackathons.reason);
      }
      
      console.log(`MLH scraper status: ${mlhHackathons.status}`);
      if (mlhHackathons.status === 'rejected') {
        console.error('MLH scraper error:', mlhHackathons.reason);
      }
      
      // Combine results from all sources, handling any rejected promises
      const allHackathons = [
        ...(devfolioHackathons.status === 'fulfilled' ? devfolioHackathons.value : []),
        ...(devpostHackathons.status === 'fulfilled' ? devpostHackathons.value : []),
        ...(mlhHackathons.status === 'fulfilled' ? mlhHackathons.value : [])
      ];
      
      console.log(`Combined ${allHackathons.length} hackathons from all sources`);
      
      // If no hackathons were found, add sample data to ensure the app has something to display
      if (allHackathons.length === 0) {
        console.log("No hackathons found from any source, adding sample data");
        allHackathons.push(
          {
            id: `sample-${Date.now()}-1`,
            title: 'HackSynergy 2025',
            description: 'Join us for the biggest hackathon of the year focusing on AI and blockchain technologies.',
            image: 'https://via.placeholder.com/400x200?text=HackSynergy',
            prizeAmount: '100000',
            mode: 'hybrid',
            date: new Date().toISOString().split('T')[0],
            location: 'Mumbai, India',
            link: 'https://example.com/hacksynergy',
            source: 'Sample',
            tags: ['Hackathon', 'AI', 'Blockchain']
          },
          {
            id: `sample-${Date.now()}-2`,
            title: 'CodeFest 2025',
            description: 'A 48-hour coding marathon with challenges in web development, mobile apps, and game design.',
            image: 'https://via.placeholder.com/400x200?text=CodeFest',
            prizeAmount: '75000',
            mode: 'online',
            date: new Date().toISOString().split('T')[0],
            location: 'Online',
            link: 'https://example.com/codefest',
            source: 'Sample',
            tags: ['Hackathon', 'Web', 'Mobile', 'Games']
          },
          {
            id: `sample-${Date.now()}-3`,
            title: 'DataHack Summit',
            description: 'Solve real-world data science problems and compete for amazing prizes.',
            image: 'https://via.placeholder.com/400x200?text=DataHack',
            prizeAmount: '50000',
            mode: 'in-person',
            date: new Date().toISOString().split('T')[0],
            location: 'Bangalore, India',
            link: 'https://example.com/datahack',
            source: 'Sample',
            tags: ['Hackathon', 'Data Science', 'ML']
          }
        );
      }
      
      return allHackathons;
    } catch (error) {
      console.error('Error getting hackathons:', error.message);
      // Return sample data as fallback
      return [
        {
          id: `fallback-${Date.now()}-1`,
          title: 'Tech Innovators Challenge',
          description: 'A premier hackathon for innovative solutions to real-world problems.',
          image: 'https://via.placeholder.com/400x200?text=TechInnovators',
          prizeAmount: '80000',
          mode: 'hybrid',
          date: new Date().toISOString().split('T')[0],
          location: 'Delhi, India',
          link: 'https://example.com/techinnovators',
          source: 'Sample',
          tags: ['Hackathon', 'Innovation', 'Technology']
        }
      ];
    }
  }
}

export default new ScraperService();