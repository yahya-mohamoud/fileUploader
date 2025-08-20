import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
import { Router } from "express";
import folderController from "../controllers/folderController.js";

const folderRoute = Router()

folderRoute.post('/create', folderController.createPost)

folderRoute.get('/', folderController.getAllFolders)

folderRoute.get('/details/:id', folderController.getOneFolder)

folderRoute.get('/edit/:id', folderController.updateFolderGet)

folderRoute.post('/edit/:id', folderController.updateFolderPost)

folderRoute.get('/delete/:id', folderController.deleteFolder)

export default folderRoute