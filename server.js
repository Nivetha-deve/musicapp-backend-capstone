import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import authRoutes from './routes/auth.js';
import userRouter from './routes/Profile.js';
import musicRouter from './routes/music.js';
import mongooseConnect from "./db-utils/mongoose-connection.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cors());


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

app.get('/api/playlist/:playlistId', async (req, res) => {
  const { playlistId } = req.params;
  const { market, fields, limit = 20, offset = 0, additional_types } = req.query;
  const accessToken = process.env.SPOTIFY_ACCESS_TOKEN;

  try {
    let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`;

    if (market) {
      url += `&market=${market}`;
    }

    if (fields) {
      url += `&fields=${fields}`;
    }

    if (additional_types) {
      url += `&additional_types=${additional_types}`;
    }

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/user', authAllApi, userRouter);
app.use('/api/search', musicRouter); 

await mongooseConnect();

  app.listen(PORT, () => {
    console.log("APP listening on port " + PORT);
  });
