// app/service/TokenTag.js
const Service = require('egg').Service;

class TokenTagService extends Service {
  async getAll(condition) {
    const { ctx } = this;
    const result = await ctx.model.TokenTag.find(condition);
    return result;
  }
  async getOne(id) {
    const { ctx } = this;
    const result = await ctx.model.TokenTag.findOne({ _id: id });
    return result;
  }
  async create(body) {
    const { ctx } = this;
    const result = await ctx.model.TokenTag.create(body);
    return result;
  }
  async update(id, body) {
    const { ctx } = this;
    const result = await ctx.model.TokenTag.updateOne(
      { _id: id },
      { $set: body },
    );
    console.log('result', result);
    if (result.matchedCount === 0) {
      console.log('当前id', id);
      throw new Error('无效的id');
    }
    return result;
  }
  async delete(id) {
    const { ctx } = this;
    const result = await ctx.model.TokenTag.deleteOne({
      _id: id,
    });
    if (result.deletedCount === 0) {
      throw new Error('无效的id');
    }
    return result;
  }
  async paginate(page, pageSize, condition = {}, sortConditon = {}) {
    const { ctx } = this;
    const skip = (page - 1) * pageSize;
    const count = await ctx.model.TokenTag.countDocuments(condition);
    const result = await ctx.model.TokenTag.find(condition)
      .sort(sortConditon)
      .skip(skip)
      .limit(pageSize);
    return { count, result };
  }
}

module.exports = TokenTagService;
