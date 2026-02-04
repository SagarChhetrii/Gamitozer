import {Router} from "express";
import { getAllGames } from "../controllers/game.controller.js";


const router = Router();


router.route("/").get(getAllGames);

export default router;