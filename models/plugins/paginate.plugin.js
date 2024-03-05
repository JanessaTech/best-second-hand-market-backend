const logger = require('../../helpers/logger')

const paginate = (schema, options) => {
    schema.statics.paginate = async function (filter, options) {
        let sort = {createdAt: -1}
        const sortingCriteria = {}
        if (options.sortBy) {
          options.sortBy.split(',').forEach((sort) => {
            const [key, order] = sort.split(':')
            sortingCriteria[key] = order === 'asc' ? 1 : -1
          })
            sort = sortingCriteria
        }
        logger.debug('paginate. sort = ', sort)
        const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
        const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
        const skip = (page - 1) * limit;
    
        const countPromise = this.countDocuments(filter).exec();
        let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);
    
        if (options.populate) {
            options.populate.split(',').forEach((populateOption) => {
              const [path, select, subPopulate] = populateOption.split(':')
              const popOptions = {path: path, select: select}
              if (subPopulate) {
                const [subPath, subSelect] = subPopulate.split('|')
                popOptions.populate = {path: subPath, select: subSelect}
              }
              logger.debug('paginate.populate. path =', path, ',select =', select, ',subPopulate =', subPopulate)
              docsPromise = docsPromise.populate(popOptions);
            });
        }
    
        docsPromise = docsPromise.exec();
        return Promise.all([countPromise, docsPromise]).then((values) => {
            const [totalResults, results] = values;
            const totalPages = Math.ceil(totalResults / limit);
            const result = {
              results,
              page,
              limit,
              totalPages,
              totalResults,
            };
            return Promise.resolve(result);
          });
    }
}

module.exports = paginate