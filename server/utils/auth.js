const jwt = require("jsonwebtoken");

const secret = `,|!$+:z:%@?-L;~H@Q1D>baG(/^Xz.C(_L+x'4wYf5H(wRCL*{:O(,Zz%%[5"%]`;
const expiration = "2h";

module.exports = {
  signToken: function ({ email, username, _id }) {
    const payload = { email, username, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
