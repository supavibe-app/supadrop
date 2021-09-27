#!/usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var commander_1 = require("commander");
var anchor = __importStar(require("@project-serum/anchor"));
var web3_js_1 = require("@solana/web3.js");
var spl_token_1 = require("@solana/spl-token");
var constants_1 = require("./helpers/constants");
var accounts_1 = require("./helpers/accounts");
var various_1 = require("./helpers/various");
var instructions_1 = require("./helpers/instructions");
var transactions_1 = require("./helpers/transactions");
commander_1.program.version('0.0.1');
if (!fs.existsSync(constants_1.CACHE_PATH)) {
    fs.mkdirSync(constants_1.CACHE_PATH);
}
var FAIR_LAUNCH_LOTTERY_SIZE = 8 + // discriminator
    32 + // fair launch
    1 + // bump
    8; // size of bitmask ones
commander_1.program
    .command('new_fair_launch')
    .option('-e, --env <string>', 'Solana cluster env name', 'devnet')
    .option('-k, --keypair <path>', "Solana wallet location", '--keypair not provided')
    .option('-u, --uuid <string>', 'uuid')
    .option('-f, --fee <string>', 'fee', '2')
    .option('-s, --price-range-start <string>', 'price range start', '1')
    .option('-pe, --price-range-end <string>', 'price range end', '2')
    .option('-arbp, --anti-rug-reserve-bp <string>', 'optional anti-rug treasury reserve basis points (1-10000)')
    .option('-atc, --anti-rug-token-requirement <string>', 'optional anti-rug token requirement when reserve opens - 100 means 100 tokens remaining out of total supply')
    .option('-sd, --self-destruct-date <string>', 'optional date when funds from anti-rug setting will be returned - eg "04 Dec 1995 00:12:00 GMT"')
    .option('-pos, --phase-one-start-date <string>', 'timestamp - eg "04 Dec 1995 00:12:00 GMT"')
    .option('-poe, --phase-one-end-date <string>', 'timestamp - eg "04 Dec 1995 00:12:00 GMT"')
    .option('-pte, --phase-two-end-date <string>', 'timestamp - eg "04 Dec 1995 00:12:00 GMT"')
    .option('-ld, --lottery-duration <string>', 'seconds eg 86400')
    .option('-ts, --tick-size <string>', 'tick size', '0.1')
    .option('-n, --number-of-tokens <number>', 'Number of tokens to sell')
    .option('-mint, --treasury-mint <string>', 'token mint to take as payment instead of sol')
    .action(function (_, cmd) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, keypair, env, priceRangeStart, priceRangeEnd, phaseOneStartDate, phaseOneEndDate, phaseTwoEndDate, tickSize, numberOfTokens, fee, uuid, selfDestructDate, antiRugTokenRequirement, antiRugReserveBp, lotteryDuration, treasuryMint, antiRugTokenRequirementNumber, antiRugReserveBpNumber, selfDestructDateActual, antiRug, parsedNumber, priceRangeStartNumber, priceRangeEndNumber, tickSizeNumber, feeNumber, realUuid, phaseOneStartDateActual, phaseOneEndDateActual, phaseTwoEndDateActual, lotteryDurationActual, walletKeyPair, anchorProgram, token, mintInfo, mantissa, _b, tokenMint, tokenBump, _c, fairLaunch, fairLaunchBump, _d, treasury, treasuryBump, remainingAccounts;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = cmd.opts(), keypair = _a.keypair, env = _a.env, priceRangeStart = _a.priceRangeStart, priceRangeEnd = _a.priceRangeEnd, phaseOneStartDate = _a.phaseOneStartDate, phaseOneEndDate = _a.phaseOneEndDate, phaseTwoEndDate = _a.phaseTwoEndDate, tickSize = _a.tickSize, numberOfTokens = _a.numberOfTokens, fee = _a.fee, uuid = _a.uuid, selfDestructDate = _a.selfDestructDate, antiRugTokenRequirement = _a.antiRugTokenRequirement, antiRugReserveBp = _a.antiRugReserveBp, lotteryDuration = _a.lotteryDuration, treasuryMint = _a.treasuryMint;
                antiRugTokenRequirementNumber = antiRugTokenRequirement
                    ? parseInt(antiRugTokenRequirement)
                    : null;
                antiRugReserveBpNumber = antiRugReserveBp
                    ? parseInt(antiRugReserveBp)
                    : null;
                selfDestructDateActual = selfDestructDate
                    ? Date.parse(selfDestructDate) / 1000
                    : null;
                antiRug = antiRugTokenRequirementNumber &&
                    antiRugReserveBpNumber &&
                    selfDestructDateActual
                    ? {
                        reserveBp: antiRugReserveBpNumber,
                        tokenRequirement: new anchor.BN(antiRugTokenRequirementNumber),
                        selfDestructDate: new anchor.BN(selfDestructDateActual),
                    }
                    : null;
                parsedNumber = parseInt(numberOfTokens);
                priceRangeStartNumber = parseFloat(priceRangeStart);
                priceRangeEndNumber = parseFloat(priceRangeEnd);
                tickSizeNumber = parseFloat(tickSize);
                feeNumber = parseFloat(fee);
                realUuid = uuid.slice(0, 6);
                phaseOneStartDateActual = (phaseOneStartDate ? Date.parse(phaseOneStartDate) : Date.now()) / 1000;
                phaseOneEndDateActual = (phaseOneEndDate ? Date.parse(phaseOneEndDate) : Date.now() + 86400000) /
                    1000;
                phaseTwoEndDateActual = (phaseTwoEndDate
                    ? Date.parse(phaseTwoEndDate)
                    : Date.now() + 2 * 86400000) / 1000;
                lotteryDurationActual = lotteryDuration ? lotteryDuration : 86400;
                walletKeyPair = accounts_1.loadWalletKey(keypair);
                return [4 /*yield*/, accounts_1.loadFairLaunchProgram(walletKeyPair, env)];
            case 1:
                anchorProgram = _e.sent();
                if (!!treasuryMint) return [3 /*break*/, 2];
                priceRangeStartNumber = Math.ceil(priceRangeStartNumber * web3_js_1.LAMPORTS_PER_SOL);
                priceRangeEndNumber = Math.ceil(priceRangeEndNumber * web3_js_1.LAMPORTS_PER_SOL);
                tickSizeNumber = Math.ceil(tickSizeNumber * web3_js_1.LAMPORTS_PER_SOL);
                feeNumber = Math.ceil(feeNumber * web3_js_1.LAMPORTS_PER_SOL);
                return [3 /*break*/, 4];
            case 2:
                token = new spl_token_1.Token(anchorProgram.provider.connection, 
                //@ts-ignore
                new anchor.web3.PublicKey(treasuryMint), constants_1.TOKEN_PROGRAM_ID, walletKeyPair);
                return [4 /*yield*/, token.getMintInfo()];
            case 3:
                mintInfo = _e.sent();
                mantissa = Math.pow(10, mintInfo.decimals);
                priceRangeStartNumber = Math.ceil(priceRangeStartNumber * mantissa);
                priceRangeEndNumber = Math.ceil(priceRangeEndNumber * mantissa);
                tickSizeNumber = Math.ceil(tickSizeNumber * mantissa);
                feeNumber = Math.ceil(feeNumber * mantissa);
                _e.label = 4;
            case 4: return [4 /*yield*/, accounts_1.getTokenMint(walletKeyPair.publicKey, realUuid)];
            case 5:
                _b = __read.apply(void 0, [_e.sent(), 2]), tokenMint = _b[0], tokenBump = _b[1];
                return [4 /*yield*/, accounts_1.getFairLaunch(tokenMint)];
            case 6:
                _c = __read.apply(void 0, [_e.sent(), 2]), fairLaunch = _c[0], fairLaunchBump = _c[1];
                return [4 /*yield*/, accounts_1.getTreasury(tokenMint)];
            case 7:
                _d = __read.apply(void 0, [_e.sent(), 2]), treasury = _d[0], treasuryBump = _d[1];
                remainingAccounts = !treasuryMint
                    ? []
                    : [
                        {
                            pubkey: new anchor.web3.PublicKey(treasuryMint),
                            isWritable: false,
                            isSigner: false,
                        },
                    ];
                return [4 /*yield*/, anchorProgram.rpc.initializeFairLaunch(fairLaunchBump, treasuryBump, tokenBump, {
                        uuid: realUuid,
                        priceRangeStart: new anchor.BN(priceRangeStartNumber),
                        priceRangeEnd: new anchor.BN(priceRangeEndNumber),
                        phaseOneStart: new anchor.BN(phaseOneStartDateActual),
                        phaseOneEnd: new anchor.BN(phaseOneEndDateActual),
                        phaseTwoEnd: new anchor.BN(phaseTwoEndDateActual),
                        lotteryDuration: new anchor.BN(lotteryDurationActual),
                        tickSize: new anchor.BN(tickSizeNumber),
                        numberOfTokens: new anchor.BN(parsedNumber),
                        fee: new anchor.BN(feeNumber),
                        antiRugSetting: antiRug,
                    }, {
                        accounts: {
                            fairLaunch: fairLaunch,
                            tokenMint: tokenMint,
                            treasury: treasury,
                            authority: walletKeyPair.publicKey,
                            payer: walletKeyPair.publicKey,
                            tokenProgram: constants_1.TOKEN_PROGRAM_ID,
                            systemProgram: anchor.web3.SystemProgram.programId,
                            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                        },
                        remainingAccounts: remainingAccounts,
                        signers: [],
                    })];
            case 8:
                _e.sent();
                console.log("create fair launch Done: " + fairLaunch.toBase58());
                return [2 /*return*/];
        }
    });
}); });
commander_1.program
    .command('update_fair_launch')
    .option('-e, --env <string>', 'Solana cluster env name', 'devnet')
    .option('-k, --keypair <path>', "Solana wallet location", '--keypair not provided')
    .option('-u, --uuid <string>', 'uuid')
    .option('-f, --fee <string>', 'price range end', '2')
    .option('-s, --price-range-start <string>', 'price range start', '1')
    .option('-pe, --price-range-end <string>', 'price range end', '2')
    .option('-arbp, --anti-rug-reserve-bp <string>', 'optional anti-rug treasury reserve basis points (1-10000)')
    .option('-atc, --anti-rug-token-requirement <string>', 'optional anti-rug token requirement when reserve opens - 100 means 100 tokens remaining out of total supply')
    .option('-sd, --self-destruct-date <string>', 'optional date when funds from anti-rug setting will be returned - eg "04 Dec 1995 00:12:00 GMT"')
    .option('-pos, --phase-one-start-date <string>', 'timestamp - eg "04 Dec 1995 00:12:00 GMT"')
    .option('-poe, --phase-one-end-date <string>', 'timestamp - eg "04 Dec 1995 00:12:00 GMT"')
    .option('-ld, --lottery-duration <string>', 'seconds eg 86400')
    .option('-pte, --phase-two-end-date <string>', 'timestamp - eg "04 Dec 1995 00:12:00 GMT"')
    .option('-ts, --tick-size <string>', 'tick size', '0.1')
    .option('-n, --number-of-tokens <number>', 'Number of tokens to sell')
    .option('-mint, --token-mint <string>', 'token mint to take as payment instead of sol')
    .action(function (_, cmd) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, keypair, env, priceRangeStart, priceRangeEnd, phaseOneStartDate, phaseOneEndDate, phaseTwoEndDate, tickSize, numberOfTokens, fee, mint, uuid, selfDestructDate, antiRugTokenRequirement, antiRugReserveBp, lotteryDuration, antiRugTokenRequirementNumber, antiRugReserveBpNumber, selfDestructDateActual, antiRug, parsedNumber, priceRangeStartNumber, priceRangeEndNumber, tickSizeNumber, feeNumber, realUuid, phaseOneStartDateActual, phaseOneEndDateActual, phaseTwoEndDateActual, lotteryDurationActual, walletKeyPair, anchorProgram, token, mintInfo, mantissa, tokenMint, fairLaunch;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = cmd.opts(), keypair = _a.keypair, env = _a.env, priceRangeStart = _a.priceRangeStart, priceRangeEnd = _a.priceRangeEnd, phaseOneStartDate = _a.phaseOneStartDate, phaseOneEndDate = _a.phaseOneEndDate, phaseTwoEndDate = _a.phaseTwoEndDate, tickSize = _a.tickSize, numberOfTokens = _a.numberOfTokens, fee = _a.fee, mint = _a.mint, uuid = _a.uuid, selfDestructDate = _a.selfDestructDate, antiRugTokenRequirement = _a.antiRugTokenRequirement, antiRugReserveBp = _a.antiRugReserveBp, lotteryDuration = _a.lotteryDuration;
                antiRugTokenRequirementNumber = antiRugTokenRequirement
                    ? parseInt(antiRugTokenRequirement)
                    : null;
                antiRugReserveBpNumber = antiRugReserveBp
                    ? parseInt(antiRugReserveBp)
                    : null;
                selfDestructDateActual = selfDestructDate
                    ? Date.parse(selfDestructDate) / 1000
                    : null;
                antiRug = antiRugTokenRequirementNumber &&
                    antiRugReserveBpNumber &&
                    selfDestructDateActual
                    ? {
                        reserveBp: antiRugReserveBpNumber,
                        tokenRequirement: new anchor.BN(antiRugTokenRequirementNumber),
                        selfDestructDate: new anchor.BN(selfDestructDateActual),
                    }
                    : null;
                parsedNumber = parseInt(numberOfTokens);
                priceRangeStartNumber = parseFloat(priceRangeStart);
                priceRangeEndNumber = parseFloat(priceRangeEnd);
                tickSizeNumber = parseFloat(tickSize);
                feeNumber = parseFloat(fee);
                realUuid = uuid.slice(0, 6);
                phaseOneStartDateActual = (phaseOneStartDate ? Date.parse(phaseOneStartDate) : Date.now()) / 1000;
                phaseOneEndDateActual = (phaseOneEndDate ? Date.parse(phaseOneEndDate) : Date.now() + 86400000) /
                    1000;
                phaseTwoEndDateActual = (phaseTwoEndDate
                    ? Date.parse(phaseTwoEndDate)
                    : Date.now() + 2 * 86400000) / 1000;
                lotteryDurationActual = lotteryDuration ? lotteryDuration : 86400;
                walletKeyPair = accounts_1.loadWalletKey(keypair);
                return [4 /*yield*/, accounts_1.loadFairLaunchProgram(walletKeyPair, env)];
            case 1:
                anchorProgram = _b.sent();
                if (!!mint) return [3 /*break*/, 2];
                priceRangeStartNumber = Math.ceil(priceRangeStartNumber * web3_js_1.LAMPORTS_PER_SOL);
                priceRangeEndNumber = Math.ceil(priceRangeEndNumber * web3_js_1.LAMPORTS_PER_SOL);
                tickSizeNumber = Math.ceil(tickSizeNumber * web3_js_1.LAMPORTS_PER_SOL);
                feeNumber = Math.ceil(feeNumber * web3_js_1.LAMPORTS_PER_SOL);
                return [3 /*break*/, 4];
            case 2:
                token = new spl_token_1.Token(anchorProgram.provider.connection, 
                //@ts-ignore
                fairLaunchObj.treasuryMint, constants_1.TOKEN_PROGRAM_ID, walletKeyPair);
                return [4 /*yield*/, token.getMintInfo()];
            case 3:
                mintInfo = _b.sent();
                mantissa = Math.pow(10, mintInfo.decimals);
                priceRangeStartNumber = Math.ceil(priceRangeStartNumber * mantissa);
                priceRangeEndNumber = Math.ceil(priceRangeEndNumber * mantissa);
                tickSizeNumber = Math.ceil(tickSizeNumber * mantissa);
                feeNumber = Math.ceil(feeNumber * mantissa);
                _b.label = 4;
            case 4: return [4 /*yield*/, accounts_1.getTokenMint(walletKeyPair.publicKey, realUuid)];
            case 5:
                tokenMint = (_b.sent())[0];
                return [4 /*yield*/, accounts_1.getFairLaunch(tokenMint)];
            case 6:
                fairLaunch = (_b.sent())[0];
                return [4 /*yield*/, anchorProgram.rpc.updateFairLaunch({
                        uuid: realUuid,
                        priceRangeStart: new anchor.BN(priceRangeStartNumber),
                        priceRangeEnd: new anchor.BN(priceRangeEndNumber),
                        phaseOneStart: new anchor.BN(phaseOneStartDateActual),
                        phaseOneEnd: new anchor.BN(phaseOneEndDateActual),
                        phaseTwoEnd: new anchor.BN(phaseTwoEndDateActual),
                        lotteryDuration: new anchor.BN(lotteryDurationActual),
                        tickSize: new anchor.BN(tickSizeNumber),
                        numberOfTokens: new anchor.BN(parsedNumber),
                        fee: new anchor.BN(feeNumber),
                        antiRugSetting: antiRug,
                    }, {
                        accounts: {
                            fairLaunch: fairLaunch,
                            authority: walletKeyPair.publicKey,
                            clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
                        },
                    })];
            case 7:
                _b.sent();
                console.log("Updated fair launch Done: " + fairLaunch.toBase58());
                return [2 /*return*/];
        }
    });
}); });
commander_1.program
    .command('purchase_ticket')
    .option('-e, --env <string>', 'Solana cluster env name', 'devnet')
    .option('-k, --keypair <path>', "Solana wallet location", '--keypair not provided')
    .option('-f, --fair-launch <string>', 'fair launch id')
    .option('-a, --amount <string>', 'amount')
    .action(function (_, cmd) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, env, keypair, fairLaunch, amount, amountNumber, walletKeyPair, anchorProgram, fairLaunchKey, fairLaunchObj, _b, fairLaunchTicket, bump, remainingAccounts, instructions, signers, tokenAta, _c, transferAuthority, token, mintInfo, _d, _e, fairLaunchTicketObj, i, e_1, _f, fairLaunchTicketSeqLookup, seqBump;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _a = cmd.opts(), env = _a.env, keypair = _a.keypair, fairLaunch = _a.fairLaunch, amount = _a.amount;
                amountNumber = parseFloat(amount);
                walletKeyPair = accounts_1.loadWalletKey(keypair);
                return [4 /*yield*/, accounts_1.loadFairLaunchProgram(walletKeyPair, env)];
            case 1:
                anchorProgram = _g.sent();
                fairLaunchKey = new anchor.web3.PublicKey(fairLaunch);
                return [4 /*yield*/, anchorProgram.account.fairLaunch.fetch(fairLaunchKey)];
            case 2:
                fairLaunchObj = _g.sent();
                return [4 /*yield*/, accounts_1.getFairLaunchTicket(
                    //@ts-ignore
                    fairLaunchObj.tokenMint, walletKeyPair.publicKey)];
            case 3:
                _b = __read.apply(void 0, [_g.sent(), 2]), fairLaunchTicket = _b[0], bump = _b[1];
                remainingAccounts = [];
                instructions = [];
                signers = [];
                if (!fairLaunchObj.treasuryMint) return [3 /*break*/, 5];
                return [4 /*yield*/, accounts_1.getAtaForMint(
                    //@ts-ignore
                    fairLaunchObj.treasuryMint, walletKeyPair.publicKey)];
            case 4:
                _c = (_g.sent())[0];
                return [3 /*break*/, 6];
            case 5:
                _c = undefined;
                _g.label = 6;
            case 6:
                tokenAta = _c;
                if (!!fairLaunchObj.treasuryMint) return [3 /*break*/, 7];
                amountNumber = Math.ceil(amountNumber * web3_js_1.LAMPORTS_PER_SOL);
                return [3 /*break*/, 9];
            case 7:
                transferAuthority = anchor.web3.Keypair.generate();
                signers.push(transferAuthority);
                token = new spl_token_1.Token(anchorProgram.provider.connection, 
                //@ts-ignore
                fairLaunchObj.treasuryMint, constants_1.TOKEN_PROGRAM_ID, walletKeyPair);
                return [4 /*yield*/, token.getMintInfo()];
            case 8:
                mintInfo = _g.sent();
                amountNumber = Math.ceil(amountNumber * Math.pow(10, mintInfo.decimals));
                instructions.push(spl_token_1.Token.createApproveInstruction(constants_1.TOKEN_PROGRAM_ID, 
                //@ts-ignore
                tokenAta, transferAuthority.publicKey, walletKeyPair.publicKey, [], amountNumber * Math.pow(10, mintInfo.decimals) +
                    //@ts-ignore
                    fairLaunchObj.data.fee.toNumber()));
                remainingAccounts.push({
                    //@ts-ignore
                    pubkey: fairLaunchObj.treasuryMint,
                    isWritable: true,
                    isSigner: false,
                });
                remainingAccounts.push({
                    pubkey: tokenAta,
                    isWritable: true,
                    isSigner: false,
                });
                remainingAccounts.push({
                    pubkey: transferAuthority.publicKey,
                    isWritable: false,
                    isSigner: true,
                });
                remainingAccounts.push({
                    pubkey: constants_1.TOKEN_PROGRAM_ID,
                    isWritable: false,
                    isSigner: false,
                });
                _g.label = 9;
            case 9:
                _e = (_d = instructions).push;
                return [4 /*yield*/, anchorProgram.instruction.purchaseTicket(bump, new anchor.BN(amountNumber), {
                        accounts: {
                            fairLaunchTicket: fairLaunchTicket,
                            fairLaunch: fairLaunch,
                            //@ts-ignore
                            treasury: fairLaunchObj.treasury,
                            buyer: walletKeyPair.publicKey,
                            payer: walletKeyPair.publicKey,
                            systemProgram: anchor.web3.SystemProgram.programId,
                            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                            clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
                        },
                        remainingAccounts: remainingAccounts,
                    })];
            case 10:
                _e.apply(_d, [_g.sent()]);
                if (tokenAta) {
                    instructions.push(spl_token_1.Token.createRevokeInstruction(constants_1.TOKEN_PROGRAM_ID, tokenAta, walletKeyPair.publicKey, []));
                }
                return [4 /*yield*/, transactions_1.sendTransactionWithRetryWithKeypair(anchorProgram.provider.connection, walletKeyPair, instructions, signers, 'max')];
            case 11:
                _g.sent();
                console.log("create fair launch ticket Done: " + fairLaunchTicket.toBase58() + ". Trying to create seq now...we may or may not get a validator with data on chain. Either way, your ticket is secure.");
                i = 0;
                _g.label = 12;
            case 12:
                if (!(i < 10)) return [3 /*break*/, 18];
                return [4 /*yield*/, various_1.sleep(5000)];
            case 13:
                _g.sent();
                _g.label = 14;
            case 14:
                _g.trys.push([14, 16, , 17]);
                return [4 /*yield*/, anchorProgram.account.fairLaunchTicket.fetch(fairLaunchTicket)];
            case 15:
                fairLaunchTicketObj =
                    _g.sent();
                return [3 /*break*/, 18];
            case 16:
                e_1 = _g.sent();
                console.log('Not found. Trying again...');
                return [3 /*break*/, 17];
            case 17:
                i++;
                return [3 /*break*/, 12];
            case 18: return [4 /*yield*/, accounts_1.getFairLaunchTicketSeqLookup(
                //@ts-ignore
                fairLaunchObj.tokenMint, 
                //@ts-ignore
                fairLaunchTicketObj.seq)];
            case 19:
                _f = __read.apply(void 0, [_g.sent(), 2]), fairLaunchTicketSeqLookup = _f[0], seqBump = _f[1];
                return [4 /*yield*/, anchorProgram.rpc.createTicketSeq(seqBump, {
                        accounts: {
                            fairLaunchTicketSeqLookup: fairLaunchTicketSeqLookup,
                            fairLaunch: fairLaunch,
                            fairLaunchTicket: fairLaunchTicket,
                            payer: walletKeyPair.publicKey,
                            systemProgram: anchor.web3.SystemProgram.programId,
                            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                        },
                        signers: [],
                    })];
            case 20:
                _g.sent();
                console.log('Created seq');
                return [2 /*return*/];
        }
    });
}); });
commander_1.program
    .command('mint_from_dummy')
    .option('-e, --env <string>', 'Solana cluster env name', 'devnet')
    .option('-k, --keypair <path>', "Solana wallet location", '--keypair not provided')
    .option('-d, --destination <path>', "Destination wallet location", '--destination not provided')
    .option('-a, --amount <string>', 'amount')
    .option('-m, --mint <string>', 'mint')
    .action(function (_, cmd) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, env, keypair, amount, destination, mint, walletKeyPair, anchorProgram, amountNumber, mintKey, dest, token, instructions, tokenApp, mintInfo, mantissa, assocToken;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = cmd.opts(), env = _a.env, keypair = _a.keypair, amount = _a.amount, destination = _a.destination, mint = _a.mint;
                walletKeyPair = accounts_1.loadWalletKey(keypair);
                return [4 /*yield*/, accounts_1.loadFairLaunchProgram(walletKeyPair, env)];
            case 1:
                anchorProgram = _b.sent();
                amountNumber = parseFloat(amount);
                mintKey = new anchor.web3.PublicKey(mint);
                dest = new anchor.web3.PublicKey(destination);
                return [4 /*yield*/, accounts_1.getAtaForMint(mintKey, dest)];
            case 2:
                token = (_b.sent())[0];
                instructions = [];
                tokenApp = new spl_token_1.Token(anchorProgram.provider.connection, 
                //@ts-ignore
                new anchor.web3.PublicKey(mint), constants_1.TOKEN_PROGRAM_ID, walletKeyPair);
                return [4 /*yield*/, tokenApp.getMintInfo()];
            case 3:
                mintInfo = _b.sent();
                mantissa = Math.pow(10, mintInfo.decimals);
                return [4 /*yield*/, anchorProgram.provider.connection.getAccountInfo(token)];
            case 4:
                assocToken = _b.sent();
                if (!assocToken) {
                    instructions.push(instructions_1.createAssociatedTokenAccountInstruction(token, walletKeyPair.publicKey, dest, mintKey));
                }
                instructions.push(spl_token_1.Token.createMintToInstruction(constants_1.TOKEN_PROGRAM_ID, mintKey, token, walletKeyPair.publicKey, [], amountNumber * mantissa));
                return [4 /*yield*/, transactions_1.sendTransactionWithRetryWithKeypair(anchorProgram.provider.connection, walletKeyPair, instructions, [], 'single')];
            case 5:
                _b.sent();
                console.log("Minted " + amount + " to " + token.toBase58() + ".");
                return [2 /*return*/];
        }
    });
}); });
commander_1.program
    .command('create_dummy_payment_mint')
    .option('-e, --env <string>', 'Solana cluster env name', 'devnet')
    .option('-k, --keypair <path>', "Solana wallet location", '--keypair not provided')
    .action(function (_, cmd) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, env, keypair, walletKeyPair, anchorProgram, mint, token, instructions, _b, _c, signers;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = cmd.opts(), env = _a.env, keypair = _a.keypair;
                walletKeyPair = accounts_1.loadWalletKey(keypair);
                return [4 /*yield*/, accounts_1.loadFairLaunchProgram(walletKeyPair, env)];
            case 1:
                anchorProgram = _e.sent();
                mint = anchor.web3.Keypair.generate();
                return [4 /*yield*/, accounts_1.getAtaForMint(mint.publicKey, walletKeyPair.publicKey)];
            case 2:
                token = (_e.sent())[0];
                _c = (_b = anchor.web3.SystemProgram).createAccount;
                _d = {
                    fromPubkey: walletKeyPair.publicKey,
                    newAccountPubkey: mint.publicKey,
                    space: spl_token_1.MintLayout.span
                };
                return [4 /*yield*/, anchorProgram.provider.connection.getMinimumBalanceForRentExemption(spl_token_1.MintLayout.span)];
            case 3:
                instructions = [
                    _c.apply(_b, [(_d.lamports = _e.sent(),
                            _d.programId = constants_1.TOKEN_PROGRAM_ID,
                            _d)]),
                    spl_token_1.Token.createInitMintInstruction(constants_1.TOKEN_PROGRAM_ID, mint.publicKey, 6, walletKeyPair.publicKey, walletKeyPair.publicKey),
                    instructions_1.createAssociatedTokenAccountInstruction(token, walletKeyPair.publicKey, walletKeyPair.publicKey, mint.publicKey)
                ];
                signers = [mint];
                return [4 /*yield*/, transactions_1.sendTransactionWithRetryWithKeypair(anchorProgram.provider.connection, walletKeyPair, instructions, signers, 'single')];
            case 4:
                _e.sent();
                console.log("create mint Done: " + mint.publicKey.toBase58() + ".");
                return [2 /*return*/];
        }
    });
}); });
function adjustTicket(_a) {
    var amountNumber = _a.amountNumber, fairLaunchObj = _a.fairLaunchObj, adjuster = _a.adjuster, fairLaunch = _a.fairLaunch, fairLaunchTicket = _a.fairLaunchTicket, fairLaunchLotteryBitmap = _a.fairLaunchLotteryBitmap, anchorProgram = _a.anchorProgram, payer = _a.payer, adjustMantissa = _a.adjustMantissa;
    return __awaiter(this, void 0, void 0, function () {
        var remainingAccounts, instructions, signers, tokenAta, _b, transferAuthority, token, mintInfo, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    remainingAccounts = [];
                    instructions = [];
                    signers = [];
                    if (!fairLaunchObj.treasuryMint) return [3 /*break*/, 2];
                    return [4 /*yield*/, accounts_1.getAtaForMint(
                        //@ts-ignore
                        fairLaunchObj.treasuryMint, adjuster)];
                case 1:
                    _b = (_e.sent())[0];
                    return [3 /*break*/, 3];
                case 2:
                    _b = undefined;
                    _e.label = 3;
                case 3:
                    tokenAta = _b;
                    if (!!fairLaunchObj.treasuryMint) return [3 /*break*/, 4];
                    if (adjustMantissa)
                        amountNumber = Math.ceil(amountNumber * web3_js_1.LAMPORTS_PER_SOL);
                    return [3 /*break*/, 6];
                case 4:
                    transferAuthority = anchor.web3.Keypair.generate();
                    signers.push(transferAuthority);
                    token = new spl_token_1.Token(anchorProgram.provider.connection, fairLaunchObj.treasuryMint, constants_1.TOKEN_PROGRAM_ID, payer);
                    return [4 /*yield*/, token.getMintInfo()];
                case 5:
                    mintInfo = _e.sent();
                    if (adjustMantissa)
                        amountNumber = Math.ceil(amountNumber * Math.pow(10, mintInfo.decimals));
                    if (amountNumber > 0) {
                        instructions.push(spl_token_1.Token.createApproveInstruction(constants_1.TOKEN_PROGRAM_ID, tokenAta, transferAuthority.publicKey, adjuster, [], 
                        //@ts-ignore
                        amountNumber));
                    }
                    remainingAccounts.push({
                        //@ts-ignore
                        pubkey: fairLaunchObj.treasuryMint,
                        isWritable: true,
                        isSigner: false,
                    });
                    remainingAccounts.push({
                        pubkey: tokenAta,
                        isWritable: true,
                        isSigner: false,
                    });
                    remainingAccounts.push({
                        pubkey: transferAuthority.publicKey,
                        isWritable: false,
                        isSigner: true,
                    });
                    remainingAccounts.push({
                        pubkey: constants_1.TOKEN_PROGRAM_ID,
                        isWritable: false,
                        isSigner: false,
                    });
                    _e.label = 6;
                case 6:
                    _d = (_c = instructions).push;
                    return [4 /*yield*/, anchorProgram.instruction.adjustTicket(new anchor.BN(amountNumber), {
                            accounts: {
                                fairLaunchTicket: fairLaunchTicket,
                                fairLaunch: fairLaunch,
                                fairLaunchLotteryBitmap: fairLaunchLotteryBitmap,
                                //@ts-ignore
                                treasury: fairLaunchObj.treasury,
                                systemProgram: anchor.web3.SystemProgram.programId,
                                clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
                            },
                            //__private: { logAccounts: true },
                            remainingAccounts: __spreadArray([
                                {
                                    pubkey: adjuster,
                                    isSigner: adjuster.equals(payer.publicKey),
                                    isWritable: true,
                                }
                            ], __read(remainingAccounts)),
                        })];
                case 7:
                    _d.apply(_c, [_e.sent()]);
                    //@ts-ignore
                    if (fairLaunchObj.treasuryMint && amountNumber > 0) {
                        instructions.push(spl_token_1.Token.createRevokeInstruction(constants_1.FAIR_LAUNCH_PROGRAM_ID, tokenAta, payer.publicKey, []));
                    }
                    return [4 /*yield*/, transactions_1.sendTransactionWithRetryWithKeypair(anchorProgram.provider.connection, payer, instructions, signers, 'single')];
                case 8:
                    _e.sent();
                    console.log("update fair launch ticket Done: " + fairLaunchTicket.toBase58() + ".");
                    return [2 /*return*/];
            }
        });
    });
}
commander_1.program
    .command('set_token_metadata')
    .option('-e, --env <string>', 'Solana cluster env name', 'devnet')
    .option('-k, --keypair <path>', "Solana wallet location", '--keypair not provided')
    .option('-f, --fair-launch <string>', 'fair launch id')
    .option('-n, --name <string>', 'name')
    .option('-s, --symbol <string>', 'symbol')
    .option('-u, --uri <string>', 'uri')
    .option('-sfbp, --seller-fee-basis-points <string>', 'seller fee basis points')
    .option('-c, --creators <string>', 'comma separated creator wallets like wallet1,73,true,wallet2,27,false where its wallet, then share, then verified true/false')
    .option('-nm, --is_not_mutable', 'is not mutable')
    .action(function (_, cmd) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, env, keypair, fairLaunch, name, symbol, uri, sellerFeeBasisPoints, creators, isNotMutable, sellerFeeBasisPointsNumber, creatorsListPre, creatorsList, i, isMutableBool, walletKeyPair, anchorProgram, fairLaunchKey, fairLaunchObj, _b, _c, _d;
    var _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _a = cmd.opts(), env = _a.env, keypair = _a.keypair, fairLaunch = _a.fairLaunch, name = _a.name, symbol = _a.symbol, uri = _a.uri, sellerFeeBasisPoints = _a.sellerFeeBasisPoints, creators = _a.creators, isNotMutable = _a.isNotMutable;
                sellerFeeBasisPointsNumber = parseInt(sellerFeeBasisPoints);
                creatorsListPre = creators ? creators.split(',') : [];
                creatorsList = [];
                for (i = 0; i < creatorsListPre.length; i += 3) {
                    creatorsList.push({
                        address: new anchor.web3.PublicKey(creatorsListPre[i]),
                        share: parseInt(creatorsListPre[i + 1]),
                        verified: creatorsListPre[i + 2] == 'true' ? true : false,
                    });
                }
                isMutableBool = isNotMutable ? false : true;
                walletKeyPair = accounts_1.loadWalletKey(keypair);
                return [4 /*yield*/, accounts_1.loadFairLaunchProgram(walletKeyPair, env)];
            case 1:
                anchorProgram = _g.sent();
                fairLaunchKey = new anchor.web3.PublicKey(fairLaunch);
                return [4 /*yield*/, anchorProgram.account.fairLaunch.fetch(fairLaunchKey)];
            case 2:
                fairLaunchObj = _g.sent();
                _c = (_b = anchorProgram.rpc).setTokenMetadata;
                _d = [{
                        name: name,
                        symbol: symbol,
                        uri: uri,
                        sellerFeeBasisPoints: sellerFeeBasisPointsNumber,
                        creators: creatorsList,
                        isMutable: isMutableBool,
                    }];
                _e = {};
                _f = {
                    fairLaunch: fairLaunchKey,
                    authority: walletKeyPair.publicKey,
                    payer: walletKeyPair.publicKey
                };
                return [4 /*yield*/, accounts_1.getMetadata(fairLaunchObj.tokenMint)];
            case 3: return [4 /*yield*/, _c.apply(_b, _d.concat([(_e.accounts = (
                    //@ts-ignore
                    _f.metadata = _g.sent(),
                        //@ts-ignore
                        _f.tokenMint = fairLaunchObj.tokenMint,
                        _f.tokenMetadataProgram = constants_1.TOKEN_METADATA_PROGRAM_ID,
                        _f.tokenProgram = constants_1.TOKEN_PROGRAM_ID,
                        _f.systemProgram = anchor.web3.SystemProgram.programId,
                        _f.rent = anchor.web3.SYSVAR_RENT_PUBKEY,
                        _f.clock = anchor.web3.SYSVAR_CLOCK_PUBKEY,
                        _f),
                        _e)]))];
            case 4:
                _g.sent();
                console.log('Set token metadata.');
                return [2 /*return*/];
        }
    });
}); });
commander_1.program
    .command('adjust_ticket')
    .option('-e, --env <string>', 'Solana cluster env name', 'devnet')
    .option('-k, --keypair <path>', "Solana wallet location", '--keypair not provided')
    .option('-f, --fair-launch <string>', 'fair launch id')
    .option('-a, --amount <string>', 'amount')
    .action(function (_, cmd) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, env, keypair, fairLaunch, amount, amountNumber, walletKeyPair, anchorProgram, fairLaunchKey, fairLaunchObj, fairLaunchTicket, fairLaunchLotteryBitmap;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = cmd.opts(), env = _a.env, keypair = _a.keypair, fairLaunch = _a.fairLaunch, amount = _a.amount;
                amountNumber = parseFloat(amount);
                walletKeyPair = accounts_1.loadWalletKey(keypair);
                return [4 /*yield*/, accounts_1.loadFairLaunchProgram(walletKeyPair, env)];
            case 1:
                anchorProgram = _b.sent();
                fairLaunchKey = new anchor.web3.PublicKey(fairLaunch);
                return [4 /*yield*/, anchorProgram.account.fairLaunch.fetch(fairLaunchKey)];
            case 2:
                fairLaunchObj = _b.sent();
                return [4 /*yield*/, accounts_1.getFairLaunchTicket(
                    //@ts-ignore
                    fairLaunchObj.tokenMint, walletKeyPair.publicKey)];
            case 3:
                fairLaunchTicket = (_b.sent())[0];
                return [4 /*yield*/, accounts_1.getFairLaunchLotteryBitmap(fairLaunchObj.tokenMint)];
            case 4:
                fairLaunchLotteryBitmap = (_b.sent())[0];
                return [4 /*yield*/, adjustTicket({
                        amountNumber: amountNumber,
                        fairLaunchObj: fairLaunchObj,
                        adjuster: walletKeyPair.publicKey,
                        fairLaunch: fairLaunch,
                        fairLaunchTicket: fairLaunchTicket,
                        fairLaunchLotteryBitmap: fairLaunchLotteryBitmap,
                        anchorProgram: anchorProgram,
                        payer: walletKeyPair,
                        adjustMantissa: true,
                    })];
            case 5:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
commander_1.program
    .command('punch_and_refund_all_outstanding')
    .option('-e, --env <string>', 'Solana cluster env name', 'devnet')
    .option('-k, --keypair <path>', "Solana wallet location", '--keypair not provided')
    .option('-f, --fair-launch <string>', 'fair launch id')
    .action(function (_, cmd) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, env, keypair, fairLaunch, walletKeyPair, anchorProgram, fairLaunchKey, fairLaunchObj, fairLaunchLotteryBitmap, fairLaunchLotteryBitmapObj, seqKeys, i, _b, _c, ticketKeys, ticketsFlattened, ticketData, ticketDataFlat;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = cmd.opts(), env = _a.env, keypair = _a.keypair, fairLaunch = _a.fairLaunch;
                walletKeyPair = accounts_1.loadWalletKey(keypair);
                return [4 /*yield*/, accounts_1.loadFairLaunchProgram(walletKeyPair, env)];
            case 1:
                anchorProgram = _d.sent();
                fairLaunchKey = new anchor.web3.PublicKey(fairLaunch);
                return [4 /*yield*/, anchorProgram.account.fairLaunch.fetch(fairLaunchKey)];
            case 2:
                fairLaunchObj = _d.sent();
                return [4 /*yield*/, accounts_1.getFairLaunchLotteryBitmap(
                    //@ts-ignore
                    fairLaunchObj.tokenMint)];
            case 3:
                fairLaunchLotteryBitmap = (_d.sent())[0];
                return [4 /*yield*/, anchorProgram.provider.connection.getAccountInfo(fairLaunchLotteryBitmap)];
            case 4:
                fairLaunchLotteryBitmapObj = _d.sent();
                seqKeys = [];
                i = 0;
                _d.label = 5;
            case 5:
                if (!(i < fairLaunchObj.numberTicketsSold)) return [3 /*break*/, 8];
                _c = (_b = seqKeys).push;
                return [4 /*yield*/, accounts_1.getFairLaunchTicketSeqLookup(
                    //@ts-ignore
                    fairLaunchObj.tokenMint, new anchor.BN(i))];
            case 6:
                _c.apply(_b, [(_d.sent())[0]]);
                _d.label = 7;
            case 7:
                i++;
                return [3 /*break*/, 5];
            case 8: return [4 /*yield*/, Promise.all(various_1.chunks(Array.from(Array(seqKeys.length).keys()), 1000).map(function (allIndexesInSlice) { return __awaiter(void 0, void 0, void 0, function () {
                    var ticketKeys, i, slice, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                ticketKeys = [];
                                i = 0;
                                _a.label = 1;
                            case 1:
                                if (!(i < allIndexesInSlice.length)) return [3 /*break*/, 4];
                                console.log('Pulling ticket seqs for slice', allIndexesInSlice[i], allIndexesInSlice[i + 100]);
                                slice = allIndexesInSlice
                                    .slice(i, i + 100)
                                    .map(function (index) { return seqKeys[index]; });
                                return [4 /*yield*/, various_1.getMultipleAccounts(anchorProgram.provider.connection, slice.map(function (s) { return s.toBase58(); }), 'recent')];
                            case 2:
                                result = _a.sent();
                                ticketKeys = ticketKeys.concat(result.array.map(function (a) {
                                    return new anchor.web3.PublicKey(new Uint8Array(a.data.slice(8, 8 + 32)));
                                }));
                                return [2 /*return*/, ticketKeys];
                            case 3:
                                i += 100;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); }))];
            case 9:
                ticketKeys = _d.sent();
                ticketsFlattened = ticketKeys.flat();
                return [4 /*yield*/, Promise.all(various_1.chunks(Array.from(Array(ticketsFlattened.length).keys()), 1000).map(function (allIndexesInSlice) { return __awaiter(void 0, void 0, void 0, function () {
                        var states, _loop_1, i, state_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    states = [];
                                    _loop_1 = function (i) {
                                        var slice, result;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    console.log('Pulling accounts for slice', allIndexesInSlice[i], allIndexesInSlice[i + 100]);
                                                    slice = allIndexesInSlice
                                                        .slice(i, i + 100)
                                                        .map(function (index) { return ticketsFlattened[index]; });
                                                    return [4 /*yield*/, various_1.getMultipleAccounts(anchorProgram.provider.connection, slice.map(function (s) { return s.toBase58(); }), 'recent')];
                                                case 1:
                                                    result = _b.sent();
                                                    states = states.concat(result.array.map(function (a, i) { return ({
                                                        key: new anchor.web3.PublicKey(result.keys[i]),
                                                        model: anchorProgram.coder.accounts.decode('FairLaunchTicket', a.data),
                                                    }); }));
                                                    return [2 /*return*/, { value: states }];
                                            }
                                        });
                                    };
                                    i = 0;
                                    _a.label = 1;
                                case 1:
                                    if (!(i < allIndexesInSlice.length)) return [3 /*break*/, 4];
                                    return [5 /*yield**/, _loop_1(i)];
                                case 2:
                                    state_1 = _a.sent();
                                    if (typeof state_1 === "object")
                                        return [2 /*return*/, state_1.value];
                                    _a.label = 3;
                                case 3:
                                    i += 100;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 10:
                ticketData = _d.sent();
                ticketDataFlat = ticketData.flat();
                return [4 /*yield*/, Promise.all(various_1.chunks(Array.from(Array(ticketDataFlat.length).keys()), 1000).map(function (allIndexesInSlice) { return __awaiter(void 0, void 0, void 0, function () {
                        var i, ticket, myByte, positionFromRight, mask, isWinner, diff, tries, buyerTokenAccount, e_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    i = 0;
                                    _a.label = 1;
                                case 1:
                                    if (!(i < allIndexesInSlice.length)) return [3 /*break*/, 16];
                                    ticket = ticketDataFlat[allIndexesInSlice[i]];
                                    if (!ticket.model.state.unpunched) return [3 /*break*/, 14];
                                    if (!(ticket.model.amount.toNumber() <
                                        //@ts-ignore
                                        fairLaunchObj.currentMedian.toNumber())) return [3 /*break*/, 3];
                                    console.log('Refunding ticket for buyer', ticket.model.buyer.toBase58());
                                    return [4 /*yield*/, adjustTicket({
                                            amountNumber: 0,
                                            fairLaunchObj: fairLaunchObj,
                                            adjuster: ticket.model.buyer,
                                            fairLaunch: fairLaunch,
                                            fairLaunchTicket: ticket.key,
                                            fairLaunchLotteryBitmap: fairLaunchLotteryBitmap,
                                            anchorProgram: anchorProgram,
                                            payer: walletKeyPair,
                                            adjustMantissa: true,
                                        })];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 13];
                                case 3:
                                    myByte = fairLaunchLotteryBitmapObj.data[FAIR_LAUNCH_LOTTERY_SIZE +
                                        Math.floor(ticket.model.seq.toNumber() / 8)];
                                    positionFromRight = 7 - (ticket.model.seq.toNumber() % 8);
                                    mask = Math.pow(2, positionFromRight);
                                    isWinner = myByte & mask;
                                    if (!(isWinner > 0)) return [3 /*break*/, 11];
                                    console.log('Punching ticket for buyer', ticket.model.buyer.toBase58());
                                    diff = ticket.model.amount.toNumber() -
                                        //@ts-ignore
                                        fairLaunchObj.currentMedian.toNumber();
                                    if (!(diff > 0)) return [3 /*break*/, 5];
                                    console.log('Refunding first', diff, 'to buyer before punching');
                                    return [4 /*yield*/, adjustTicket({
                                            //@ts-ignore
                                            amountNumber: fairLaunchObj.currentMedian.toNumber(),
                                            fairLaunchObj: fairLaunchObj,
                                            adjuster: ticket.model.buyer,
                                            fairLaunch: fairLaunch,
                                            fairLaunchTicket: ticket.key,
                                            fairLaunchLotteryBitmap: fairLaunchLotteryBitmap,
                                            anchorProgram: anchorProgram,
                                            payer: walletKeyPair,
                                            adjustMantissa: false,
                                        })];
                                case 4:
                                    _a.sent();
                                    _a.label = 5;
                                case 5:
                                    tries = 0;
                                    _a.label = 6;
                                case 6:
                                    _a.trys.push([6, 8, , 10]);
                                    return [4 /*yield*/, punchTicket({
                                            payer: walletKeyPair,
                                            puncher: ticket.model.buyer,
                                            anchorProgram: anchorProgram,
                                            fairLaunchTicket: ticket.key,
                                            fairLaunch: fairLaunch,
                                            fairLaunchLotteryBitmap: fairLaunchLotteryBitmap,
                                            fairLaunchObj: fairLaunchObj,
                                        })];
                                case 7:
                                    buyerTokenAccount = _a.sent();
                                    console.log("Punched ticket and placed token in new account " + buyerTokenAccount.toBase58() + ".");
                                    return [3 /*break*/, 10];
                                case 8:
                                    e_2 = _a.sent();
                                    if (tries > 3) {
                                        throw e_2;
                                    }
                                    else {
                                        tries++;
                                    }
                                    console.log('Ticket failed to punch, trying one more time');
                                    return [4 /*yield*/, various_1.sleep(1000)];
                                case 9:
                                    _a.sent();
                                    return [3 /*break*/, 10];
                                case 10: return [3 /*break*/, 13];
                                case 11:
                                    console.log('Buyer ', ticket.model.buyer.toBase58(), 'was eligible but lost lottery, refunding');
                                    return [4 /*yield*/, adjustTicket({
                                            //@ts-ignore
                                            amountNumber: 0,
                                            fairLaunchObj: fairLaunchObj,
                                            adjuster: ticket.model.buyer,
                                            fairLaunch: fairLaunch,
                                            fairLaunchTicket: ticket.key,
                                            fairLaunchLotteryBitmap: fairLaunchLotteryBitmap,
                                            anchorProgram: anchorProgram,
                                            payer: walletKeyPair,
                                            adjustMantissa: true,
                                        })];
                                case 12:
                                    _a.sent();
                                    console.log('Refunded.');
                                    _a.label = 13;
                                case 13: return [3 /*break*/, 15];
                                case 14:
                                    if (ticket.model.state.withdrawn) {
                                        console.log('Buyer', ticket.model.buyer.toBase58(), 'withdrawn already');
                                    }
                                    else if (ticket.model.state.punched) {
                                        console.log('Buyer', ticket.model.buyer.toBase58(), 'punched already');
                                    }
                                    _a.label = 15;
                                case 15:
                                    i++;
                                    return [3 /*break*/, 1];
                                case 16: return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 11:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); });
function punchTicket(_a) {
    var puncher = _a.puncher, payer = _a.payer, anchorProgram = _a.anchorProgram, fairLaunchTicket = _a.fairLaunchTicket, fairLaunch = _a.fairLaunch, fairLaunchLotteryBitmap = _a.fairLaunchLotteryBitmap, fairLaunchObj = _a.fairLaunchObj;
    return __awaiter(this, void 0, void 0, function () {
        var buyerTokenAccount;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, accounts_1.getAtaForMint(
                    //@ts-ignore
                    fairLaunchObj.tokenMint, puncher)];
                case 1:
                    buyerTokenAccount = (_b.sent())[0];
                    return [4 /*yield*/, anchorProgram.rpc.punchTicket({
                            accounts: {
                                fairLaunchTicket: fairLaunchTicket,
                                fairLaunch: fairLaunch,
                                fairLaunchLotteryBitmap: fairLaunchLotteryBitmap,
                                payer: payer.publicKey,
                                buyerTokenAccount: buyerTokenAccount,
                                //@ts-ignore
                                tokenMint: fairLaunchObj.tokenMint,
                                tokenProgram: constants_1.TOKEN_PROGRAM_ID,
                            },
                            options: {
                                commitment: 'single',
                            },
                            //__private: { logAccounts: true },
                            instructions: [
                                instructions_1.createAssociatedTokenAccountInstruction(buyerTokenAccount, payer.publicKey, puncher, 
                                //@ts-ignore
                                fairLaunchObj.tokenMint),
                            ],
                        })];
                case 2:
                    _b.sent();
                    return [2 /*return*/, buyerTokenAccount];
            }
        });
    });
}
commander_1.program
    .command('punch_ticket')
    .option('-e, --env <string>', 'Solana cluster env name', 'devnet')
    .option('-k, --keypair <path>', "Solana wallet location", '--keypair not provided')
    .option('-f, --fair-launch <string>', 'fair launch id')
    .action(function (_, cmd) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, env, keypair, fairLaunch, walletKeyPair, anchorProgram, fairLaunchKey, fairLaunchObj, fairLaunchTicket, fairLaunchLotteryBitmap, ticket, diff, buyerTokenAccount;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = cmd.opts(), env = _a.env, keypair = _a.keypair, fairLaunch = _a.fairLaunch;
                walletKeyPair = accounts_1.loadWalletKey(keypair);
                return [4 /*yield*/, accounts_1.loadFairLaunchProgram(walletKeyPair, env)];
            case 1:
                anchorProgram = _b.sent();
                fairLaunchKey = new anchor.web3.PublicKey(fairLaunch);
                return [4 /*yield*/, anchorProgram.account.fairLaunch.fetch(fairLaunchKey)];
            case 2:
                fairLaunchObj = _b.sent();
                return [4 /*yield*/, accounts_1.getFairLaunchTicket(
                    //@ts-ignore
                    fairLaunchObj.tokenMint, walletKeyPair.publicKey)];
            case 3:
                fairLaunchTicket = (_b.sent())[0];
                return [4 /*yield*/, accounts_1.getFairLaunchLotteryBitmap(fairLaunchObj.tokenMint)];
            case 4:
                fairLaunchLotteryBitmap = (_b.sent())[0];
                return [4 /*yield*/, anchorProgram.account.fairLaunchTicket.fetch(fairLaunchTicket)];
            case 5:
                ticket = _b.sent();
                diff = 
                //@ts-ignore
                ticket.amount.toNumber() -
                    //@ts-ignore
                    fairLaunchObj.currentMedian.toNumber();
                if (!(diff > 0)) return [3 /*break*/, 7];
                console.log('Refunding first', diff, 'to buyer before punching');
                return [4 /*yield*/, adjustTicket({
                        //@ts-ignore
                        amountNumber: fairLaunchObj.currentMedian.toNumber(),
                        fairLaunchObj: fairLaunchObj,
                        //@ts-ignore
                        adjuster: ticket.buyer,
                        fairLaunch: fairLaunch,
                        fairLaunchTicket: fairLaunchTicket,
                        fairLaunchLotteryBitmap: fairLaunchLotteryBitmap,
                        anchorProgram: anchorProgram,
                        payer: walletKeyPair,
                        adjustMantissa: false,
                    })];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7: return [4 /*yield*/, punchTicket({
                    puncher: walletKeyPair.publicKey,
                    payer: walletKeyPair,
                    anchorProgram: anchorProgram,
                    fairLaunchTicket: fairLaunchTicket,
                    fairLaunch: fairLaunch,
                    fairLaunchLotteryBitmap: fairLaunchLotteryBitmap,
                    fairLaunchObj: fairLaunchObj,
                })];
            case 8:
                buyerTokenAccount = _b.sent();
                console.log("Punched ticket and placed token in new account " + buyerTokenAccount.toBase58() + ".");
                return [2 /*return*/];
        }
    });
}); });
commander_1.program
    .command('burn_fair_launch_tokens_warning_irreversible')
    .option('-e, --env <string>', 'Solana cluster env name', 'devnet')
    .option('-k, --keypair <path>', "Solana wallet location", '--keypair not provided')
    .option('-f, --fair-launch <string>', 'fair launch id')
    .option('-n, --number <string>', 'number to burn')
    .action(function (_, cmd) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, env, keypair, fairLaunch, number, actual, walletKeyPair, anchorProgram, fairLaunchKey, fairLaunchObj, myTokenAccount, instructions;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = cmd.opts(), env = _a.env, keypair = _a.keypair, fairLaunch = _a.fairLaunch, number = _a.number;
                actual = parseInt(number);
                walletKeyPair = accounts_1.loadWalletKey(keypair);
                return [4 /*yield*/, accounts_1.loadFairLaunchProgram(walletKeyPair, env)];
            case 1:
                anchorProgram = _b.sent();
                fairLaunchKey = new anchor.web3.PublicKey(fairLaunch);
                return [4 /*yield*/, anchorProgram.account.fairLaunch.fetch(fairLaunchKey)];
            case 2:
                fairLaunchObj = _b.sent();
                return [4 /*yield*/, accounts_1.getAtaForMint(
                    //@ts-ignore
                    fairLaunchObj.tokenMint, walletKeyPair.publicKey)];
            case 3:
                myTokenAccount = (_b.sent())[0];
                instructions = [
                    spl_token_1.Token.createBurnInstruction(constants_1.TOKEN_PROGRAM_ID, 
                    //@ts-ignore
                    fairLaunchObj.tokenMint, myTokenAccount, walletKeyPair.publicKey, [], actual),
                ];
                return [4 /*yield*/, transactions_1.sendTransactionWithRetryWithKeypair(anchorProgram.provider.connection, walletKeyPair, instructions, [], 'single')];
            case 4:
                _b.sent();
                console.log("Burned " + actual + " tokens in account " + myTokenAccount.toBase58() + ".");
                return [2 /*return*/];
        }
    });
}); });
commander_1.program
    .command('start_phase_three')
    .option('-e, --env <string>', 'Solana cluster env name', 'devnet')
    .option('-k, --keypair <path>', "Solana wallet location", '--keypair not provided')
    .option('-f, --fair-launch <string>', 'fair launch id')
    .action(function (_, cmd) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, env, keypair, fairLaunch, walletKeyPair, anchorProgram, fairLaunchKey, fairLaunchObj, fairLaunchLotteryBitmap;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = cmd.opts(), env = _a.env, keypair = _a.keypair, fairLaunch = _a.fairLaunch;
                walletKeyPair = accounts_1.loadWalletKey(keypair);
                return [4 /*yield*/, accounts_1.loadFairLaunchProgram(walletKeyPair, env)];
            case 1:
                anchorProgram = _b.sent();
                fairLaunchKey = new anchor.web3.PublicKey(fairLaunch);
                return [4 /*yield*/, anchorProgram.account.fairLaunch.fetch(fairLaunchKey)];
            case 2:
                fairLaunchObj = _b.sent();
                return [4 /*yield*/, accounts_1.getFairLaunchLotteryBitmap(fairLaunchObj.tokenMint)];
            case 3:
                fairLaunchLotteryBitmap = (_b.sent())[0];
                return [4 /*yield*/, anchorProgram.rpc.startPhaseThree({
                        accounts: {
                            fairLaunch: fairLaunch,
                            fairLaunchLotteryBitmap: fairLaunchLotteryBitmap,
                            authority: walletKeyPair.publicKey,
                            clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
                        },
                    })];
            case 4:
                _b.sent();
                console.log("Dang son, phase three.");
                return [2 /*return*/];
        }
    });
}); });
commander_1.program
    .command('withdraw_funds')
    .option('-e, --env <string>', 'Solana cluster env name', 'devnet')
    .option('-k, --keypair <path>', "Solana wallet location", '--keypair not provided')
    .option('-f, --fair-launch <string>', 'fair launch id')
    .action(function (_, cmd) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, env, keypair, fairLaunch, walletKeyPair, anchorProgram, fairLaunchKey, fairLaunchObj, remainingAccounts, _b, _c;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = cmd.opts(), env = _a.env, keypair = _a.keypair, fairLaunch = _a.fairLaunch;
                walletKeyPair = accounts_1.loadWalletKey(keypair);
                return [4 /*yield*/, accounts_1.loadFairLaunchProgram(walletKeyPair, env)];
            case 1:
                anchorProgram = _e.sent();
                fairLaunchKey = new anchor.web3.PublicKey(fairLaunch);
                return [4 /*yield*/, anchorProgram.account.fairLaunch.fetch(fairLaunchKey)];
            case 2:
                fairLaunchObj = _e.sent();
                remainingAccounts = [];
                if (!fairLaunchObj.treasuryMint) return [3 /*break*/, 4];
                remainingAccounts.push({
                    //@ts-ignore
                    pubkey: fairLaunchObj.treasuryMint,
                    isWritable: true,
                    isSigner: false,
                });
                _c = (_b = remainingAccounts).push;
                _d = {};
                return [4 /*yield*/, accounts_1.getAtaForMint(
                    //@ts-ignore
                    fairLaunchObj.treasuryMint, walletKeyPair.publicKey)];
            case 3:
                _c.apply(_b, [(_d.pubkey = (_e.sent())[0],
                        _d.isWritable = true,
                        _d.isSigner = false,
                        _d)]);
                remainingAccounts.push({
                    pubkey: constants_1.TOKEN_PROGRAM_ID,
                    isWritable: false,
                    isSigner: false,
                });
                _e.label = 4;
            case 4: return [4 /*yield*/, anchorProgram.rpc.withdrawFunds({
                    accounts: {
                        fairLaunch: fairLaunch,
                        // @ts-ignore
                        treasury: fairLaunchObj.treasury,
                        authority: walletKeyPair.publicKey,
                        // @ts-ignore
                        tokenMint: fairLaunchObj.tokenMint,
                        systemProgram: anchor.web3.SystemProgram.programId,
                    },
                    remainingAccounts: remainingAccounts,
                })];
            case 5:
                _e.sent();
                console.log("Now you rich, give me some.");
                return [2 /*return*/];
        }
    });
}); });
commander_1.program
    .command('restart_phase_2')
    .option('-e, --env <string>', 'Solana cluster env name', 'devnet')
    .option('-k, --keypair <path>', "Solana wallet location", '--keypair not provided')
    .option('-f, --fair-launch <string>', 'fair launch id')
    .action(function (_, cmd) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, env, keypair, fairLaunch, walletKeyPair, anchorProgram;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = cmd.opts(), env = _a.env, keypair = _a.keypair, fairLaunch = _a.fairLaunch;
                walletKeyPair = accounts_1.loadWalletKey(keypair);
                return [4 /*yield*/, accounts_1.loadFairLaunchProgram(walletKeyPair, env)];
            case 1:
                anchorProgram = _b.sent();
                return [4 /*yield*/, anchorProgram.rpc.restartPhaseTwo({
                        accounts: {
                            fairLaunch: fairLaunch,
                            clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
                        },
                    })];
            case 2:
                _b.sent();
                console.log("Clock restart on phase 2");
                return [2 /*return*/];
        }
    });
}); });
commander_1.program
    .command('receive_refund')
    .option('-e, --env <string>', 'Solana cluster env name', 'devnet')
    .option('-k, --keypair <path>', "Solana wallet location", '--keypair not provided')
    .option('-f, --fair-launch <string>', 'fair launch id')
    .action(function (_, cmd) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, env, keypair, fairLaunch, walletKeyPair, anchorProgram, fairLaunchKey, fairLaunchObj, buyerTokenAccount, transferAuthority, signers, instructions, remainingAccounts, _b, _c, txid;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = cmd.opts(), env = _a.env, keypair = _a.keypair, fairLaunch = _a.fairLaunch;
                walletKeyPair = accounts_1.loadWalletKey(keypair);
                return [4 /*yield*/, accounts_1.loadFairLaunchProgram(walletKeyPair, env)];
            case 1:
                anchorProgram = _e.sent();
                fairLaunchKey = new anchor.web3.PublicKey(fairLaunch);
                return [4 /*yield*/, anchorProgram.account.fairLaunch.fetch(fairLaunchKey)];
            case 2:
                fairLaunchObj = _e.sent();
                return [4 /*yield*/, accounts_1.getAtaForMint(
                    //@ts-ignore
                    fairLaunchObj.tokenMint, walletKeyPair.publicKey)];
            case 3:
                buyerTokenAccount = (_e.sent())[0];
                transferAuthority = anchor.web3.Keypair.generate();
                signers = [transferAuthority];
                instructions = [
                    spl_token_1.Token.createApproveInstruction(constants_1.TOKEN_PROGRAM_ID, 
                    //@ts-ignore
                    buyerTokenAccount, transferAuthority.publicKey, walletKeyPair.publicKey, [], 
                    //@ts-ignore
                    1),
                ];
                remainingAccounts = [];
                if (!fairLaunchObj.treasuryMint) return [3 /*break*/, 5];
                remainingAccounts.push({
                    //@ts-ignore
                    pubkey: fairLaunchObj.treasuryMint,
                    isWritable: true,
                    isSigner: false,
                });
                _c = (_b = remainingAccounts).push;
                _d = {};
                return [4 /*yield*/, accounts_1.getAtaForMint(
                    //@ts-ignore
                    fairLaunchObj.treasuryMint, walletKeyPair.publicKey)];
            case 4:
                _c.apply(_b, [(_d.pubkey = (_e.sent())[0],
                        _d.isWritable = true,
                        _d.isSigner = false,
                        _d)]);
                _e.label = 5;
            case 5: return [4 /*yield*/, anchorProgram.rpc.receiveRefund({
                    accounts: {
                        fairLaunch: fairLaunch,
                        // @ts-ignore
                        treasury: fairLaunchObj.treasury,
                        buyer: walletKeyPair.publicKey,
                        buyerTokenAccount: buyerTokenAccount,
                        transferAuthority: transferAuthority.publicKey,
                        // @ts-ignore
                        tokenMint: fairLaunchObj.tokenMint,
                        tokenProgram: constants_1.TOKEN_PROGRAM_ID,
                        systemProgram: anchor.web3.SystemProgram.programId,
                        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
                    },
                    remainingAccounts: remainingAccounts,
                    instructions: instructions,
                    signers: signers,
                })];
            case 6:
                txid = _e.sent();
                console.log("You received a refund, traitor. " + txid);
                return [2 /*return*/];
        }
    });
}); });
commander_1.program
    .command('create_fair_launch_lottery')
    .option('-e, --env <string>', 'Solana cluster env name', 'devnet')
    .option('-k, --keypair <path>', "Solana wallet location", '--keypair not provided')
    .option('-f, --fair-launch <string>', 'fair launch id')
    .action(function (_, cmd) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, env, keypair, fairLaunch, walletKeyPair, anchorProgram, fairLaunchKey, fairLaunchObj, _b, fairLaunchLotteryBitmap, bump, exists, seqKeys, i, _c, _d, ticketKeys, ticketsFlattened, states, statesFlat, numWinnersRemaining, chosen, rand, sorted;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = cmd.opts(), env = _a.env, keypair = _a.keypair, fairLaunch = _a.fairLaunch;
                walletKeyPair = accounts_1.loadWalletKey(keypair);
                return [4 /*yield*/, accounts_1.loadFairLaunchProgram(walletKeyPair, env)];
            case 1:
                anchorProgram = _e.sent();
                fairLaunchKey = new anchor.web3.PublicKey(fairLaunch);
                return [4 /*yield*/, anchorProgram.account.fairLaunch.fetch(fairLaunchKey)];
            case 2:
                fairLaunchObj = _e.sent();
                return [4 /*yield*/, accounts_1.getFairLaunchLotteryBitmap(
                    //@ts-ignore
                    fairLaunchObj.tokenMint)];
            case 3:
                _b = __read.apply(void 0, [_e.sent(), 2]), fairLaunchLotteryBitmap = _b[0], bump = _b[1];
                return [4 /*yield*/, anchorProgram.provider.connection.getAccountInfo(fairLaunchLotteryBitmap)];
            case 4:
                exists = _e.sent();
                if (!!exists) return [3 /*break*/, 6];
                return [4 /*yield*/, anchorProgram.rpc.createFairLaunchLotteryBitmap(bump, {
                        accounts: {
                            fairLaunch: fairLaunch,
                            fairLaunchLotteryBitmap: fairLaunchLotteryBitmap,
                            authority: walletKeyPair.publicKey,
                            payer: walletKeyPair.publicKey,
                            systemProgram: anchor.web3.SystemProgram.programId,
                            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                            clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
                        },
                    })];
            case 5:
                _e.sent();
                console.log("created fair launch lottery bitmap Done: " + fairLaunchLotteryBitmap.toBase58() + ".");
                return [3 /*break*/, 7];
            case 6:
                console.log("checked fair launch lottery bitmap, exists: " + fairLaunchLotteryBitmap.toBase58() + ".");
                _e.label = 7;
            case 7:
                seqKeys = [];
                i = 0;
                _e.label = 8;
            case 8:
                if (!(i < fairLaunchObj.numberTicketsSold)) return [3 /*break*/, 11];
                _d = (_c = seqKeys).push;
                return [4 /*yield*/, accounts_1.getFairLaunchTicketSeqLookup(
                    //@ts-ignore
                    fairLaunchObj.tokenMint, new anchor.BN(i))];
            case 9:
                _d.apply(_c, [(_e.sent())[0]]);
                _e.label = 10;
            case 10:
                i++;
                return [3 /*break*/, 8];
            case 11: return [4 /*yield*/, Promise.all(various_1.chunks(Array.from(Array(seqKeys.length).keys()), 1000).map(function (allIndexesInSlice) { return __awaiter(void 0, void 0, void 0, function () {
                    var ticketKeys, i, slice, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                ticketKeys = [];
                                i = 0;
                                _a.label = 1;
                            case 1:
                                if (!(i < allIndexesInSlice.length)) return [3 /*break*/, 4];
                                console.log('Pulling ticket seqs for slice', allIndexesInSlice[i], allIndexesInSlice[i + 100]);
                                slice = allIndexesInSlice
                                    .slice(i, i + 100)
                                    .map(function (index) { return seqKeys[index]; });
                                return [4 /*yield*/, various_1.getMultipleAccounts(anchorProgram.provider.connection, slice.map(function (s) { return s.toBase58(); }), 'recent')];
                            case 2:
                                result = _a.sent();
                                ticketKeys = ticketKeys.concat(result.array.map(function (a) {
                                    return new anchor.web3.PublicKey(new Uint8Array(a.data.slice(8, 8 + 32)));
                                }));
                                return [2 /*return*/, ticketKeys];
                            case 3:
                                i += 100;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); }))];
            case 12:
                ticketKeys = _e.sent();
                ticketsFlattened = ticketKeys.flat();
                return [4 /*yield*/, Promise.all(various_1.chunks(Array.from(Array(ticketsFlattened.length).keys()), 1000).map(function (allIndexesInSlice) { return __awaiter(void 0, void 0, void 0, function () {
                        var states, i, slice, result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    states = [];
                                    i = 0;
                                    _a.label = 1;
                                case 1:
                                    if (!(i < allIndexesInSlice.length)) return [3 /*break*/, 4];
                                    console.log('Pulling states for slice', allIndexesInSlice[i], allIndexesInSlice[i + 100]);
                                    slice = allIndexesInSlice
                                        .slice(i, i + 100)
                                        .map(function (index) { return ticketsFlattened[index]; });
                                    return [4 /*yield*/, various_1.getMultipleAccounts(anchorProgram.provider.connection, slice.map(function (s) { return s.toBase58(); }), 'recent')];
                                case 2:
                                    result = _a.sent();
                                    states = states.concat(result.array.map(function (a) {
                                        var el = anchorProgram.coder.accounts.decode('FairLaunchTicket', a.data);
                                        return {
                                            seq: el.seq.toNumber(),
                                            number: el.amount.toNumber(),
                                            eligible: !!(el.state.unpunched &&
                                                el.amount.toNumber() >=
                                                    //@ts-ignore
                                                    fairLaunchObj.currentMedian.toNumber()),
                                        };
                                    }));
                                    return [2 /*return*/, states];
                                case 3:
                                    i += 100;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 13:
                states = _e.sent();
                statesFlat = states.flat();
                numWinnersRemaining = Math.min(
                //@ts-ignore;
                fairLaunchObj.data.numberOfTokens, 
                //@ts-ignore;
                statesFlat.filter(function (s) { return s.eligible; }).length);
                if (numWinnersRemaining >= statesFlat.length) {
                    console.log('More or equal nfts than winners, everybody wins.');
                    chosen = statesFlat.map(function (s) { return (__assign(__assign({}, s), { chosen: true })); });
                }
                else {
                    chosen = statesFlat.map(function (s) { return (__assign(__assign({}, s), { chosen: false })); });
                    console.log('Doing lottery for', numWinnersRemaining);
                    while (numWinnersRemaining > 0) {
                        rand = Math.round(Math.random() * (chosen.length - 1));
                        if (chosen[rand].chosen != true && chosen[rand].eligible) {
                            chosen[rand].chosen = true;
                            numWinnersRemaining--;
                        }
                    }
                }
                sorted = chosen.sort(function (a, b) { return a.seq - b.seq; });
                console.log('Lottery results', sorted);
                return [4 /*yield*/, Promise.all(
                    // each 8 entries is 1 byte, we want to send up 1000 bytes at a time.
                    // be specific here.
                    various_1.chunks(Array.from(Array(sorted.length).keys()), 8 * 1000).map(function (allIndexesInSlice) { return __awaiter(void 0, void 0, void 0, function () {
                        var bytes, correspondingArrayOfBits, startingOffset, positionFromRight, currByte, currByteAsBits, i, mask;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    bytes = [];
                                    correspondingArrayOfBits = [];
                                    startingOffset = allIndexesInSlice[0];
                                    positionFromRight = 7;
                                    currByte = 0;
                                    currByteAsBits = [];
                                    for (i = 0; i < allIndexesInSlice.length; i++) {
                                        if (chosen[allIndexesInSlice[i]].chosen) {
                                            mask = Math.pow(2, positionFromRight);
                                            currByte = currByte | mask;
                                            currByteAsBits.push(1);
                                        }
                                        else {
                                            currByteAsBits.push(0);
                                        }
                                        positionFromRight--;
                                        if (positionFromRight < 0) {
                                            bytes.push(currByte);
                                            correspondingArrayOfBits.push(currByteAsBits);
                                            currByte = 0;
                                            currByteAsBits = [];
                                            positionFromRight = 7;
                                        }
                                    }
                                    if (positionFromRight != 7) {
                                        // grab the last one if the loop hasnt JUST ended exactly right before on an additional add.
                                        bytes.push(currByte);
                                        correspondingArrayOfBits.push(currByteAsBits);
                                    }
                                    console.log('Setting bytes array for', startingOffset, 'to', allIndexesInSlice[allIndexesInSlice.length - 1], 'as (with split out by bits for ease of reading)', bytes.map(function (e, i) { return [e, correspondingArrayOfBits[i]]; }));
                                    return [4 /*yield*/, anchorProgram.rpc.updateFairLaunchLotteryBitmap(startingOffset, Buffer.from(bytes), {
                                            accounts: {
                                                fairLaunch: fairLaunch,
                                                fairLaunchLotteryBitmap: fairLaunchLotteryBitmap,
                                                authority: walletKeyPair.publicKey,
                                                clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
                                            },
                                        })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 14:
                _e.sent();
                console.log('All done');
                return [2 /*return*/];
        }
    });
}); });
commander_1.program
    .command('create_missing_sequences')
    .option('-e, --env <string>', 'Solana cluster env name', 'devnet')
    .option('-k, --keypair <path>', "Solana wallet location", '--keypair not provided')
    .option('-f, --fair-launch <string>', 'fair launch id')
    .action(function (_, cmd) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, env, keypair, fairLaunch, fairLaunchTicketSeqStart, fairLaunchTicketState, walletKeyPair, anchorProgram, fairLaunchObj, tickets, i, accountAndPubkey, account, pubkey, state, _b, fairLaunchTicketSeqLookup, seqBump;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = cmd.opts(), env = _a.env, keypair = _a.keypair, fairLaunch = _a.fairLaunch;
                fairLaunchTicketSeqStart = 8 + 32 + 32 + 8 + 1 + 1;
                fairLaunchTicketState = 8 + 32 + 32 + 8;
                walletKeyPair = accounts_1.loadWalletKey(keypair);
                return [4 /*yield*/, accounts_1.loadFairLaunchProgram(walletKeyPair, env)];
            case 1:
                anchorProgram = _c.sent();
                return [4 /*yield*/, anchorProgram.account.fairLaunch.fetch(fairLaunch)];
            case 2:
                fairLaunchObj = _c.sent();
                return [4 /*yield*/, anchorProgram.provider.connection.getProgramAccounts(constants_1.FAIR_LAUNCH_PROGRAM_ID, {
                        filters: [
                            {
                                memcmp: {
                                    offset: 8,
                                    bytes: fairLaunch,
                                },
                            },
                        ],
                    })];
            case 3:
                tickets = _c.sent();
                i = 0;
                _c.label = 4;
            case 4:
                if (!(i < tickets.length)) return [3 /*break*/, 8];
                accountAndPubkey = tickets[i];
                account = accountAndPubkey.account, pubkey = accountAndPubkey.pubkey;
                state = account.data[fairLaunchTicketState];
                if (!(state == 0)) return [3 /*break*/, 7];
                console.log('Missing sequence for ticket', pubkey.toBase58());
                return [4 /*yield*/, accounts_1.getFairLaunchTicketSeqLookup(
                    //@ts-ignore
                    fairLaunchObj.tokenMint, new anchor.BN(account.data.slice(fairLaunchTicketSeqStart, fairLaunchTicketSeqStart + 8), undefined, 'le'))];
            case 5:
                _b = __read.apply(void 0, [_c.sent(), 2]), fairLaunchTicketSeqLookup = _b[0], seqBump = _b[1];
                return [4 /*yield*/, anchorProgram.rpc.createTicketSeq(seqBump, {
                        accounts: {
                            fairLaunchTicketSeqLookup: fairLaunchTicketSeqLookup,
                            fairLaunch: fairLaunch,
                            fairLaunchTicket: pubkey,
                            payer: walletKeyPair.publicKey,
                            systemProgram: anchor.web3.SystemProgram.programId,
                            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                        },
                        options: {
                            commitment: 'single',
                        },
                        signers: [],
                    })];
            case 6:
                _c.sent();
                console.log('Created...');
                _c.label = 7;
            case 7:
                i++;
                return [3 /*break*/, 4];
            case 8: return [2 /*return*/];
        }
    });
}); });
commander_1.program
    .command('show')
    .option('-e, --env <string>', 'Solana cluster env name', 'devnet')
    .option('-k, --keypair <path>', "Solana wallet location", '--keypair not provided')
    .option('-f, --fair-launch <string>', 'fair launch id')
    .action(function (options, cmd) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, env, fairLaunch, keypair, walletKeyPair, anchorProgram, fairLaunchObj, treasuryAmount, token;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = cmd.opts(), env = _a.env, fairLaunch = _a.fairLaunch, keypair = _a.keypair;
                walletKeyPair = accounts_1.loadWalletKey(keypair);
                return [4 /*yield*/, accounts_1.loadFairLaunchProgram(walletKeyPair, env)];
            case 1:
                anchorProgram = _d.sent();
                return [4 /*yield*/, anchorProgram.account.fairLaunch.fetch(fairLaunch)];
            case 2:
                fairLaunchObj = _d.sent();
                treasuryAmount = 0;
                if (!fairLaunchObj.treasuryMint) return [3 /*break*/, 4];
                return [4 /*yield*/, anchorProgram.provider.connection.getTokenAccountBalance(
                    // @ts-ignore
                    fairLaunchObj.treasury)];
            case 3:
                token = _d.sent();
                treasuryAmount = token.value.uiAmount;
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, anchorProgram.provider.connection.getBalance(
                // @ts-ignore
                fairLaunchObj.treasury)];
            case 5:
                treasuryAmount = _d.sent();
                _d.label = 6;
            case 6:
                //@ts-ignore
                console.log('Token Mint', fairLaunchObj.tokenMint.toBase58());
                //@ts-ignore
                console.log('Treasury', fairLaunchObj.treasury.toBase58());
                //@ts-ignore
                console.log('Treasury Mint', (_b = fairLaunchObj.treasuryMint) === null || _b === void 0 ? void 0 : _b.toBase58());
                //@ts-ignore
                console.log('Authority', fairLaunchObj.authority.toBase58());
                //@ts-ignore
                console.log('Bump', fairLaunchObj.bump);
                //@ts-ignore
                console.log('Treasury Bump', fairLaunchObj.treasuryBump);
                //@ts-ignore
                console.log('Token Mint Bump', fairLaunchObj.tokenMintBump);
                //@ts-ignore
                if (fairLaunchObj.data.antiRugSetting) {
                    console.log('Anti-Rug Settings:');
                    //@ts-ignore
                    console.log('Reserve bps', fairLaunchObj.data.antiRugSetting.reserveBp);
                    //@ts-ignore
                    console.log('Number of tokens remaining in circulation below which you are allowed to retrieve treasury in full:', 
                    //@ts-ignore
                    fairLaunchObj.data.antiRugSetting.tokenRequirement.toNumber());
                    console.log('Self destruct date - Date at which refunds are allowed (but not required):', 
                    //@ts-ignore
                    new Date(fairLaunchObj.data.antiRugSetting.selfDestructDate * 1000));
                }
                else {
                    console.log('Anti-Rug Settings: None');
                }
                console.log('Price Range Start        ', 
                //@ts-ignore
                fairLaunchObj.data.priceRangeStart.toNumber());
                console.log('Price Range End          ', 
                //@ts-ignore
                fairLaunchObj.data.priceRangeEnd.toNumber());
                console.log('Tick Size                ', 
                //@ts-ignore
                fairLaunchObj.data.tickSize.toNumber());
                console.log('Fees                     ', 
                //@ts-ignore
                fairLaunchObj.data.fee.toNumber());
                console.log('Current Treasury Holdings', treasuryAmount);
                console.log('Treasury Snapshot At Peak', 
                //@ts-ignore
                (_c = fairLaunchObj.treasurySnapshot) === null || _c === void 0 ? void 0 : _c.toNumber());
                console.log('Phase One Start   ', 
                //@ts-ignore
                new Date(fairLaunchObj.data.phaseOneStart.toNumber() * 1000));
                console.log('Phase One End     ', 
                //@ts-ignore
                new Date(fairLaunchObj.data.phaseOneEnd.toNumber() * 1000));
                console.log('Phase Two End     ', 
                //@ts-ignore
                new Date(fairLaunchObj.data.phaseTwoEnd.toNumber() * 1000));
                console.log('Lottery Period End', 
                //@ts-ignore
                new Date(
                //@ts-ignore
                (fairLaunchObj.data.phaseTwoEnd.toNumber() +
                    //@ts-ignore
                    fairLaunchObj.data.lotteryDuration.toNumber()) *
                    1000));
                console.log('Number of Tokens', 
                //@ts-ignore
                fairLaunchObj.data.numberOfTokens.toNumber());
                console.log('Number of Tickets Un-Sequenced     ', 
                //@ts-ignore
                fairLaunchObj.numberTicketsUnSeqed.toNumber());
                console.log('Number of Tickets Sold             ', 
                //@ts-ignore
                fairLaunchObj.numberTicketsSold.toNumber());
                console.log('Number of Tickets Dropped          ', 
                //@ts-ignore
                fairLaunchObj.numberTicketsDropped.toNumber());
                console.log('Number of Tickets Punched          ', 
                //@ts-ignore
                fairLaunchObj.numberTicketsPunched.toNumber());
                console.log('Number of Tickets Dropped + Punched', 
                //@ts-ignore
                fairLaunchObj.numberTicketsDropped.toNumber() +
                    //@ts-ignore
                    fairLaunchObj.numberTicketsPunched.toNumber());
                console.log('Number of Tokens Refunded          ', 
                //@ts-ignore
                fairLaunchObj.numberTokensBurnedForRefunds.toNumber());
                console.log('Number of Tokens Preminted         ', 
                //@ts-ignore
                fairLaunchObj.numberTokensPreminted.toNumber());
                console.log('Phase Three Started', 
                //@ts-ignore
                fairLaunchObj.phaseThreeStarted);
                console.log('Current Eligible Holders', 
                //@ts-ignore
                fairLaunchObj.currentEligibleHolders.toNumber());
                console.log('Current Median', 
                //@ts-ignore
                fairLaunchObj.currentMedian.toNumber());
                console.log('Counts at Each Tick');
                //@ts-ignore
                fairLaunchObj.countsAtEachTick.forEach(function (c, i) {
                    return console.log(
                    //@ts-ignore
                    fairLaunchObj.data.priceRangeStart.toNumber() +
                        //@ts-ignore
                        i * fairLaunchObj.data.tickSize.toNumber(), ':', c.toNumber());
                });
                return [2 /*return*/];
        }
    });
}); });
commander_1.program
    .command('show_ticket')
    .option('-e, --env <string>', 'Solana cluster env name', 'devnet')
    .option('-k, --keypair <path>', "Solana wallet location", '--keypair not provided')
    .option('-f, --fair-launch <string>', 'fair launch id')
    .option('-b, --fair-launch-ticket-buyer <string>', 'fair launch ticket buyer')
    .action(function (options, cmd) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, env, fairLaunch, keypair, fairLaunchTicketBuyer, walletKeyPair, anchorProgram, fairLaunchObj, fairLaunchTicket, fairLaunchTicketObj;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = cmd.opts(), env = _a.env, fairLaunch = _a.fairLaunch, keypair = _a.keypair, fairLaunchTicketBuyer = _a.fairLaunchTicketBuyer;
                walletKeyPair = accounts_1.loadWalletKey(keypair);
                return [4 /*yield*/, accounts_1.loadFairLaunchProgram(walletKeyPair, env)];
            case 1:
                anchorProgram = _b.sent();
                return [4 /*yield*/, anchorProgram.account.fairLaunch.fetch(fairLaunch)];
            case 2:
                fairLaunchObj = _b.sent();
                return [4 /*yield*/, accounts_1.getFairLaunchTicket(
                    //@ts-ignore
                    fairLaunchObj.tokenMint, fairLaunchTicketBuyer
                        ? new anchor.web3.PublicKey(fairLaunchTicketBuyer)
                        : walletKeyPair.publicKey)];
            case 3:
                fairLaunchTicket = (_b.sent())[0];
                return [4 /*yield*/, anchorProgram.account.fairLaunchTicket.fetch(fairLaunchTicket)];
            case 4:
                fairLaunchTicketObj = _b.sent();
                //@ts-ignore
                console.log('Buyer', fairLaunchTicketObj.buyer.toBase58());
                //@ts-ignore
                console.log('Fair Launch', fairLaunchTicketObj.fairLaunch.toBase58());
                //@ts-ignore
                console.log('Current Amount', fairLaunchTicketObj.amount.toNumber());
                //@ts-ignore
                console.log('State', fairLaunchTicketObj.state);
                //@ts-ignore
                console.log('Bump', fairLaunchTicketObj.bump);
                //@ts-ignore
                console.log('Sequence', fairLaunchTicketObj.seq.toNumber());
                return [2 /*return*/];
        }
    });
}); });
commander_1.program
    .command('show_lottery')
    .option('-e, --env <string>', 'Solana cluster env name', 'devnet')
    .option('-k, --keypair <path>', "Solana wallet location", '--keypair not provided')
    .option('-f, --fair-launch <string>', 'fair launch id')
    .action(function (options, cmd) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, env, fairLaunch, keypair, walletKeyPair, anchorProgram, fairLaunchObj, fairLaunchLottery, fairLaunchLotteryBitmapObj, fairLaunchLotteryBitmapAnchorObj, seqKeys, i, _b, _c, buyers, buyersFlattened, i, buyer, myByte, positionFromRight, mask, isWinner;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = cmd.opts(), env = _a.env, fairLaunch = _a.fairLaunch, keypair = _a.keypair;
                walletKeyPair = accounts_1.loadWalletKey(keypair);
                return [4 /*yield*/, accounts_1.loadFairLaunchProgram(walletKeyPair, env)];
            case 1:
                anchorProgram = _d.sent();
                return [4 /*yield*/, anchorProgram.account.fairLaunch.fetch(fairLaunch)];
            case 2:
                fairLaunchObj = _d.sent();
                return [4 /*yield*/, accounts_1.getFairLaunchLotteryBitmap(
                    //@ts-ignore
                    fairLaunchObj.tokenMint)];
            case 3:
                fairLaunchLottery = (_d.sent())[0];
                return [4 /*yield*/, anchorProgram.provider.connection.getAccountInfo(fairLaunchLottery)];
            case 4:
                fairLaunchLotteryBitmapObj = _d.sent();
                return [4 /*yield*/, anchorProgram.account.fairLaunchLotteryBitmap.fetch(fairLaunchLottery)];
            case 5:
                fairLaunchLotteryBitmapAnchorObj = _d.sent();
                seqKeys = [];
                i = 0;
                _d.label = 6;
            case 6:
                if (!(i < fairLaunchObj.numberTicketsSold)) return [3 /*break*/, 9];
                _c = (_b = seqKeys).push;
                return [4 /*yield*/, accounts_1.getFairLaunchTicketSeqLookup(
                    //@ts-ignore
                    fairLaunchObj.tokenMint, new anchor.BN(i))];
            case 7:
                _c.apply(_b, [(_d.sent())[0]]);
                _d.label = 8;
            case 8:
                i++;
                return [3 /*break*/, 6];
            case 9: return [4 /*yield*/, Promise.all(various_1.chunks(Array.from(Array(seqKeys.length).keys()), 1000).map(function (allIndexesInSlice) { return __awaiter(void 0, void 0, void 0, function () {
                    var ticketKeys, i, slice, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                ticketKeys = [];
                                i = 0;
                                _a.label = 1;
                            case 1:
                                if (!(i < allIndexesInSlice.length)) return [3 /*break*/, 4];
                                console.log('Pulling ticket seqs for slice', allIndexesInSlice[i], allIndexesInSlice[i + 100]);
                                slice = allIndexesInSlice
                                    .slice(i, i + 100)
                                    .map(function (index) { return seqKeys[index]; });
                                return [4 /*yield*/, various_1.getMultipleAccounts(anchorProgram.provider.connection, slice.map(function (s) { return s.toBase58(); }), 'recent')];
                            case 2:
                                result = _a.sent();
                                ticketKeys = ticketKeys.concat(result.array.map(function (a) { return ({
                                    buyer: new anchor.web3.PublicKey(new Uint8Array(a.data.slice(8 + 32, 8 + 32 + 32))),
                                    seq: new anchor.BN(a.data.slice(8 + 32 + 32, 8 + 32 + 32 + 8), undefined, 'le'),
                                }); }));
                                return [2 /*return*/, ticketKeys];
                            case 3:
                                i += 100;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); }))];
            case 10:
                buyers = _d.sent();
                buyersFlattened = buyers
                    .flat()
                    .sort(function (a, b) { return a.seq.toNumber() - b.seq.toNumber(); });
                for (i = 0; i < buyersFlattened.length; i++) {
                    buyer = buyersFlattened[i];
                    myByte = fairLaunchLotteryBitmapObj.data[FAIR_LAUNCH_LOTTERY_SIZE + Math.floor(buyer.seq.toNumber() / 8)];
                    positionFromRight = 7 - (buyer.seq.toNumber() % 8);
                    mask = Math.pow(2, positionFromRight);
                    isWinner = myByte & mask;
                    console.log('Ticket', buyer.seq, buyer.buyer.toBase58(), isWinner > 0 ? 'won' : 'lost');
                }
                console.log('Bit Map ones', 
                //@ts-ignore
                fairLaunchLotteryBitmapAnchorObj.bitmapOnes.toNumber());
                return [2 /*return*/];
        }
    });
}); });
commander_1.program.parse(process.argv);
