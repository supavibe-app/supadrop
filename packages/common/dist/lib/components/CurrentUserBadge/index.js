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
const web3_js_1 = require("@solana/web3.js");
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const antd_1 = require("antd");
const accounts_1 = require("../../contexts/accounts");
const utils_1 = require("../../utils");
const Settings_1 = require("../Settings");
const style_1 = require("./style");
const CurrentUserBadge = (props) => {
    const { wallet, publicKey } = wallet_adapter_react_1.useWallet();
    const { account } = accounts_1.useNativeAccount();
    const [showEditProfile, setShowEditProfile] = react_1.useState(false);
    const [showPopover, setShowPopover] = react_1.useState(false);
    const base58 = (publicKey === null || publicKey === void 0 ? void 0 : publicKey.toBase58()) || '';
    const keyToDisplay = base58.length > 12
        ? `${base58.substring(0, 4)}...${base58.substring(base58.length - 4, base58.length)}`
        : base58;
    if (!wallet || !publicKey) {
        return null;
    }
    const handleShowEditProfile = () => {
        setShowEditProfile(true);
        setShowPopover(false);
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: "wallet-wrapper" },
            react_1.default.createElement(antd_1.Popover, { overlayClassName: style_1.ProfilePopover, color: "#000000", content: react_1.default.createElement(Settings_1.Settings, { setShowEdit: handleShowEditProfile }), trigger: "click", onVisibleChange: visible => setShowPopover(visible), visible: showPopover },
                react_1.default.createElement("div", { className: style_1.ProfileContainer },
                    react_1.default.createElement("div", { className: style_1.DetailBox },
                        react_1.default.createElement("div", { className: style_1.BalanceStyle },
                            utils_1.formatNumber.format(((account === null || account === void 0 ? void 0 : account.lamports) || 0) / web3_js_1.LAMPORTS_PER_SOL),
                            " SOL"),
                        react_1.default.createElement("div", { className: style_1.AddressStyle }, keyToDisplay)),
                    react_1.default.createElement(antd_1.Avatar, { src: wallet.icon, size: 42, style: { cursor: 'pointer' } })))),
        react_1.default.createElement(antd_1.Modal, { className: style_1.ModalEditProfile, title: "edit profile", visible: showEditProfile, onCancel: () => setShowEditProfile(false), footer: [
                react_1.default.createElement(antd_1.Button, { key: "save", type: "link", style: { fontWeight: 'bold' }, disabled: true }, "save"),
            ] }, "huyu")));
};
exports.CurrentUserBadge = CurrentUserBadge;
//# sourceMappingURL=index.js.map