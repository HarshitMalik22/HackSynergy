import axios from "axios";
import * as cheerio from "cheerio";

// Configure axios with better defaults and retry logic
const axiosInstance = axios.create({
  timeout: 30000, // Increased timeout
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1'
  },
  maxRedirects: 5,
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Accept all responses except 5xx errors
  }
});

// Add retry logic
axiosInstance.interceptors.response.use(undefined, async (err) => {
  const { config } = err;
  if (!config || !config.retry) {
    return Promise.reject(err);
  }
  config.retry -= 1;
  const delayRetry = new Promise(resolve => {
    setTimeout(resolve, config.retryDelay || 1000);
  });
  await delayRetry;
  return axiosInstance(config);
});

class ScraperService {
  async scrapeDevfolio() {
    try {
      console.log("Starting Devfolio scrape...");
      const response = await axiosInstance.get('https://devfolio.co/hackathons', {
        retry: 3,
        retryDelay: 2000
      });

      console.log("Devfolio Response Status:", response.status);
      console.log("Devfolio Response Headers:", response.headers);

      const $ = cheerio.load(response.data);
      const hackathons = [];

      // Log the HTML structure to debug selectors
      console.log("Devfolio HTML Structure:");
      console.log($('div[class*="HackathonCard"]').length, "HackathonCard elements found");
      console.log($('div[class*="hackathon-card"]').length, "hackathon-card elements found");
      console.log($('.event-card').length, "event-card elements found");

      // Updated selectors for Devfolio
      $('div[class*="HackathonCard"], div[class*="hackathon-card"], .hackathon-card, .event-card').each((i, element) => {
        const $el = $(element);
        console.log(`Processing Devfolio hackathon ${i + 1}:`);
        console.log("Element HTML:", $el.html());

        // Extract image URL with multiple fallback selectors
        let imageUrl = $el.find('img[class*="banner"], img[class*="cover"], img[class*="image"], img[class*="logo"]').attr('src');
        if (!imageUrl) {
          imageUrl = $el.find('img').attr('src');
        }
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = `https://devfolio.co${imageUrl}`;
        }

        const title = $el.find('[class*="title"], [class*="name"], h3, h4, .event-title').first().text().trim();
        const location = $el.find('[class*="location"], [class*="venue"], [class*="place"]').first().text().trim() || 'Online';
        const mode = location.toLowerCase().includes('online') ? 'online' : 'in-person';

        // Extract prize amount with better pattern matching
        let prizeAmount = $el.find('[class*="prize"], [class*="amount"], [class*="reward"], [class*="pool"]').first().text().trim();
        prizeAmount = prizeAmount.match(/[\d,]+/)?.[0]?.replace(/,/g, '') || '50000';

        const link = $el.find('a').attr('href');
        const description = $el.find('[class*="description"], [class*="about"], [class*="details"]').first().text().trim() ||
          'Join this exciting hackathon!';

        console.log("Extracted Data:", { title, imageUrl, location, prizeAmount, link });

        if (title) {
          hackathons.push({
            id: `devfolio-${Date.now()}-${i}`,
            title,
            description,
            image: imageUrl || 'https://via.placeholder.com/400x200?text=Hackathon',
            prizeAmount,
            mode,
            link: link ? (link.startsWith('http') ? link : `https://devfolio.co${link}`) : null,
            source: 'Devfolio',
            tags: ['Hackathon', 'Devfolio']
          });
        }
      });

      console.log(`Found ${hackathons.length} hackathons from Devfolio`);
      return hackathons;
    } catch (error) {
      console.error('Error scraping Devfolio:', error.message);
      console.error('Error details:', error.response?.data || error.stack);
      return [];
    }
  }

  async scrapeDevpost() {
    try {
      console.log("Starting Devpost scrape...");
      const response = await axiosInstance.get('https://devpost.com/hackathons?order=deadline', {
        retry: 3,
        retryDelay: 2000
      });

      console.log("Devpost Response Status:", response.status);
      console.log("Devpost Response Headers:", response.headers);

      const $ = cheerio.load(response.data);
      const hackathons = [];

      // Log the HTML structure to debug selectors
      console.log("Devpost HTML Structure:");
      console.log($('.hackathon-tile').length, "hackathon-tile elements found");
      console.log($('.challenge-listing').length, "challenge-listing elements found");
      console.log($('.hackathon-card').length, "hackathon-card elements found");

      // Updated selectors for Devpost
      $('.hackathon-tile, .challenge-listing, .hackathon-card, [data-role="hackathon-tile"]').each((i, element) => {
        const $el = $(element);
        console.log(`Processing Devpost hackathon ${i + 1}:`);
        console.log("Element HTML:", $el.html());

        const title = $el.find('.title, .challenge-title, h3, h4, [class*="title"]').first().text().trim();
        const description = $el.find('.description, .challenge-description, .tagline, [class*="description"]').first().text().trim();
        const dateText = $el.find('.submission-period, .date-range, .deadline, [class*="date"]').text().trim();
        const imageUrl = $el.find('.hackathon-logo img, .challenge-logo img, img[class*="logo"]').attr('src');
        const link = $el.find('a').attr('href');
        const prizeText = $el.find('[class*="prize"], [class*="reward"], [class*="pool"]').first().text().trim();
        const prizeAmount = prizeText.match(/[\d,]+/)?.[0]?.replace(/,/g, '') || '50000';

        console.log("Extracted Data:", { title, description: description.substring(0, 50), dateText, imageUrl, link, prizeAmount });

        if (title) {
          hackathons.push({
            id: `devpost-${Date.now()}-${i}`,
            title,
            description: description || 'Join this exciting hackathon!',
            date: dateText || new Date().toISOString().split('T')[0],
            image: imageUrl || 'https://via.placeholder.com/400x200?text=Hackathon',
            prizeAmount,
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
      console.error('Error details:', error.response?.data || error.stack);
      return [];
    }
  }

  async scrapeMLH() {
    try {
      console.log("Starting MLH scrape...");
      const response = await axiosInstance.get('https://mlh.io/seasons/2025/events', {
        retry: 3,
        retryDelay: 2000
      });

      console.log("MLH Response Status:", response.status);
      console.log("MLH Response Headers:", response.headers);

      const $ = cheerio.load(response.data);
      const hackathons = [];

      // Log the HTML structure to debug selectors
      console.log("MLH HTML Structure:");
      console.log($('.event-wrapper').length, "event-wrapper elements found");
      console.log($('.event-card').length, "event-card elements found");
      console.log($('[class*="event-"]').length, "event-* elements found");

      // Updated selectors for MLH
      $('.event-wrapper, .event-card, [class*="event-"], .hackathon-card').each((i, element) => {
        const $el = $(element);
        console.log(`Processing MLH hackathon ${i + 1}:`);
        console.log("Element HTML:", $el.html());

        const title = $el.find('.event-name, .event-title, [class*="title"], h3, h4').text().trim();
        const description = $el.find('.event-description, .event-info, [class*="description"]').text().trim() ||
          'Join this exciting MLH hackathon!';
        const dateText = $el.find('.event-date, [class*="date"]').text().trim();
        const imageUrl = $el.find('.event-logo img, .event-image img, img[class*="logo"]').attr('src');
        const location = $el.find('.event-location, .event-venue, [class*="location"]').text().trim();
        const link = $el.find('a').attr('href');
        const mode = location.toLowerCase().includes('online') ? 'online' : 'in-person';

        console.log("Extracted Data:", { title, description: description.substring(0, 50), dateText, imageUrl, location, link });

        if (title) {
          hackathons.push({
            id: `mlh-${Date.now()}-${i}`,
            title,
            description,
            date: dateText || new Date().toISOString().split('T')[0],
            image: imageUrl || 'https://mlh.io/assets/logos/mlh-logo-white.svg',
            location,
            mode,
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
      console.error('Error details:', error.response?.data || error.stack);
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

      // Log detailed results of each scraper
      console.log('Scraper Results:');
      console.log('Devfolio:', {
        status: devfolioHackathons.status,
        count: devfolioHackathons.status === 'fulfilled' ? devfolioHackathons.value.length : 0,
        error: devfolioHackathons.status === 'rejected' ? devfolioHackathons.reason.message : null,
        stack: devfolioHackathons.status === 'rejected' ? devfolioHackathons.reason.stack : null
      });

      console.log('Devpost:', {
        status: devpostHackathons.status,
        count: devpostHackathons.status === 'fulfilled' ? devpostHackathons.value.length : 0,
        error: devpostHackathons.status === 'rejected' ? devpostHackathons.reason.message : null,
        stack: devpostHackathons.status === 'rejected' ? devpostHackathons.reason.stack : null
      });

      console.log('MLH:', {
        status: mlhHackathons.status,
        count: mlhHackathons.status === 'fulfilled' ? mlhHackathons.value.length : 0,
        error: mlhHackathons.status === 'rejected' ? mlhHackathons.reason.message : null,
        stack: mlhHackathons.status === 'rejected' ? mlhHackathons.reason.stack : null
      });

      // Combine results from all sources, handling any rejected promises
      const allHackathons = [
        ...(devfolioHackathons.status === 'fulfilled' ? devfolioHackathons.value : []),
        ...(devpostHackathons.status === 'fulfilled' ? devpostHackathons.value : []),
        ...(mlhHackathons.status === 'fulfilled' ? mlhHackathons.value : [])
      ];

      console.log(`Combined ${allHackathons.length} hackathons from all sources`);

      // Only add sample data if we got less than 5 hackathons total
      if (allHackathons.length < 5) {
        console.log("Adding sample data due to insufficient hackathons found");
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
      console.error('Error stack:', error.stack);
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