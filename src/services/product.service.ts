import { ProductRepository } from "../data/product.repo";
import { CreateProductDto } from "../validations/product";

export const CreateProduct = async (data: CreateProductDto) => {
    return ProductRepository.create(data)
}