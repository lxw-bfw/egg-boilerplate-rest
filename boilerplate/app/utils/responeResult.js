/**
 * @description:封装统一的响应体格式，用于正常响应和可捕获到的异常响应返回
 */

/**
 * responeResult 属于整个项目里面的常用动作，可以抽离到helper里面
 */

const RESULT = {
  // 状态码401,且调用接口执行业务逻辑整个过程完全正确
  SUCCESS: {
    code: 0,
    data: null,
    message: '请求成功',
  },
  //  状态码为200 未登录，没有操作权限
  UNLOGIN: {
    code: 1,
    data: null,
    message: '未登录',
  },
  // 状态码为200，当前用户角色没有此接口的操作权限
  UNAUTHOR: {
    code: 2,
    data: null,
    message: '没有此接口操作权限',
  },
  NOUSER: {
    code: 3,
    data: null,
    message: '用户不存在',
  },
  FROZEN: {
    code: 4,
    data: null,
    message: '用户被冻结了',
  },
  REPEATACCOUNT: {
    code: 5,
    data: null,
    message: '账号名已存在',
  },
  LOGINFAIL: {
    code: 6,
    data: null,
    message: '登录失败，请检查输入是否有误',
  },
  REPEATNAME: {
    code: 7,
    data: null,
    message: '名称不能重复', // 通用场景
  },
  ACCOUNTAVAILABILITY: {
    // 账号是否存在
    code: 8,
    data: null,
    message: '当前手机或者是邮箱未注册过', // 通用场景
  },
  VERIFICATIONCODELIMIT: {
    // 10分钟内验证码发送次数超过限制
    code: 9,
    data: null,
    message: '手机号接收验证码次数超出限制，请十分钟后再试', // 通用场景
  },
  VERIFICATIONCODEERROR: {
    code: 10,
    data: null,
    message: '验证码错误', // 通用场景
  },
  VERIFICATIONCODEINVALID: {
    code: 11,
    data: null,
    message: '验证码失效', // 通用场景
  },
  OPENAIRATELIMIT: {
    code: 12,
    data: null,
    message: 'openai接口请求频繁，稍后再试试', // 通用场景
  },
  SYNTHESISAUDIOLANGUAGEERROR: {
    code: 13,
    data: null,
    message:
      '当前文本所属语言与当前选择的发音模型支持的语言不匹配，建议更换其他支持的发音模型再试试~',
  },
  SYNTHESISAUDIOOTHERERROR: {
    code: 14,
    data: null,
    message: '语音合成服务除了点小差，请稍后再试试哦~', // 通用场景
  },
  // 请求失败，状态码500，后台出错——数据库操作失败或者是其他地方代码出错
  'ERROR-500': {
    message: 'error-服务器内部错误',
    err: null,
  },
  // 接口参数错误
  'ERROR-400': {
    message: 'error-请求参数有误',
    err: null,
  },
};

module.exports = RESULT;
