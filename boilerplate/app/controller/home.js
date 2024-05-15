'use strict';

const Controller = require('../utils/baseController');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = '<h3>welcome to CHAT-AI-GPT-CMS web api project by lxw</h3>';
  }
}

module.exports = HomeController;
