"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemAuction = void 0;
class ItemAuction {
    constructor(id, name, id_nft, token_mint, price_floor, img_nft, startAt, endAt, highestBid, price_tick, gapTime, tickExtend, vault, arweave_link, owner, mint_key, isInstantSale) {
        this.id = id;
        this.name = name;
        this.id_nft = id_nft;
        this.token_mint = token_mint;
        this.price_floor = price_floor;
        this.img_nft = img_nft;
        this.startAt = startAt;
        this.endAt = endAt;
        this.highestBid = highestBid;
        this.price_tick = price_tick;
        this.gapTime = gapTime;
        this.tickExtend = tickExtend;
        this.vault = vault;
        this.arweave_link = arweave_link;
        this.owner = owner;
        this.mint_key = mint_key;
        this.isInstantSale = isInstantSale;
    }
}
exports.ItemAuction = ItemAuction;
//# sourceMappingURL=types.js.map