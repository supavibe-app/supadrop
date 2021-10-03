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
const supabaseClient_1 = require("../../supabaseClient");
const CurrentUserBadge = (props) => {
    const { wallet, publicKey } = wallet_adapter_react_1.useWallet();
    const [showEditProfile, setShowEditProfile] = react_1.useState(false);
    const [showPopover, setShowPopover] = react_1.useState(false);
    const [name, setName] = react_1.useState('');
    const [username, setUsername] = react_1.useState('');
    const [twitter, setTwitter] = react_1.useState('');
    const [website, setWebsite] = react_1.useState('');
    const [bio, setBio] = react_1.useState('');
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
        react_1.default.createElement("div", { className: style_1.WalletWrapper },
            react_1.default.createElement(antd_1.Popover, { overlayClassName: style_1.ProfilePopover, color: "#000000", content: react_1.default.createElement(Settings_1.Settings, { setShowEdit: handleShowEditProfile }), trigger: "click", placement: "bottomRight", onVisibleChange: visible => setShowPopover(visible), visible: showPopover },
                react_1.default.createElement(antd_1.Avatar, { src: wallet.icon, size: 42, style: { cursor: 'pointer' } }))),
        react_1.default.createElement(antd_1.Modal, { className: style_1.ModalEditProfile, title: "edit profile", visible: showEditProfile, onCancel: () => setShowEditProfile(false), footer: [
                react_1.default.createElement(antd_1.Button, { key: "save", type: "link", style: { fontWeight: 'bold' }, onClick: () => {
                        console.log(name);
                        console.log(username);
                        console.log(twitter);
                        console.log(website);
                        console.log(bio);
                        supabaseClient_1.supabase.from('user_data')
                            .update({
                            name, twitter, username, website, bio
                        })
                            .eq('wallet_address', base58)
                            .then();
                        setShowEditProfile(false);
                    } }, "save"),
            ] },
            react_1.default.createElement("input", { type: "text", style: {
                    color: 'black',
                    borderColor: 'gray',
                    borderWidth: 1,
                }, onChange: text => setName(text.target.value) }),
            react_1.default.createElement("input", { type: "text", style: {
                    color: 'black',
                    borderColor: 'gray',
                    borderWidth: 1,
                }, onChange: text => setUsername(text.target.value) }),
            react_1.default.createElement("input", { type: "text", style: {
                    color: 'black',
                    borderColor: 'gray',
                    borderWidth: 1,
                }, onChange: text => setTwitter(text.target.value) }),
            react_1.default.createElement("input", { type: "text", style: {
                    color: 'black',
                    borderColor: 'gray',
                    borderWidth: 1,
                }, onChange: text => setWebsite(text.target.value) }),
            react_1.default.createElement("input", { type: "text", style: {
                    color: 'black',
                    borderColor: 'gray',
                    borderWidth: 1,
                }, onChange: text => setBio(text.target.value) }))));
};
exports.CurrentUserBadge = CurrentUserBadge;
//# sourceMappingURL=index.js.map