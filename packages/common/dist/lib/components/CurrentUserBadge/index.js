"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUserBadge = void 0;
const react_1 = __importStar(require("react"));
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const antd_1 = require("antd");
const Settings_1 = require("../Settings");
const style_1 = require("./style");
const CurrentUserBadge = (props) => {
    const { wallet, publicKey } = wallet_adapter_react_1.useWallet();
    const [showPopover, setShowPopover] = react_1.useState(false);
    if (!wallet || !publicKey) {
        return null;
    }
    return (react_1.default.createElement("div", { className: style_1.WalletWrapper },
        react_1.default.createElement(antd_1.Popover, { overlayClassName: style_1.ProfilePopover, color: "#000000", content: react_1.default.createElement(Settings_1.Settings, { setShowPopover: setShowPopover }), trigger: "click", placement: "bottomRight", onVisibleChange: visible => setShowPopover(visible), visible: showPopover },
            react_1.default.createElement(antd_1.Avatar, { size: 42, style: { cursor: 'pointer' } }))));
};
exports.CurrentUserBadge = CurrentUserBadge;
//# sourceMappingURL=index.js.map