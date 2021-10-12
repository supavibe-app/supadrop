"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletWrapper = exports.ModalEditProfile = exports.ProfilePopover = void 0;
const css_1 = require("@emotion/css");
exports.ProfilePopover = css_1.css `
  .ant-popover-inner {
    border: 2px solid #ccff00;
    border-radius: 4px;
  }

  .ant-popover-inner-content {
    padding: 4px 0 4px 24px;
  }
`;
exports.ModalEditProfile = css_1.css `
  .ant-modal-title {
    font-weight: bold;
    border-bottom: unset;
  }
`;
exports.WalletWrapper = css_1.css `
  padding-left: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  white-space: nowrap;
`;
//# sourceMappingURL=style.js.map