import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject, SubjectSchema } from './schemas/subject.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubCategory } from './schemas/subCategory.schema';
import { AddSubjectDto } from './dto/add-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject.name) private readonly subjectModel: Model<Subject>,
    @InjectModel(SubCategory.name)
    private readonly subCategoryModel: Model<SubCategory>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto) {
    const subject: Subject = {
      name: createSubjectDto.name,
      subCategories: [],
    };
    return await this.subjectModel.create(subject);
  }

  async addSubCategory(id: String, addSubjectDto: AddSubjectDto) {
    this.subjectModel
      .findById(id)
      .then((subject) => {
        const subCategories = subject.subCategories;
        const subCategory: SubCategory = {
          name: addSubjectDto.subCategory,
        };
        subCategories.push(subCategory);

        return this.subjectModel.findByIdAndUpdate(id, {
          subCategories: subCategories,
        });
      })
      .catch((err) => {
        return err;
      });
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

    return await this.subjectModel.findByIdAndUpdate(id, subject, {
      new: true,
    });
  }

  remove(id: number) {
    return this.subjectModel.findByIdAndUpdate(id);
  }
}
