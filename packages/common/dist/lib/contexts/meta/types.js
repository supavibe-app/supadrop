"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NFTData = exports.ItemAuction = exports.Collection = void 0;
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
    constructor(id, name, id_nft, token_mint, price_floor, original_file, thumbnail, media_type, startAt, endAt, highestBid, price_tick, gapTime, tickExtend, vault, arweave_link, owner, winner, mint_key, isInstantSale, royalty, ownerImg, ownerUsername) {
        this.id = id;
        this.name = name;
        this.id_nft = id_nft;
        this.token_mint = token_mint;
        this.price_floor = price_floor;
        this.original_file = original_file;
        this.thumbnail = thumbnail;
        this.media_type = media_type;
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
        this.royalty = royalty;
        this.ownerImg = ownerImg;
        this.ownerUsername = ownerUsername;
    }
}
exports.ItemAuction = ItemAuction;
class NFTData {
    constructor(id, name, description, creator, holder, royalty, imgNFT, arweave_link, mediaType, winner, mint_key, isInstantSale) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.creator = creator;
        this.holder = holder;
        this.royalty = royalty;
        this.imgNFT = imgNFT;
        this.arweave_link = arweave_link;
        this.mediaType = mediaType;
        this.winner = winner;
        this.mint_key = mint_key;
        this.isInstantSale = isInstantSale;
    }
}
exports.NFTData = NFTData;
//# sourceMappingURL=types.js.map