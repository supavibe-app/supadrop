"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
const react_1 = __importDefault(require("react"));
const antd_1 = require("antd");
const feather_icons_react_1 = __importDefault(require("feather-icons-react"));
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const react_router_dom_1 = require("react-router-dom");
const utils_1 = require("../../utils");
const __1 = require("../..");
const style_1 = require("./style");
const web3_js_1 = require("@solana/web3.js");
const Settings = ({ additionalSettings, setShowPopover = () => { } }) => {
    const { disconnect, publicKey } = wallet_adapter_react_1.useWallet();
    const { push } = react_router_dom_1.useHistory();
    const { account } = __1.useNativeAccount();
    const balance = __1.formatNumber.format(((account === null || account === void 0 ? void 0 : account.lamports) || 0) / web3_js_1.LAMPORTS_PER_SOL);
    return (react_1.default.createElement(antd_1.List, { className: style_1.ListStyle },
        react_1.default.createElement(antd_1.List.Item, null,
            react_1.default.createElement("div", { onClick: () => {
                    setShowPopover(false);
                    push(`/${publicKey}`);
                } },
                react_1.default.createElement(antd_1.Avatar, { className: style_1.ItemIcon }),
                "view profile")),
        react_1.default.createElement(antd_1.List.Item, null, publicKey && (react_1.default.createElement("a", { href: `https://explorer.solana.com/address/${publicKey.toBase58()}`, target: "_blank" },
            react_1.default.createElement("div", { className: style_1.BalanceInfo },
                balance,
                " SOL"),
            react_1.default.createElement("div", { className: style_1.AddressInfo },
                react_1.default.createElement("div", null,
                    publicKey && utils_1.shortenAddress(publicKey.toBase58()),
                    ' '),
                react_1.default.createElement(feather_icons_react_1.default, { icon: "external-link", size: "16" }))))),
        react_1.default.createElement(antd_1.List.Item, { onClick: () => disconnect().catch() },
            react_1.default.createElement(feather_icons_react_1.default, { icon: "power", className: style_1.ItemIcon }),
            "disconnect")));
};
exports.Settings = Settings;
//# sourceMappingURL=index.js.map