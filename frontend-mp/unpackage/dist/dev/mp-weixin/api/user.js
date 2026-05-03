"use strict";
const utils_request = require("../utils/request.js");
const register = (data) => {
  return utils_request.request.post("/children/register", {
    data: {
      name: data.name,
      account: data.account,
      password: data.password,
      phone: data.phone
    }
  });
};
exports.register = register;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/user.js.map
