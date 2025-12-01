import { Router } from "express";
import { createProduct } from "../controllers/product.controller";
import { validateBody } from "../middlewares/validate";
import { createProductSchema } from "../validations/product";

const router = Router();

router.post("/product", validateBody(createProductSchema), createProduct);
export default router;