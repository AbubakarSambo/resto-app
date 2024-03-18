import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.save(createCategoryDto);
  }

  findAll(skip = 0, take = 20): Promise<[Category[], number]> {
    return this.categoryRepository.findAndCount({ skip, take });
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Could not find category');
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const updateCategory = await this.categoryRepository.findOne({
      where: { id },
    });

    if (updateCategoryDto.name) {
      updateCategory.name = updateCategoryDto.name;
    }
    const updated = await this.categoryRepository.save(updateCategory);
    return updated;
  }

  async remove(id: number) {
    await this.categoryRepository.delete({ id });
  }
}
