import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
import { Router } from "express";
import folderController from "../controllers/folderController.js";
import { checkAuth } from "../middlewares.js";

const folderRoute = Router()

folderRoute.post('/create', checkAuth,folderController.createPost)

folderRoute.get('/', checkAuth,folderController.getAllFolders)

folderRoute.get('/details/:id', checkAuth,folderController.getOneFolder)

folderRoute.get('/edit/:id', checkAuth, folderController.updateFolderGet)

folderRoute.post('/edit/:id', checkAuth, folderController.updateFolderPost)

folderRoute.get('/delete/:id', checkAuth, folderController.deleteFolder)

export default folderRoute