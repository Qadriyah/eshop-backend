import { HttpStatus, Logger, NotFoundException } from '@nestjs/common';
import {
  FilterQuery,
  Model,
  SaveOptions,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

export abstract class AbstractRepository<TDocument> {
  private readonly logger = new Logger(AbstractRepository.name);

  constructor(protected readonly model: Model<TDocument>) {}

  create(document: TDocument, options?: SaveOptions) {
    const doc = new this.model({
      ...document,
    });

    return doc.save(options) as unknown as TDocument;
  }

  findOne(filterQuery: FilterQuery<TDocument>, options?: QueryOptions) {
    const document = this.model.findOne(filterQuery, {}, { ...options });
    if (!document) {
      this.logger.warn('Document was not found with filterQuery ', filterQuery);
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [
          {
            field: '',
            message: 'Document was not found',
          },
        ],
      });
    }

    return document;
  }

  find(
    filterQuery: FilterQuery<TDocument>,
    options?: QueryOptions,
  ): Promise<TDocument[]> {
    const documents = this.model.find(filterQuery, {
      ...options,
    });

    return documents;
  }

  findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
    options?: QueryOptions,
  ) {
    const document = this.model.findByIdAndUpdate(filterQuery, update, {
      new: true,
      ...options,
    });

    return document;
  }

  deleteOne(filterQuery: FilterQuery<TDocument>, options?: QueryOptions) {
    const document = this.model.deleteOne(filterQuery, {
      ...options,
    });

    return document;
  }
}
