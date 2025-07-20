import { AbstractEntity } from '../abstract.entity';
import {
    FindManyOptions,
    FindOneOptions,
    Repository,
    SelectQueryBuilder
} from 'typeorm';
import { QueryParamsDto } from '../dto/query-params.dto';
import { UtilsService } from '../utils.service';
import { AbstractDto } from '../abstract.dto';
import { singleton } from 'tsyringe';

export interface IPaginationMeta {
    totalItems: number
    itemCount: number
    limit: number
    totalPages: number
    currentPage: number
}

export class Pagination<PaginationObject> {
    public items: PaginationObject[];
    public readonly meta: IPaginationMeta;

    constructor(data: PaginationObject[], meta: IPaginationMeta) {
        this.items = data;
        this.meta = meta;
    }
}

@singleton()
export class PaginateService {
    async paginateRepository<T extends AbstractEntity, E extends AbstractDto>(
        repository: Repository<T>,
        options: QueryParamsDto,
        dtoClass: any,
        searchOptions?: FindOneOptions<T> | FindManyOptions<T>
    ): Promise<Pagination<E>> {
        let order = {};
        if (searchOptions && searchOptions['order']) {
            order = {
                order: searchOptions['order']
            };
        } else {
            order = {
                order: {
                    createdAt: options.sort.toUpperCase()
                }
            };
        }

        const [data, total] = await repository.findAndCount({
            skip: (options.page - 1) * options.limit,
            take: options.limit,
            ...order,
            ...searchOptions
        });

        const transformedData = data.map((x) => UtilsService.toDto(dtoClass, x));

        return this.createPaginationObject<E>({
            data: transformedData,
            totalItems: total,
            limit: options.limit,
            skip: (options.page - 1) * options.limit,
            currentPage: options.page
        });
    }

    async paginateQueryBuilder<T extends AbstractEntity, E extends AbstractDto>(
        queryBuilder: SelectQueryBuilder<T>,
        options: QueryParamsDto,
        dtoClass: any,
        orderBy?: string | null
    ): Promise<Pagination<E>> {
        const orderByAttribute = !orderBy
            ? `${queryBuilder.alias}.createdAt`
            : `${queryBuilder.alias}.${orderBy}`;

        if (options.limit !== -1) {
            queryBuilder.take(options.limit);
        }

        const [data, total] = await queryBuilder
            .skip((options.page - 1) * options.limit)
            .orderBy(
                orderByAttribute,
                options.sort.toUpperCase() as 'ASC' | 'DESC'
            )
            .getManyAndCount();

        const transformedData = data.map((x) => UtilsService.toDto(dtoClass, x));

        return this.createPaginationObject<E>({
            data: transformedData,
            totalItems: total,
            limit: options.limit,
            skip: (options.page - 1) * options.limit,
            currentPage: options.page
        });
    }

    /**
     * This function is used to paginate a raw query builder with custom attributes
     *
     * This is useful when you want to join multiple tables and get the custom attributes
     * @param queryBuilder
     * @param options
     * @param dtoClass
     * @param orderBy
     * @param customAttributes
     */
    async paginateRawCustomQueryBuilder<
        T extends AbstractEntity,
        E extends AbstractDto
    >(
        queryBuilder: SelectQueryBuilder<T>,
        options: QueryParamsDto,
        dtoClass: any,
        orderBy?: string | null,
        customAttributes?: {
            [key: string]: string
        }
    ): Promise<Pagination<E>> {
        const orderByAttribute = !orderBy
            ? `${queryBuilder.alias}.createdAt`
            : `${queryBuilder.alias}.${orderBy}`;

        // Need custom_ orderBy to be able to sort custom attributes in rawManyEntities
        // All custom attributes should be prefixed with custom_ in the query
        // All custom attributes must be lowercase because orderBy cast attribute to lowercase
        const customOrderByAttribute =
            orderByAttribute.search(`${queryBuilder.alias}.custom_`) !== -1
                ? orderByAttribute
                      .replace(`${queryBuilder.alias}.custom_`, '')
                      .toLowerCase()
                : orderByAttribute;

        if (options.limit !== -1) {
            queryBuilder.take(options.limit);
        }

        const total = await queryBuilder.getCount();

        const { raw, entities } = await queryBuilder
            .skip((options.page - 1) * options.limit)
            .orderBy(
                customOrderByAttribute,
                options.sort.toUpperCase() as 'ASC' | 'DESC'
            )
            .getRawAndEntities();

        // This is to merge the custom attributes to the entity
        const result = entities.map((entity, i) => {
            const findSameId = raw.find(
                (x) => x[`${queryBuilder.alias}_id`] === entity.id
            );

            const addSelectCustomAttributes = Object.keys(
                customAttributes
            ).reduce((previousValue, currentValue) => {
                return {
                    ...previousValue,
                    [currentValue]: findSameId[customAttributes[currentValue]]
                };
            }, {});

            return {
                ...entity,
                ...addSelectCustomAttributes
            };
        });

        const transformedData = result.map((x) =>
            UtilsService.toDto(dtoClass, x)
        );

        return this.createPaginationObject<E>({
            data: transformedData,
            totalItems: total,
            limit: options.limit,
            skip: (options.page - 1) * options.limit,
            currentPage: options.page
        });
    }

    createPaginationObject<T>({
        data,
        totalItems,
        limit,
        skip,
        currentPage
    }: {
        data: any
        totalItems: number
        limit: number
        skip: number
        currentPage: number
    }): Pagination<T> {
        const totalPages = Math.ceil(totalItems / limit);

        const meta: IPaginationMeta = {
            totalItems: totalItems,
            itemCount: data.length,
            limit: limit,
            totalPages: totalPages,
            currentPage: currentPage
        };

        return new Pagination<T>(data, meta);
    }
}
