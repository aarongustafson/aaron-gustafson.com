const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { htmlToText } = require('html-to-text');
const cheerio = require('cheerio');

class ContentProcessor {
  static stripHtml(content) {
    return htmlToText(content, {
      wordwrap: false,
      ignoreHref: true,
      ignoreImage: true,
      preserveNewlines: true,
    });
  }

  static removeBlockquotes(content) {
    // Remove opening blockquotes
    content = content.replace(/<blockquote[^>]*>/g, '');
    // Remove closing blockquotes and replace with newlines
    content = content.replace(/<\/blockquote>/g, '\n\n');
    return content;
  }

  static removeTrailingParagraphs(content) {
    // Remove closing paragraph tags and replace with newlines
    content = content.replace(/<\/p>/g, '\n\n');
    return content;
  }

  static processContentForLinkedIn(rawContent) {
    let processed = rawContent;
    processed = this.removeBlockquotes(processed);
    processed = this.removeTrailingParagraphs(processed);
    processed = this.stripHtml(processed);

    // Clean up extra newlines
    processed = processed.replace(/\n\s*\n\s*\n/g, '\n\n');
    processed = processed.trim();

    return processed;
  }

  static createScreenshotUrl(url) {
    const apiKey = process.env.SCREENSHOT_API_KEY;
    if (!apiKey) {
      console.log('No screenshot API key provided, skipping screenshots');
      return null;
    }

    const encodedUrl = encodeURIComponent(url);
    return `https://api.screenshotmachine.com?key=${apiKey}&url=${encodedUrl}&dimension=1024x768&format=png`;
  }

  static truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;

    // Find the last space before the max length
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    if (lastSpace > 0) {
      return truncated.substring(0, lastSpace) + '...';
    }

    return truncated + '...';
  }
}

class CacheManager {
  constructor() {
    this.cacheDir = '.github/cache';
    this.cacheFile = path.join(this.cacheDir, 'last-syndicated.json');
  }

  async ensureCacheDir() {
    try {
      await fs.mkdir(this.cacheDir, { recursive: true });
    } catch (error) {
      // Directory already exists or other error
    }
  }

  async getLastSyndicatedTimes() {
    try {
      await this.ensureCacheDir();
      const data = await fs.readFile(this.cacheFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // If no cache exists, start from current time to avoid re-syndicating everything
      const now = new Date().toISOString();
      return {
        posts: now,
        links: now,
        initialized: now
      };
    }
  }

  async updateLastSyndicatedTime(type) {
    const cache = await this.getLastSyndicatedTimes();
    cache[type] = new Date().toISOString();

    await fs.writeFile(this.cacheFile, JSON.stringify(cache, null, 2));
  }

  async getItemsNewerThan(items, type) {
    const cache = await this.getLastSyndicatedTimes();
    const lastSyncTime = new Date(cache[type]);

    return items.filter(item => {
      const itemDate = new Date(item.date_published);
      return itemDate > lastSyncTime;
    });
  }

  // Legacy method for backwards compatibility - now checks by date
  async isProcessed(type, item) {
    const cache = await this.getLastSyndicatedTimes();
    const lastSyncTime = new Date(cache[type]);
    const itemDate = new Date(item.date_published);

    return itemDate <= lastSyncTime;
  }
}

class SocialMediaAPI {
  constructor(testMode = false) {
    this.cache = new CacheManager();
    this.testMode = testMode || process.env.TEST_MODE === 'true';

    if (this.testMode) {
      console.log('🧪 Running in TEST MODE - no actual posts will be made');
    }
  }

  async postToLinkedIn(content, imageUrl = null, isCompany = false) {
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
    if (!accessToken && !this.testMode) {
      throw new Error('LinkedIn access token not provided');
    }

    const authorId = isCompany ?
      `urn:li:organization:${process.env.LINKEDIN_COMPANY_ID}` :
      'urn:li:person:me';

    const postData = {
      author: authorId,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content.text
          },
          shareMediaCategory: imageUrl ? 'IMAGE' : 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    };

    if (content.url) {
      postData.specificContent['com.linkedin.ugc.ShareContent'].media = [{
        status: 'READY',
        originalUrl: content.url,
        title: {
          text: content.title
        }
      }];
    }

    if (imageUrl) {
      // LinkedIn image upload is complex, using URL preview instead
      postData.specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory = 'ARTICLE';
    }

    if (this.testMode) {
      console.log('🧪 TEST: LinkedIn post data:', JSON.stringify(postData, null, 2));
      return {
        id: 'test-linkedin-post-' + Date.now(),
        status: 'PUBLISHED',
        testMode: true
      };
    }

    const response = await axios.post(
      'https://api.linkedin.com/v2/ugcPosts',
      postData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      }
    );

    return response.data;
  }

  async postToMastodon(status, mediaUrls = []) {
    const accessToken = process.env.MASTODON_ACCESS_TOKEN;
    const serverUrl = process.env.MASTODON_SERVER_URL;

    if ((!accessToken || !serverUrl) && !this.testMode) {
      throw new Error('Mastodon credentials not provided');
    }

    const postData = {
      status: status,
      visibility: 'public'
    };

    // Upload media if provided
    if (mediaUrls.length > 0) {
      const mediaIds = [];
      for (const mediaUrl of mediaUrls) {
        if (this.testMode) {
          console.log('🧪 TEST: Would upload media to Mastodon:', mediaUrl);
          mediaIds.push('test-media-' + Date.now());
        } else {
          try {
            const mediaResponse = await axios.post(
              `${serverUrl}/api/v1/media`,
              { url: mediaUrl },
              {
                headers: {
                  'Authorization': `Bearer ${accessToken}`
                }
              }
            );
            mediaIds.push(mediaResponse.data.id);
          } catch (error) {
            console.log('Failed to upload media to Mastodon:', error.message);
          }
        }
      }
      if (mediaIds.length > 0) {
        postData.media_ids = mediaIds;
      }
    }

    if (this.testMode) {
      console.log('🧪 TEST: Mastodon post data:', JSON.stringify(postData, null, 2));
      return {
        id: 'test-mastodon-post-' + Date.now(),
        url: 'https://front-end.social/@test/123456789',
        testMode: true
      };
    }

    const response = await axios.post(
      `${serverUrl}/api/v1/statuses`,
      postData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  }

  async postToBuffer(text, profileIds, mediaUrl = null) {
    const accessToken = process.env.BUFFER_ACCESS_TOKEN;
    if (!accessToken && !this.testMode) {
      throw new Error('Buffer access token not provided');
    }

    const results = [];

    for (const profileId of profileIds) {
      const postData = {
        text: text,
        profile_ids: [profileId]
      };

      if (mediaUrl) {
        postData.media = {
          photo: mediaUrl
        };
      }

      if (this.testMode) {
        console.log(`🧪 TEST: Buffer post data for profile ${profileId}:`, JSON.stringify(postData, null, 2));
        results.push({
          id: `test-buffer-${profileId}-${Date.now()}`,
          profile_id: profileId,
          testMode: true
        });
        continue;
      }

      try {
        const response = await axios.post(
          'https://api.bufferapp.com/1/updates/create.json',
          postData,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        results.push(response.data);
      } catch (error) {
        console.log(`Failed to post to Buffer profile ${profileId}:`, error.message);
        results.push({ error: error.message, profileId });
      }
    }

    return results;
  }

  async postToPinterest(pin) {
    const accessToken = process.env.PINTEREST_ACCESS_TOKEN;
    const boardId = process.env.PINTEREST_BOARD_ID;

    if ((!accessToken || !boardId) && !this.testMode) {
      throw new Error('Pinterest credentials not provided');
    }

    const postData = {
      link: pin.url,
      title: pin.title,
      description: pin.description,
      board_id: boardId || 'test-board'
    };

    if (pin.imageUrl) {
      postData.media_source = {
        source_type: 'image_url',
        url: pin.imageUrl
      };
    }

    if (this.testMode) {
      console.log('🧪 TEST: Pinterest pin data:', JSON.stringify(postData, null, 2));
      return {
        id: 'test-pinterest-pin-' + Date.now(),
        url: 'https://pinterest.com/pin/test123456789',
        testMode: true
      };
    }

    const response = await axios.post(
      'https://api.pinterest.com/v5/pins',
      postData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  }

  async sendToIFTTT(event, data) {
    const webhookKey = process.env.IFTTT_WEBHOOK_KEY;
    if (!webhookKey && !this.testMode) {
      console.log('IFTTT webhook key not provided, skipping IFTTT fallback');
      return null;
    }

    if (this.testMode) {
      console.log(`🧪 TEST: IFTTT webhook "${event}":`, JSON.stringify(data, null, 2));
      return {
        event: event,
        status: 'sent',
        testMode: true
      };
    }

    const response = await axios.post(
      `https://maker.ifttt.com/trigger/${event}/with/key/${webhookKey}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  }
}

module.exports = {
  ContentProcessor,
  CacheManager,
  SocialMediaAPI
};