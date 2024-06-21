
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import multer from 'multer';
import cors from 'cors';
import bodyParser from 'body-parser';
import server from './src/routes/index.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var app = express();

const corsOptions = {
  origin: ' http://localhost:5173', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

const port = process.env.PORT || 8080;
const dbUrl = process.env.DATABASE_URL;
const accessSecretKey = process.env.ACCESS_SECRET_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiModel = process.env.OPENAI_MODEL;
const pineconeApiKey = process.env.PINECONE_API_KEY;
const pineconeEnvironment = process.env.PINECONE_ENVIRONMENT;
const uploadthingSecret = process.env.UPLOADTHING_SECRET;
const uploadthingAppId = process.env.UPLOADTHING_APP_ID;
const pineconeIndex = process.env.PINECONE_INDEX;
const pdfUrl = process.env.PDF_URL;

app.use(cors(corsOptions));app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", server.auth);
app.use("/", server.profile);
app.use("/", server.bidang);
app.use("/", server.jabatan);
app.use("/", server.tugasAkhir);
app.use("/", server.bimbinganTa);
app.use("/", server.konsultasiKaprodi);
app.use("/", server.vectorize);
app.use("/", server.genertePdf);
app.use("/", server.konsulProdi);


app.use("/fotoUser", express.static("public/images/profile"));

app.use((req, res, next) => {
  console.log(req.body);
  next();
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ success: false, message: "Bad JSON" });
  }
  next();
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  } else {
    next(err);
  }
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.json({ error: err });
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json("error", { error: err });
});
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500);
  res.json({
    message: "An error occurred",
    error: err.message,
  });
});
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (req, res, next) {
  res.status(404).json({ message: "Not Found" });
});

export default app;
