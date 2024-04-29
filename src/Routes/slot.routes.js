import { Router } from "express";
import { booking } from "../Controllers/slot.controllers.js";


const router= Router()
router.route('/slotbooking').post(booking)

export default router
