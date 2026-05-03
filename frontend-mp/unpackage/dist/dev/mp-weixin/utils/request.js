"use strict";
const common_vendor = require("../common/vendor.js");
let accessToken = common_vendor.index.getStorageSync("accessToken") || "";
let refreshToken = common_vendor.index.getStorageSync("refreshToken") || "";
const updateTokens = (newAccessToken, newRefreshToken) => {
  accessToken = newAccessToken;
  refreshToken = newRefreshToken;
  common_vendor.index.setStorageSync("accessToken", newAccessToken);
  common_vendor.index.setStorageSync("refreshToken", newRefreshToken);
};
const createRequest = (config) => {
  const defaultConfig = {
    baseURL: "http://localhost:8080",
    header: {
      "Content-Type": "application/json",
      "accessToken": accessToken,
      "refreshToken": refreshToken
    }
  };
  const finalConfig = Object.assign(Object.assign(Object.assign({}, defaultConfig), config), { url: `${defaultConfig.baseURL}${config.url}`, header: Object.assign(Object.assign({}, defaultConfig.header), config.header || {}) });
  if (accessToken && refreshToken) {
    finalConfig.header = Object.assign(Object.assign({}, finalConfig.header), { "accessToken": accessToken, "refreshToken": refreshToken });
  }
  return new Promise((resolve, reject) => {
    common_vendor.index.request(Object.assign(Object.assign({}, finalConfig), { success: (res) => {
      var _a, _b, _c, _d;
      const headers = res.header || {};
      const lowerCaseHeaders = {};
      Object.keys(headers).forEach((key) => {
        lowerCaseHeaders[key.toLowerCase()] = headers[key];
      });
      const newAccessToken = lowerCaseHeaders["accesstoken"] || lowerCaseHeaders["access-token"] || lowerCaseHeaders["access_token"] || ((_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.accessToken);
      const newRefreshToken = lowerCaseHeaders["refreshtoken"] || lowerCaseHeaders["refresh-token"] || lowerCaseHeaders["refresh_token"] || ((_d = (_c = res.data) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.refreshToken);
      if (newAccessToken && newRefreshToken) {
        common_vendor.index.__f__("log", "at utils/request.ts:93", "发现新的 token，正在更新...");
        updateTokens(newAccessToken, newRefreshToken);
        finalConfig.header = Object.assign(Object.assign({}, finalConfig.header), { "accessToken": newAccessToken, "refreshToken": newRefreshToken });
      }
      resolve(res);
    }, fail: (err) => {
      reject(err);
    } }));
  });
};
const request = (url, config = {}) => {
  return createRequest(Object.assign(Object.assign({}, config), { url }));
};
request.get = (url, config) => {
  return createRequest(Object.assign(Object.assign({}, config), { url, method: "GET" }));
};
request.post = (url, config) => {
  return createRequest(Object.assign(Object.assign({}, config), { url, method: "POST" }));
};
request.put = (url, data, config) => {
  return createRequest(Object.assign(Object.assign({}, config), { url, data, method: "PUT" }));
};
request.delete = (url, config) => {
  return createRequest(Object.assign(Object.assign({}, config), { url, method: "DELETE" }));
};
exports.request = request;
exports.updateTokens = updateTokens;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
