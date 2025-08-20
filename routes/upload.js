import { Router } from "express";
import multer from "multer";
import fileControllers from "../controllers/fileControllers.js";

const fileRoute = Router()
const upload = multer({dest: 'uploads/'})

fileRoute.post('/upload',upload.single('upload'), fileControllers.uploadFile)


export default fileRoute