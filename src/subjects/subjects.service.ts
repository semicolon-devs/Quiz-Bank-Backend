import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject, SubjectSchema } from './schemas/subject.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { SubCategory } from './schemas/subCategory.schema';
import { AddSubjectDto } from './dto/add-subject.dto';
import { Question } from 'src/questions/schemas/question.schema';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject.name) private readonly subjectModel: Model<Subject>,
    @InjectModel(SubCategory.name)
    private readonly subCategoryModel: Model<SubCategory>,
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto) {
    const subject: Subject = {
      name: createSubjectDto.name,
      subCategories: [],
    };
    return await this.subjectModel.create(subject);
  }

  async addSubCategory(id: ObjectId, addSubjectDto: AddSubjectDto) {
    this.subjectModel
      .findById(id)
      .then((subject) => {
        const subCategories = subject.subCategories;
        const subCategory: SubCategory = {
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

  findAllCources() {
    return this.subCategoryModel.find();
  }

  findAll() {
    return this.subjectModel.find().populate('subCategories');
  }

  findOne(id: number) {
    return this.subjectModel.findById(id);
  }

  async update(id: ObjectId, updateSubjectDto: UpdateSubjectDto) {
    const subCategoryArray: string[] = [];

    const subject: Subject = {
      name: updateSubjectDto.name,
      subCategories: subCategoryArray,
    };

    return await this.subjectModel.findByIdAndUpdate(id, subject, {
      new: true,
    });
  }

  remove(id: ObjectId) {
    this.questionModel.updateMany(
      { subject: id },
      {
        subject: '655461b78e66dab790f847da',
        subCategory: '655461ae8e66dab790f847d7',
      },
      { new: true },
    );

    return this.subjectModel.findByIdAndUpdate(id);
  }

  removeSubCategory(id: ObjectId, course_id: string) {
    this.questionModel.updateMany(
      { subCategory: course_id },
      { subCategory: '655461ae8e66dab790f847d7' },
      { new: true },
    );

    return this.subjectModel.findByIdAndUpdate(
      id,
      { $pull: { subCategories: { _id: course_id } } },
      { new: true },
    );
  }
}
