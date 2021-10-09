
import { sendPlaceBid } from '../../actions/sendPlaceBid';
import { useConnection, useMeta, useUserAccounts } from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { sendRedeemBid } from '../../actions/sendRedeemBid';
import { AuctionView, useBidsForAuction, useUserBalance } from '../../hooks';
import { Button } from 'antd';
import { ArtCard } from '../../components/ArtCard';
import { Link } from 'react-router-dom';

export const ArtCardOnSale = ({ auctionView }: { auctionView: AuctionView; }) => {
    const connection = useConnection();
    const walletContext = useWallet();
    const { accountByMint } = useUserAccounts();
    const bids = useBidsForAuction(auctionView.auction.pubkey);
    const myPayingAccount = useUserBalance(auctionView?.auction.info.tokenMint).accounts[0]
    const { update, prizeTrackingTickets, bidRedemptions } = useMeta();
    const baseInstantSalePrice =
        auctionView.auctionDataExtended?.info.instantSalePrice;

    const instantSalePrice = (baseInstantSalePrice?.toNumber() || 0) / Math.pow(10, 9)

    const instantSale = async () => {
        try {
            await sendPlaceBid(
                connection,
                walletContext,
                walletContext.publicKey?.toBase58(),
                auctionView,
                accountByMint,
                instantSalePrice,
            );
        } catch (e) {
            console.error('sendPlaceBid', e);
            return
        }

        const newAuctionState = await update(
            auctionView.auction.pubkey,
            walletContext.publicKey,
        );
        auctionView.auction = newAuctionState[0];
        auctionView.myBidderPot = newAuctionState[1];
        auctionView.myBidderMetadata = newAuctionState[2];
        // Claim the purchase
        try {
            await sendRedeemBid(
                connection,
                walletContext,
                myPayingAccount.pubkey,
                auctionView,
                accountByMint,
                prizeTrackingTickets,
                bidRedemptions,
                bids,
            ).then(async () => {
                await update();
                // show congrate
            });
        } catch (e) {
            console.error(e);
        }

        // setLoading(false);
    }

    return (<>
        <Link to={`/auction/${auctionView.auction.pubkey}`}>
            <ArtCard key={auctionView.auction.pubkey} pubkey={auctionView.auction.pubkey} preview={false} />
        </Link>
        <Button onClick={instantSale}>Unlisting</Button>
    </>);
};
