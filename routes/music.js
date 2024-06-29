import express from  'express';

const musicRouter = express.Router();

const DEEZER_APP_ID = '8e37bcf9cbb19a080943f61e3092d4b8';
const DEEZER_APP_SECRET = 'a15264a9a24dfde98cbdfdabdccbc943';
const  REDIRECT_URI = 'http://localhost:8000/callback';
let accessToken = '';

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

musicRouter.get('/', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).send({ error: 'Query parameter is required' });
  }
  const url = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&access_token=${accessToken}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.error) {
      res.status(400).json({ error: data.error });
    } else {
      res.json(data);
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});


export default musicRouter;


