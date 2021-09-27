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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
const react_1 = __importStar(require("react"));
const antd_1 = require("antd");
const feather_icons_react_1 = __importDefault(require("feather-icons-react"));
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const connection_1 = require("../../contexts/connection");
const contexts_1 = require("../../contexts");
const style_1 = require("./style");
const Settings = ({ additionalSettings, setShowEdit = () => { } }) => {
    const { connected, disconnect, publicKey } = wallet_adapter_react_1.useWallet();
    const { endpoint, setEndpoint } = connection_1.useConnectionConfig();
    const { setVisible } = contexts_1.useWalletModal();
    const open = react_1.useCallback(() => setVisible(true), [setVisible]);
    //   return (
    //     <>
    //       <div style={{ display: 'grid' }}>
    //         Network:{' '}
    //         <Select
    //           onSelect={setEndpoint}
    //           value={endpoint}
    //           style={{ marginBottom: 20 }}
    //         >
    //           {ENDPOINTS.map(({ name, endpoint }) => (
    //             <Select.Option value={endpoint} key={endpoint}>
    //               {name}
    //             </Select.Option>
    //           ))}
    //         </Select>
    //         {connected && (
    //           <>
    //             <span>Wallet:</span>
    //             {publicKey && (
    //               <Button
    //                 style={{ marginBottom: 5 }}
    //                 onClick={async () => {
    //                   if (publicKey) {
    //                     await navigator.clipboard.writeText(publicKey.toBase58());
    //                     notify({
    //                       message: 'Wallet update',
    //                       description: 'Address copied to clipboard',
    //                     });
    //                   }
    //                 }}
    //               >
    //                 <CopyOutlined />
    //                 {shortenAddress(publicKey.toBase58())}
    //               </Button>
    //             )}
    //
    //             <Button onClick={open} style={{ marginBottom: 5 }}>
    //               Change
    //             </Button>
    //             <Button
    //               type="primary"
    //               onClick={() => disconnect().catch()}
    //               style={{ marginBottom: 5 }}
    //             >
    //               Disconnect
    //             </Button>
    //           </>
    //         )}
    //         {additionalSettings}
    //       </div>
    //     </>
    //   );
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(antd_1.List, { className: style_1.ListStyle },
            react_1.default.createElement(antd_1.List.Item, { onClick: () => setShowEdit() },
                react_1.default.createElement(antd_1.Avatar, { className: style_1.ItemIcon, src: "https://cdn.discordapp.com/attachments/459348449415004161/888712098589319168/Frame_40_1.png" }),
                "edit profile"),
            react_1.default.createElement(antd_1.List.Item, { onClick: () => disconnect().catch() },
                react_1.default.createElement(feather_icons_react_1.default, { icon: "power", className: style_1.ItemIcon }),
                "disconnect")),
        additionalSettings));
};
exports.Settings = Settings;
//# sourceMappingURL=index.js.map