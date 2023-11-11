import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './schemas/subject.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubCategory } from './schemas/subCategory.schema';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject.name) private readonly subjectModel: Model<Subject>,
    @InjectModel(SubCategory.name)
    private readonly subCategoryModel: Model<SubCategory>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto) {
    const subCategoryArray: SubCategory[] = [];
    createSubjectDto.subCategories.forEach(async (item: string) => {
        const subCategory: SubCategory = {
            name: item
        }

        subCategoryArray.push(subCategory);
    //   await this.subCategoryModel
    //     .create({ name: item })
    //     .then((result) => {        
    //       subCategoryArray.push(result.name);
    //     })
    //     .catch((err) => {
    //         console.log(err);            
    //     })
    });


    const subject: Subject = {
      name: createSubjectDto.name,
      subCategories: subCategoryArray,
    };
    return await this.subjectModel.create(subject);
  }

  findAll() {
    return this.subjectModel.find();
  }

  findOne(id: number) {
    return this.subjectModel.findById(id);
  }

  async update(id: number, updateSubjectDto: UpdateSubjectDto) {
    const subCategoryArray: SubCategory[] = [];
    
    const subject: Subject = {
      name: updateSubjectDto.name,
      subCategories: subCategoryArray,
    };

    return await this.subjectModel.findByIdAndUpdate(id, subject, { new: true });
  }

  remove(id: number) {
    return this.subjectModel.findByIdAndUpdate(id);
  }
}
