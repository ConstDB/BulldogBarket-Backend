import { ProductRepository } from "../data/product.repo";
import { CreateProductDto } from "../validations/product";

export const CreateProductService = async (data: CreateProductDto) => {
    return ProductRepository.create(data)
}