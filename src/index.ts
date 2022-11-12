import express, { Express, Request, Response } from "express";
import { SpotifyTokenGenerator } from "./API/SpotifyTokenGenerator";
import config from "config";
import cookieParser from "cookie-parser";
import { randomUUID } from "crypto";

const spotify = new SpotifyTokenGenerator();
const app: Express = express();

app.use(cookieParser(config.get("cookieSecret")));

app.get("/spotify", (req, res) => {
  const stateParam = randomUUID();
  res.cookie("stateParam", stateParam, { maxAge: 1000 * 60 * 5, signed: true });
  res.redirect(spotify.getAuthUrl(stateParam));
});

app.get("/spotify/callback", async (req, res) => {
  const code = req.query.code?.toString() ?? "";
  const state = req.query.state?.toString() ?? "";
  const { stateParam } = req.signedCookies;

  if (state !== stateParam) {
    res.status(422).json({ error: "invalid state", success: false });
    return;
  }

  if (code == "") {
    res.status(422).send({ error: "invalid code", success: false });
    return;
  }

  res.json({ code: code, success: true });
});

app.listen(8888, () => {
  console.log(`⚡️[server]: Server is running at: http://localhost:8888`);
  console.log(`⚡️[server]: Spotify: http://localhost:8888/spotify`);
  console.log("⚡️[server]: NODE_ENV: " + config.util.getEnv("NODE_ENV"));
});
