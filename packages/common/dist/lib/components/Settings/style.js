"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemIcon = exports.ListStyle = void 0;
const css_1 = require("@emotion/css");
exports.ListStyle = css_1.css `
  font-weight: bold;
  width: 180px;
  
  .ant-list-item {
    display: flex;
    justify-content: start;
    cursor: pointer;
  }
`;
exports.ItemIcon = css_1.css `
  margin-right: 20px;
`;
//# sourceMappingURL=style.js.map