import { Router } from "express";
import { createProduct, getProduct } from "../controllers/product.controller";
import { validateBody } from "../middlewares/validate";
import { createProductSchema } from "../validations/product";

const router = Router();

router.post("/product", validateBody(createProductSchema), createProduct)
    .get("/product/:id", getProduct);
export default router;