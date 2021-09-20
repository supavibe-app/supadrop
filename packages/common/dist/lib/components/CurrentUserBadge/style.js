"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalEditProfile = exports.ProfilePopover = exports.BalanceStyle = exports.AddressStyle = exports.DetailBox = exports.ProfileContainer = void 0;
const css_1 = require("@emotion/css");
exports.ProfileContainer = css_1.css `
  display: flex;
`;
exports.DetailBox = css_1.css `
  margin-right: 12px;
  cursor: pointer;
`;
exports.AddressStyle = css_1.css `
  line-height: normal;
  text-align: right;

  color: #7e7c7c;
  font-size: 12px;
`;
exports.BalanceStyle = css_1.css `
  line-height: normal;
  text-align: right;

  font-weight: 700;
  font-size: 16px;

  margin-bottom: 4px;
`;
exports.ProfilePopover = css_1.css `
  .ant-popover-inner {
    border: 1px solid yellow;
    border-radius: 4px;
  }

  .ant-popover-inner-content {
    padding-right: 0;
  }
`;
exports.ModalEditProfile = css_1.css `
  .ant-modal-title {
    font-weight: bold;
    border-bottom: unset;
  }
`;
//# sourceMappingURL=style.js.map