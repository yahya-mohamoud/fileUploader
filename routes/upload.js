import { Router } from "express";
import multer from "multer";
import { supabase } from "../supabase.js";
import fileControllers from "../controllers/fileControllers.js";

const fileRoute = Router()
const upload = multer({ storage: multer.memoryStorage() })

fileRoute.post('/upload', upload.single('file'), fileControllers.uploadPost)

fileRoute.get('/download/:id', fileControllers.downloadFile)

fileRoute.get('/delete/:id', fileControllers.deleteFile)

fileRoute.get('/views/:filename', fileControllers.viewSingleFile)

export default fileRoute