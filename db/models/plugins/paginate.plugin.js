const logger = require('../../../helpers/logger')
/**
 * The plugin used to query data by page
 * 
 * @param {Object} schema 
 * @param {Object} options - Query object
 */
const paginate = (schema, options) => {
  /**
   * 
   * @param {Object}   filter           - Query filter
   * @param {Object}   options          - Options to decide which attribute should be shown or populated
   * @param {String}   options.sortBy   - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,). eg: chainId:asc,address:desc
   * @param {String}   options.populate - Populate data fields using the format: populateField1:selectField1 selectField2,populateField2:selectField3 selectField4:subpopulateField|selectField5 selectField6. eg: 'user:id name,replies:id user:user|id name createdAt' (for comment model)
   * @param {number}   options.limit    - Maximum number of results per page (default = 10)
   * @param {number}   options.page     - Current page (default = 1)
   * @returns 
   */
    schema.statics.paginate = async function (filter, options) {
        let sort = {updatedAt: -1}
        const sortingCriteria = {}
        if (options.sortBy) {
          options.sortBy.split(',').forEach((sort) => {
            const [key, order] = sort.split(':')
            if (key === 'id') {
              sortingCriteria['_id'] = order === 'asc' ? 1 : -1
            } else {
              sortingCriteria[key] = order === 'asc' ? 1 : -1
            }
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
              const popOptions = select ? {path: path, select: select} : {path: path}
              if (subPopulate) {
                const [subPath, subSelect] = subPopulate.split('|')
                popOptions.populate = {path: subPath, select: subSelect}
              }
              logger.debug('paginate.populate. path =', path, ',select =', select, ',subPopulate =', subPopulate)
              logger.debug('paginate.populate. popOptions = ', popOptions)
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