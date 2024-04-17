import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject, SubjectSchema } from './schemas/subject.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { SubCategory } from './schemas/subCategory.schema';
import { AddSubCategoryDto } from './dto/add-subcategory.dto';
import { Question } from 'src/questions/schemas/question.schema';
import { UpdateSubCategoryDto } from './dto/update-subcategory.dto';
import { AddModuleDto } from './dto/add-module.dto';
import { Module } from './schemas/module.schema';
import { SubCategoryInterface } from './interfaces/subCategory.interface';
import { SubjectInterface } from './interfaces/subject.interface';
import { ModuleInterface } from './interfaces/module.interface';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject.name, "quizbank")
    private readonly subjectModel: Model<Subject>,
    @InjectModel(SubCategory.name, "quizbank")
    private readonly subCategoryModel: Model<SubCategory>,
    @InjectModel(Question.name, "quizbank")
    private readonly questionModel: Model<Question>,
    @InjectModel(Module.name, "quizbank")
    private readonly moduleModel: Model<Module>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto) {
    const subject: SubjectInterface = {
      name: createSubjectDto.name,
    };
    return await this.subjectModel.create(subject);
  }

  async addSubCategory(id: ObjectId, addSubjectDto: AddSubCategoryDto) {
    this.subjectModel
      .findById(id)
      .then((subject) => {
        const subCategories = subject.subCategories;
        const subCategory: SubCategoryInterface = {
          name: addSubjectDto.subCategory,
        };
        this.subCategoryModel
          .create(subCategory)
          .then((result) => {
            subCategories.push(result._id.toString());
            return this.subjectModel.findByIdAndUpdate(id, {
              subCategories: subCategories,
            });
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        return err;
      });
  }

  async addModule(id: ObjectId, addModuleDto: AddModuleDto) {
    this.subCategoryModel
      .findById(id)
      .then((subCategory) => {
        const moduleList = subCategory.moduleList;
        const module: ModuleInterface = {
          name: addModuleDto.name,
        };
        this.moduleModel
          .create(module)
          .then((result) => {
            moduleList.push(result._id.toString());
            return this.subCategoryModel.findByIdAndUpdate(id, {
              moduleList: moduleList,
            });
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        return err;
      });
  }

  findAllCources() {
    return this.subCategoryModel.find();
  }

  findAll() {
    return this.subjectModel
      .find()
      .populate('subCategories')
      .populate({
        path: 'subCategories',
        populate: { path: 'moduleList' },
      });
  }

  findOne(id: ObjectId) {
    return this.subjectModel.findById(id).populate('subCategories');
  }

  async update(id: ObjectId, updateSubjectDto: UpdateSubjectDto) {
    const subject: SubjectInterface = {
      name: updateSubjectDto.name,
    };

    return await this.subjectModel.findByIdAndUpdate(id, subject, {
      new: true,
    });
  }

  async updateSubCategory(
    id: ObjectId,
    updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    const subCategory: SubCategoryInterface = {
      name: updateSubCategoryDto.name,
    };

    return await this.subCategoryModel.findByIdAndUpdate(id, subCategory, {
      new: true,
    });
  }

  async updateModule(id: ObjectId, updateModuleDto: UpdateModuleDto) {
    const module: ModuleInterface = {
      name: updateModuleDto.name,
    };

    return await this.moduleModel.findByIdAndUpdate(id, module, {
      new: true,
    });
  }

  // TODO: change these objects id to actual ids in production database
  // when removing one subject all questions from that subject assingng to the default subject
  remove(id: ObjectId) {
    this.questionModel.updateMany(
      { subject: id },
      {
        subject: '655461b78e66dab790f847da', // id of the subject named other
        subCategory: '6557a4aabe2e7d4365a1ec8a', // id of the subject category named other
      },
      { new: true },
    );

    return this.subjectModel.findByIdAndDelete(id);
  }

  // TODO: change these objects id to actual ids in production database
  // when removing one subcategory all questions from that subcategory assingng to the default subCategory
  removeSubCategory(id: ObjectId, course_id: ObjectId) {
    this.questionModel.updateMany(
      { subCategory: course_id },
      { subCategory: '6557a4aabe2e7d4365a1ec8a' }, // id of the subject category named other
      { new: true },
    );

    return this.subjectModel.findByIdAndUpdate(
      id,
      { $pull: { subCategories: course_id } },
      { new: true },
    );
  }

  // TODO: change these objects id to actual ids in production database
  // when removing one module all questions from that module assingng to the default module
  removeModule(id: ObjectId, module_id: ObjectId) {
    this.questionModel.updateMany(
      { module: module_id },
      { module: '6557a4aabe2e7d4365a1ec8a' }, // id of the subject category named other
      { new: true },
    );

    return this.subCategoryModel.findByIdAndUpdate(
      id,
      { $pull: { moduleList: module_id } },
      { new: true },
    );
  }
}
