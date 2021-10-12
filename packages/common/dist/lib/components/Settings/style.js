"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressInfo = exports.BalanceInfo = exports.ItemIcon = exports.ListStyle = void 0;
const css_1 = require("@emotion/css");
exports.ListStyle = css_1.css `
  font-weight: bold;
  width: 180px;

  .ant-list-item {
    display: flex;
    justify-content: start;
    cursor: pointer;
    padding: 20px 0;
  }

  .ant-popover-inner-content {
    padding: 4px 0 4px 24px;
  }
`;
exports.ItemIcon = css_1.css `
  margin-right: 20px;
`;
exports.BalanceInfo = css_1.css `
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  color: #fafafb;
`;
exports.AddressInfo = css_1.css `
  display: flex;

  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  color: #7e7c7c;

  div {
    margin-right: 8px;
  }
`;
//# sourceMappingURL=style.js.map