// app/core/base_controller.js
const { Controller } = require('egg');
const RESULT = require('./responeResult');
class BaseController extends Controller {
  get user() {
    return this.ctx.session.user;
  }
  success(data, status = 200) {
    RESULT.SUCCESS.data = data;
    this.ctx.status = status;
    this.ctx.body = RESULT.SUCCESS;
  }
  accountRepeat(data, status = 200) {
    RESULT.REPEATACCOUNT.data = data;
    this.ctx.status = status;
    this.ctx.body = RESULT.REPEATACCOUNT;
  }
  loginFail(data, status = 200) {
    RESULT.LOGINFAIL.data = data;
    this.ctx.status = status;
    this.ctx.body = RESULT.LOGINFAIL;
  }
  nameRepeat(data, status = 200) {
    RESULT.REPEATNAME.data = data;
    this.ctx.status = status;
    this.ctx.body = RESULT.REPEATNAME;
  }
  accountExists(data, status = 200) {
    RESULT.ACCOUNTAVAILABILITY.data = data;
    this.ctx.status = status;
    this.ctx.body = RESULT.ACCOUNTAVAILABILITY;
  }
  exceededVerificationAttempts(data, status = 200) {
    RESULT.VERIFICATIONCODELIMIT.data = data;
    this.ctx.status = status;
    this.ctx.body = RESULT.VERIFICATIONCODELIMIT;
  }
  exceededVerificationError(data, status = 200) {
    RESULT.VERIFICATIONCODEERROR.data = data;
    this.ctx.status = status;
    this.ctx.body = RESULT.VERIFICATIONCODEERROR;
  }
  exceededVerificationInvalid(data, status = 200) {
    RESULT.VERIFICATIONCODEINVALID.data = data;
    this.ctx.status = status;
    this.ctx.body = RESULT.VERIFICATIONCODEINVALID;
  }
  handleFrequentRequests(data, status = 200) {
    RESULT.OPENAIRATELIMIT.data = data;
    this.ctx.status = status;
    this.ctx.body = RESULT.OPENAIRATELIMIT;
  }
  handelSynthesisAudioLanguageError(data, status = 200) {
    RESULT.SYNTHESISAUDIOLANGUAGEERROR.data = data;
    this.ctx.status = status;
    this.ctx.body = RESULT.SYNTHESISAUDIOLANGUAGEERROR;
  }
  handelSynthesisAudioOtherError(data, status = 200) {
    RESULT.SYNTHESISAUDIOOTHERERROR.data = data;
    this.ctx.status = status;
    this.ctx.body = RESULT.SYNTHESISAUDIOOTHERERROR;
  }
  error500(err, message) {
    RESULT['ERROR-500'].err = err;
    RESULT['ERROR-500'].message = message;
    this.ctx.status = 500;
    this.ctx.body = RESULT['ERROR-500'];
  }
  error400(err, message) {
    RESULT['ERROR-400'].err = err;
    RESULT['ERROR-400'].message = message;
    this.ctx.status = 400;
    this.ctx.body = RESULT['ERROR-400'];
  }
  async parameterValidate(createRule, parameterType) {
    try {
      await this.ctx.validate(createRule, parameterType);
      return true;
    } catch (error) {
      this.logger.error('lack of request params', error.errors || error);
      this.error400(error, error.errors);
      return false;
    }
  }
  serviceErrorHandle(resourceName, fnName, err) {
    this.logger.error(resourceName, fnName, 'service', err);
    this.error500(err, err.message || 'sercice error');
  }
}
module.exports = BaseController;
