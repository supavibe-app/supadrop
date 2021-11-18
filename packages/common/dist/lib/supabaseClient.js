"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseUpdateHighestBid = exports.supabaseUpdateIsRedeemAuctionStatus = exports.supabaseUpdateIsRedeem = exports.supabaseUpdateStatusInstantSale = exports.supabaseAddNewNFT = exports.supabaseAddNewUser = exports.supabaseUpdateBid = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
exports.supabase = supabase_js_1.createClient(supabaseUrl, supabaseKey);
const supabaseUpdateBid = (idAuction, walletAddress, bidAmount) => {
    exports.supabase
        .from('action_bidding')
        .select('*')
        .eq('id', `${idAuction}_${walletAddress}`)
        .then(data => {
        var _a;
        if (!data.body)
            return;
        if (((_a = data.body) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            exports.supabase
                .from('action_bidding')
                .update({ price_bid: bidAmount })
                .eq('id', `${idAuction}_${walletAddress}`)
                .then(() => {
                exports.supabaseUpdateHighestBid(idAuction || '', bidAmount || 0, walletAddress || '');
            });
        }
        else {
            exports.supabase
                .from('action_bidding')
                .insert([
                {
                    id: `${idAuction}_${walletAddress}`,
                    wallet_address: walletAddress,
                    id_auction: idAuction,
                    price_bid: bidAmount,
                },
            ])
                .then(() => {
                exports.supabaseUpdateHighestBid(idAuction || '', bidAmount || 0, walletAddress || '');
            });
        }
    });
};
exports.supabaseUpdateBid = supabaseUpdateBid;
const supabaseAddNewUser = (walletAddress) => {
    exports.supabase
        .from('user_data')
        .select('*')
        .eq('wallet_address', walletAddress)
        .then(data => {
        if (data.body && data.body.length === 0) {
            exports.supabase
                .from('user_data')
                .insert([{ wallet_address: walletAddress }])
                .then();
        }
    });
};
exports.supabaseAddNewUser = supabaseAddNewUser;
const supabaseAddNewNFT = (id, img_nft, name, description, attribute, royalty, arweave_link, mint_key, creator) => {
    exports.supabase
        .from('nft_data')
        .insert([
        {
            id,
            img_nft,
            name,
            description,
            attribute,
            royalty,
            arweave_link,
            mint_key,
            creator,
            holder: creator,
            max_supply: 1,
        },
    ])
        .then();
};
exports.supabaseAddNewNFT = supabaseAddNewNFT;
const supabaseUpdateStatusInstantSale = (idAuction) => {
    exports.supabase
        .from('auction_status')
        .update({ isLiveMarket: false, is_redeem: true })
        .eq('id', idAuction)
        .then();
};
exports.supabaseUpdateStatusInstantSale = supabaseUpdateStatusInstantSale;
const supabaseUpdateIsRedeem = (idAuction, walletAddress) => {
    exports.supabase
        .from('action_bidding')
        .update({ is_redeem: true })
        .eq('id', `${idAuction}_${walletAddress}`)
        .then();
};
exports.supabaseUpdateIsRedeem = supabaseUpdateIsRedeem;
const supabaseUpdateIsRedeemAuctionStatus = (idAuction) => {
    exports.supabase
        .from('auction_status')
        .update({ is_redeem: true })
        .eq('id', idAuction)
        .then();
};
exports.supabaseUpdateIsRedeemAuctionStatus = supabaseUpdateIsRedeemAuctionStatus;
const supabaseUpdateHighestBid = (idAuction, bid, walletAddress) => {
    console.log('masuk sini');
    exports.supabase
        .from('auction_status')
        .select('highest_bid')
        .eq('id', idAuction)
        .single()
        .then(data => {
        if (data.body && data.body.highest_bid < bid) {
            exports.supabase
                .from('auction_status')
                .update({ highest_bid: bid, winner: walletAddress })
                .eq('id', idAuction)
                .then(data => {
                console.log('data ', data);
            });
        }
    });
};
exports.supabaseUpdateHighestBid = supabaseUpdateHighestBid;
//# sourceMappingURL=supabaseClient.js.map