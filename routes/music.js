import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import SpotifyWebApi from 'spotify-web-api-node';


 dotenv.config();
 const musicRouter = express.Router();
 
// const getSpotifyAccessToken = async () => {
//   try {
//     const response = await fetch('https://accounts.spotify.com/api/token', {
//       method: 'POST',
//       headers: {
//         'Authorization': Basic ${Buffer.from(${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}).toString('base64')},
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       body: new URLSearchParams({ 'grant_type': 'client_credentials' })
//     });

//     const data = await response.json();
//     if (data.error) {
//       throw new Error(Spotify token error: ${data.error_description});
//     }

//     return data.access_token;
//   } catch (error) {
//     console.error('Error fetching Spotify access token:', error.message);
//     throw new Error('Error fetching Spotify access token');
//   }
// };

// // Search Spotify function
// const searchSpotify = async (query, type, market = 'In', limit = 20, offset = 0) => {
//   const token = await getSpotifyAccessToken();

//   try {
//     let endpoint = '';

//     switch (type) {
//       case 'track':
//         endpoint = https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&market=${market}&limit=${limit}&offset=${offset};
//         break;
//       case 'artist':
//         endpoint = https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&market=${market}&limit=${limit}&offset=${offset};
//         break;
//       case 'album':
//         endpoint = https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&market=${market}&limit=${limit}&offset=${offset};
//         break;
//       default:
//         throw new Error(Invalid search type: ${type});
//     }

//     const response = await fetch(endpoint, {
//       headers: {
//         'Authorization': Bearer ${token}
//       }
//     });

//     if (!response.ok) {
//       throw new Error(Spotify API returned ${response.status} ${response.statusText});
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error(Error fetching ${type} data from Spotify API:, error.message);
//     throw new Error(Error fetching ${type} data from Spotify API);
//   }
// };

// // Example route to search for songs based on query and type
// musicRouter.get('/', async (req, res) => {
//   const { q: query, type } = req.query;

//   try {
//     const data = await searchSpotify(query, type);
//     res.json(data);
//   } catch (error) {
//     console.error(Error fetching ${type} data from Spotify API:, error);
//     res.status(500).json({ error: Error fetching ${type} data from Spotify API });
//   }
// });


const getSpotifyAccessToken = async () => {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ 'grant_type': 'client_credentials' })
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(`Spotify token error: ${data.error_description}`);
    }

    return data.access_token;
  } catch (error) {
    console.error('Error fetching Spotify access token:', error.message);
    throw new Error('Error fetching Spotify access token');
  }
};

// Search Spotify function
const searchSpotify = async (query, type, market = 'In', limit = 20, offset = 0) => {
  const token = await getSpotifyAccessToken();

  try {
    let endpoint = '';

    switch (type) {
      case 'track':
        endpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&market=${market}&limit=${limit}&offset=${offset}`;
        break;
      case 'artist':
        endpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&market=${market}&limit=${limit}&offset=${offset}`;
        break;
      case 'album':
        endpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&market=${market}&limit=${limit}&offset=${offset}`;
        break;
      default:
        throw new Error(`Invalid search type: ${type}`);
    }

    const response = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Spotify API returned ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${type} data from Spotify API:`, error.message);
    throw new Error(`Error fetching ${type} data from Spotify API`);
  }
};

// Example route to search for songs based on query and type
musicRouter.get('/', async (req, res) => {
  const { q: query, type } = req.query;

  try {
    const data = await searchSpotify(query, type);
    res.json(data);
  } catch (error) {
    console.error(`Error fetching ${type} data from Spotify API:`, error);
    res.status(500).json({ error: `Error fetching ${type} data from Spotify API` });
  }
});



export default musicRouter;


