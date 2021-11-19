import { sendPlaceBid } from '../../actions/sendPlaceBid';
import {
  supabase,
  supabaseUpdateStatusInstantSale,
  useConnection,
  useMeta,
  useUserAccounts,
} from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { sendRedeemBid } from '../../actions/sendRedeemBid';
import { AuctionView, useBidsForAuction, useUserBalance } from '../../hooks';
import { Button } from 'antd';
import { ArtCard } from '../../components/ArtCard';
import { Link } from 'react-router-dom';
import { endSale } from '../AuctionCard/utils/endSale';

export const ArtCardOnSale = ({
  auctionView,
}: {
  auctionView: AuctionView;
}) => {
  const connection = useConnection();
  const walletContext = useWallet();
  const { accountByMint } = useUserAccounts();
  const bids = useBidsForAuction(auctionView.auction.pubkey);
  const myPayingAccount = useUserBalance(auctionView?.auction.info.tokenMint)
    .accounts[0];
  const { update, prizeTrackingTickets, bidRedemptions } = useMeta();
  const baseInstantSalePrice =
    auctionView.auctionDataExtended?.info.instantSalePrice;

  const instantSalePrice =
    (baseInstantSalePrice?.toNumber() || 0) / Math.pow(10, 9);

  const endInstantSale = async () => {
    try {
      const wallet = walletContext;
      const endStatus = await endSale({
        auctionView,
        connection,
        accountByMint,
        bids,
        bidRedemptions,
        prizeTrackingTickets,
        wallet,
      });
      supabaseUpdateStatusInstantSale(auctionView.auction.pubkey);
    } catch (e) {
      console.error('endAuction', e);
      return;
    }
  };

  return (
    <>
      <Link to={`/auction/${auctionView.auction.pubkey}`}>
        <ArtCard
          key={auctionView.auction.pubkey}
          pubkey={auctionView.auction.pubkey}
          preview={false}
        />
      </Link>
      <Button onClick={endInstantSale}>Unlisting</Button>
    </>
  );
};
