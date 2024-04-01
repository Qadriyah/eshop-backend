import * as mongoosePaginate from 'mongoose-paginate-v2';

mongoosePaginate.paginate.options = {
  lean: true,
  limit: 20,
};

export default mongoosePaginate;
