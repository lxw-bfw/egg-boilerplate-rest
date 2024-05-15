const commonFiles = require('../utils/commSchemaFiles');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const TokenTagSchema = new Schema({
    name: {
      type: String,
      require: true,
    },
    type: {
      type: String, // 屏蔽-shield，偏好-preference
      require: true,
    },
    isSelect: {
      type: Boolean,
      default: true,
    },
    conversationDetailId: {
      type: Schema.Types.ObjectId,
      require: true,
    },
    ...commonFiles,
  });
  TokenTagSchema.pre('update', function (next) {
    this.updateTime = new Date();
    next();
  });
  return mongoose.model('TokenTag', TokenTagSchema);
};
