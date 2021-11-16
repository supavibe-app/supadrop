"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemAuction = exports.Collection = void 0;
class Collection {
    constructor(id, name, description, supply, price, sold, start_publish, images) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.supply = supply;
        this.price = price;
        this.sold = sold;
        this.start_publish = start_publish;
        this.images = images;
    }
}
exports.Collection = Collection;
class ItemAuction {
    constructor(id, name, id_nft, token_mint, price_floor, img_nft, startAt, endAt, highestBid, price_tick, gapTime, tickExtend, vault, arweave_link, owner, winner, mint_key, isInstantSale) {
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
        this.winner = winner;
        this.mint_key = mint_key;
        this.isInstantSale = isInstantSale;
    }
}
exports.ItemAuction = ItemAuction;
//# sourceMappingURL=types.js.map