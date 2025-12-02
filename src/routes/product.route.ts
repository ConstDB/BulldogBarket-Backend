import { Router } from "express";
import { createProduct, getProduct } from "../controllers/product.controller";
import { createProductSchema } from "../validations/product";
import { validate } from "../middlewares/validate";

const router = Router();

router.post("/product", validate(createProductSchema), createProduct)
    .get("/product/:id", getProduct);
export default router;