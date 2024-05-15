'use strict';

const Controller = require('../utils/baseController');

// 其中conversationDetailId为创建tokentag的时候关联的对话详情id
// 支持多条件，都以query传递
const findAllQueryRule = {
  conversationDetailId: { type: 'string', required: true, allowEmpty: false },
};

const createParamsRule = {
  id: { type: 'string', required: true, allowEmpty: false },
};
const createBodyRule = {
  name: { type: 'string', require: true, allowEmpty: false },
  type: { type: 'string', require: true, allowEmpty: false },
  isSelect: 'boolean?',
  conversationDetailId: { type: 'string', required: true, allowEmpty: false },
};

const updateBodyRule = {
  name: 'string?',
  type: 'string?',
  isSelect: 'boolean?',
  conversationDetailId: 'string?',
};

const createPaginateQueryRule = {
  page: { type: 'number', require: true, allowEmpty: false },
  pageSize: { type: 'number', require: true, allowEmpty: false },
  conversationDetailId: { type: 'string', required: true, allowEmpty: false },
};

class TokenTagController extends Controller {
  // 基于筛选条件查询全部实体-不做分页

  async index() {
    const { ctx } = this;
    const validateRes = await this.parameterValidate(
      findAllQueryRule,
      ctx.query,
    );
    if (!validateRes) {
      return;
    }
    const { conversationDetailId } = ctx.query;
    try {
      const TokenTag = await ctx.service.tokenTag.getAll({
        conversationDetailId,
      });
      this.success(TokenTag);
    } catch (error) {
      this.serviceErrorHandle('TokenTag', 'getAll', error);
    }
  }

  // 获取单个TokenTag
  async show() {
    const { ctx } = this;
    const validateRes = await this.parameterValidate(
      createParamsRule,
      ctx.params,
    );
    if (!validateRes) {
      return;
    }
    const { id } = ctx.params;
    try {
      const TokenTag = await ctx.service.tokenTag.getOne(id);
      this.success(TokenTag);
    } catch (error) {
      this.serviceErrorHandle('TokenTag', 'getOne', error);
    }
  }

  // 创建TokenTag
  async create() {
    const { ctx } = this;
    const validateRes = await this.parameterValidate(
      createBodyRule,
      ctx.request.body,
    );
    if (!validateRes) {
      return;
    }
    try {
      const TokenTag = await ctx.service.tokenTag.create(ctx.request.body);
      this.success(TokenTag, 201);
    } catch (error) {
      this.serviceErrorHandle('TokenTag', 'create', error);
    }
  }

  async update() {
    const { ctx } = this;
    const validateParamRes = await this.parameterValidate(
      createParamsRule,
      ctx.params,
    );
    const validateBodyRes = await this.parameterValidate(
      updateBodyRule,
      ctx.request.body,
    );
    if (!validateParamRes || !validateBodyRes) {
      return;
    }
    const { id } = ctx.params;
    try {
      await ctx.service.tokenTag.update(id, ctx.request.body);
      this.success(null);
    } catch (error) {
      this.serviceErrorHandle('tokenTag', 'update', error);
    }
  }

  // 删除TokenTag
  async destroy() {
    const { ctx } = this;
    const validateRes = await this.parameterValidate(
      createParamsRule,
      ctx.params,
    );
    if (!validateRes) {
      return;
    }
    const { id } = ctx.params;
    try {
      await ctx.service.tokenTag.delete(id);
      this.success(null);
    } catch (error) {
      this.serviceErrorHandle('TokenTag', 'delete', error);
    }
  }
  async paginate() {
    const { ctx } = this;
    const validateRes = await this.parameterValidate(
      createPaginateQueryRule,
      ctx.query,
    );
    if (!validateRes) {
      return;
    }
    const { page, pageSize, conversationDetailId } = ctx.query;
    try {
      const TokenTag = await ctx.service.tokenTag.paginate(
        parseInt(page),
        parseInt(pageSize),
        { conversationDetailId },
      );
      this.success(TokenTag);
    } catch (error) {
      this.serviceErrorHandle('TokenTag', 'paginate', error);
    }
  }
}

module.exports = TokenTagController;
