// import express from  'express';

// const musicRouter = express.Router();

// const DEEZER_APP_ID = '8e37bcf9cbb19a080943f61e3092d4b8';
// const apiRoot = 'http://ws.audioscrobbler.com/2.0/';
// const DEEZER_APP_SECRET = 'a15264a9a24dfde98cbdfdabdccbc943';
// const REDIRECT_URI = 'http://localhost:8000/callback';
// let accessToken = '';

// // Define authAllApi middleware function
// const authAllApi = (req, res, next) => {
//   try {
//     const token = req.headers["authorization"];
//     jwt.verify(token, process.env.JWT_SECRET);
//     next();
//   } catch (err) {
//     console.log(err.message);
//     res.status(403).send({ msg: "Unauthorized" });
//   }
// };

// // Route definitions
// musicRouter.get('/auth', (req, res) => {
//   const authUrl = `https://connect.deezer.com/oauth/auth.php?app_id=${DEEZER_APP_ID}&redirect_uri=${REDIRECT_URI}&perms=basic_access,email&response_type=code`;
//   res.redirect(authUrl);
// });

// musicRouter.get('/callback', async (req, res) => {
//   const { code } = req.query;
//   if (code) {
//     try {
//       const tokenResponse = await fetch(`https://connect.deezer.com/oauth/access_token.php?app_id=${DEEZER_APP_ID}&secret=${DEEZER_APP_SECRET}&code=${code}&output=json`);
//       const tokenData = await tokenResponse.json();
//       accessToken = tokenData.access_token;
//       res.send('OAuth authentication successful! You can now use the search endpoint.');
//     } catch (error) {
//       res.status(500).send('Error getting access token');
//     }
//   } else {
//     res.status(400).send('Authorization code not found');
//   }
// });

// musicRouter.get('/artist-info', authAllApi, async (req, res) => {
//   const query = req.query.artist;
//   if (!query) {
//     return res.status(400).send({ error: 'Artist query parameter is required' });
//   }

//   const url = `${apiRoot}?method=artist.getinfo&artist=${encodeURIComponent(query)}&api_key=${process.env.LASTFM_API_KEY}&format=json`;
//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error('Failed to fetch artist information');
//     }
//     const data = await response.json();
//     res.json(data);
//   } catch (error) {
//     console.error('Error fetching artist information:', error);
//     res.status(500).json({ error: 'An error occurred while fetching artist information' });
//   }
// });



// export default musicRouter;


import express from 'express';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

const musicRouter = express.Router();

const DEEZER_APP_ID = '8e37bcf9cbb19a080943f61e3092d4b8';
const apiRoot = 'http://ws.audioscrobbler.com/2.0/';
const DEEZER_APP_SECRET = 'a15264a9a24dfde98cbdfdabdccbc943';
const REDIRECT_URI = 'http://localhost:8000/callback';
let accessToken = '';

// Define authAllApi middleware function
const authAllApi = (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    console.log(err.message);
    res.status(403).send({ msg: "Unauthorized" });
  }
};

// Route definitions
musicRouter.get('/auth', (req, res) => {
  const authUrl = `https://connect.deezer.com/oauth/auth.php?app_id=${DEEZER_APP_ID}&redirect_uri=${REDIRECT_URI}&perms=basic_access,email&response_type=code`;
  res.redirect(authUrl);
});

musicRouter.get('/callback', async (req, res) => {
  const { code } = req.query;
  if (code) {
    try {
      const tokenResponse = await fetch(`https://connect.deezer.com/oauth/access_token.php?app_id=${DEEZER_APP_ID}&secret=${DEEZER_APP_SECRET}&code=${code}&output=json`);
      const tokenData = await tokenResponse.json();
      accessToken = tokenData.access_token;
      res.send('OAuth authentication successful! You can now use the search endpoint.');
    } catch (error) {
      res.status(500).send('Error getting access token');
    }
  } else {
    res.status(400).send('Authorization code not found');
  }
});

musicRouter.get('/artist-info', authAllApi, async (req, res) => {
  const query = req.query.artist;
  if (!query) {
    return res.status(400).send({ error: 'Artist query parameter is required' });
  }

  const url = `${apiRoot}?method=artist.getinfo&artist=${encodeURIComponent(query)}&api_key=${process.env.LASTFM_API_KEY}&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch artist information');
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching artist information:', error);
    res.status(500).json({ error: 'An error occurred while fetching artist information' });
  }
});

export default musicRouter;


