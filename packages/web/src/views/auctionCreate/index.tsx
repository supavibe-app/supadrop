import React, { useState } from 'react';
import { Row, Col } from 'antd';
import FeatherIcon from 'feather-icons-react';
import { QUOTE_MINT } from './../../constants';
import {
  useConnection,
  WinnerLimit,
  WinnerLimitType,
  toLamports,
  useMint,
  constants,
  PriceFloor,
  PriceFloorType,
  IPartialCreateAuctionArgs,
  StringPublicKey,
  ItemAuction,
  pubkeyToString,
  supabase,
  supabaseAddNewNFT,
  supabaseUpdateOnSaleNFT,
} from '@oyster/common';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { useHistory } from 'react-router-dom';
import {
  WinningConfigType,
  AmountRange,
} from '@oyster/common/dist/lib/models/metaplex/index';
import {
  createAuctionManager,
  SafetyDepositDraft,
} from '../../actions/createAuctionManager';
import BN from 'bn.js';
import { useMeta } from '../../contexts';
import { SystemProgram } from '@solana/web3.js';
import SellStep from '../../components/Listing/SellStep';
import WaitingStep from '../../components/Listing/WaitingStep';
import { BackButton } from './style';
import CongratsStep from '../../components/Listing/CongratsStep';
import { ArtCard } from '../../components/ArtCard';
import { useUserSingleArt, useExtendedArt, useArweaveData } from '../../hooks';

const { ZERO } = constants;

enum InstantSaleType {
  Limited,
  Single,
  Open,
}

export enum AuctionCategory {
  InstantSale,
  Single,
}
export interface AuctionState {
  reservationPrice: number;
  items: SafetyDepositDraft[];
  participationNFT?: SafetyDepositDraft;
  participationFixedPrice?: number;
  editions?: number;
  startDate?: Date;
  endDate?: Date;
  category: AuctionCategory;
  price?: number;
  priceFloor?: number;
  priceTick?: number;
  startSaleTS?: number;
  startListTS?: number;
  endTS?: number;
  auctionDuration?: number;
  auctionDurationType?: 'days' | 'hours' | 'minutes';
  gapTime?: number;
  gapTimeType?: 'days' | 'hours' | 'minutes';
  tickSizeEndingPhase?: number;
  spots?: number;
  winnersCount: number;
  instantSalePrice?: number;
  instantSaleType?: InstantSaleType;
}

export const AuctionCreateView = () => {
  // const connection = useConnection();
  // const wallet = useWallet();
  const {
    whitelistedCreatorsByCreator,
    storeIndexer,
    updateAllDataAuction,
    updateLiveDataAuction,
  } = useMeta();

  // const { step_param }: { step_param: string } = useParams();
  // const history = useHistory();
  const history = useHistory();
  const wallet = useWallet();
  const { update } = useMeta();
  const { state } = history.location;
  const { idNFT }: any = state || {};

  const singleUser = useUserSingleArt(idNFT);

  const connection = useConnection();
  const mint = useMint(QUOTE_MINT);

  const [step, setStep] = useState<number>(0);
  const [auctionObj, setAuctionObj] =
    useState<
      | {
          vault: StringPublicKey;
          auction: StringPublicKey;
          auctionManager: StringPublicKey;
        }
      | undefined
    >(undefined);
  const [attributes, setAttributes] = useState<AuctionState>({
    reservationPrice: 0,
    items: singleUser,
    category: AuctionCategory.InstantSale,
    auctionDurationType: 'days',
    gapTimeType: 'minutes',
    winnersCount: 1,
  });

  const { data } = useArweaveData(attributes.items[0].metadata.pubkey);

  const createAuction = async () => {
    let winnerLimit: WinnerLimit;

    if (
      attributes.category === AuctionCategory.InstantSale &&
      attributes.instantSaleType === InstantSaleType.Open
    ) {
      const { items, instantSalePrice } = attributes;

      if (items.length > 0 && items[0].participationConfig) {
        items[0].participationConfig.fixedPrice = new BN(
          toLamports(instantSalePrice, mint) || 0,
        );
      }

      winnerLimit = new WinnerLimit({
        type: WinnerLimitType.Unlimited,
        usize: ZERO,
      });
    } else if (attributes.category === AuctionCategory.InstantSale) {
      const { items, editions } = attributes;

      if (items.length > 0) {
        const item = items[0];

        if (!editions) {
          item.winningConfigType =
            item.metadata.info.updateAuthority ===
            (wallet?.publicKey || SystemProgram.programId).toBase58()
              ? WinningConfigType.FullRightsTransfer
              : WinningConfigType.TokenOnlyTransfer;
        }
        item.amountRanges = [
          new AmountRange({
            amount: new BN(1),
            length: new BN(editions || 1),
          }),
        ];
      }
      winnerLimit = new WinnerLimit({
        type: WinnerLimitType.Capped,
        usize: new BN(editions || 1),
      });
    } else {
      if (attributes.items.length > 0) {
        const item = attributes.items[0];
        if (
          attributes.category == AuctionCategory.Single &&
          item.masterEdition
        ) {
          item.winningConfigType =
            item.metadata.info.updateAuthority ===
            (wallet?.publicKey || SystemProgram.programId).toBase58()
              ? WinningConfigType.FullRightsTransfer
              : WinningConfigType.TokenOnlyTransfer;
        }
        item.amountRanges = [
          new AmountRange({
            amount: new BN(1),
            length:
              attributes.category === AuctionCategory.Single
                ? new BN(1)
                : new BN(attributes.editions || 1),
          }),
        ];
      }
      winnerLimit = new WinnerLimit({
        type: WinnerLimitType.Capped,
        usize:
          attributes.category === AuctionCategory.Single
            ? new BN(1)
            : new BN(attributes.editions || 1),
      });

      if (
        attributes.participationNFT &&
        attributes.participationNFT.participationConfig
      ) {
        attributes.participationNFT.participationConfig.fixedPrice = new BN(
          toLamports(attributes.participationFixedPrice, mint) || 0,
        );
      }
    }
    const isInstantSale =
      attributes.instantSalePrice &&
      attributes.priceFloor === attributes.instantSalePrice;

    const auctionSettings: IPartialCreateAuctionArgs = {
      winners: winnerLimit,
      endAuctionAt: isInstantSale
        ? null
        : new BN(
            (attributes.auctionDuration || 0) *
              (attributes.auctionDurationType == 'days'
                ? 60 * 60 * 24 // 1 day in seconds
                : attributes.auctionDurationType == 'hours'
                ? 60 * 60 // 1 hour in seconds
                : 60), // 1 minute in seconds
          ), // endAuctionAt is actually auction duration, poorly named, in seconds
      auctionGap: isInstantSale
        ? null
        : new BN(
            (attributes.gapTime || 0) *
              (attributes.gapTimeType == 'days'
                ? 60 * 60 * 24 // 1 day in seconds
                : attributes.gapTimeType == 'hours'
                ? 60 * 60 // 1 hour in seconds
                : 60), // 1 minute in seconds
          ),
      priceFloor: new PriceFloor({
        type: attributes.priceFloor
          ? PriceFloorType.Minimum
          : PriceFloorType.None,
        minPrice: new BN((attributes.priceFloor || 0) * LAMPORTS_PER_SOL),
      }),
      tokenMint: QUOTE_MINT.toBase58(),
      gapTickSizePercentage: attributes.tickSizeEndingPhase || null,
      tickSize: attributes.priceTick
        ? new BN(attributes.priceTick * LAMPORTS_PER_SOL)
        : null,
      instantSalePrice: attributes.instantSalePrice
        ? new BN((attributes.instantSalePrice || 0) * LAMPORTS_PER_SOL)
        : null,
      name: null,
    };

    const _auctionObj = await createAuctionManager(
      connection,
      wallet,
      whitelistedCreatorsByCreator,
      auctionSettings,
      attributes.items,
      attributes.participationNFT,
      QUOTE_MINT.toBase58(),
      storeIndexer,
    );
    const item = {
      id: _auctionObj.auction,
      start_auction: attributes.startSaleTS,
      end_auction:
        (attributes.startSaleTS || 0) +
        (auctionSettings.endAuctionAt?.toNumber() || 0),
      highest_bid: 0,
      id_nft: attributes.items[0].metadata.pubkey,
      price_floor: attributes.priceFloor,
      price_tick: attributes.priceTick,
      gap_time: attributes.gapTime,
      tick_size_ending_phase: attributes.tickSizeEndingPhase,
      token_mint: QUOTE_MINT.toBase58(),
      vault: _auctionObj.vault,
      type_auction: isInstantSale || false,
      owner: wallet.publicKey?.toBase58(),
    };

    // const isDataReady = Boolean(data);

    supabase
      .from('auction_status')
      .insert([item])
      .then(result => {
        // TODO CHECK NFT DATA

        if (result.error) {
          supabase
            .from('nft_data')
            .insert([
              {
                id: item.id_nft,
                img_nft: data?.image,
                name: data?.name,
                description: data?.description,
                attribute: data?.attributes,
                royalty: data?.seller_fee_basis_points,
                arweave_link: attributes.items[0].metadata.info.data.uri,
                mint_key: attributes?.items[0].metadata.info.mint,
                creator: data?.properties.creators?.[0].address,
                holder: item.owner,
                max_supply: 1,
              },
            ])
            .then(() => {
              supabase
                .from('nft_data')
                .update({ id_auction: item.id })
                .eq('id', item.id_nft);
              supabase
                .from('auction_status')
                .insert([item])
                .then(result => {
                  updateLiveDataAuction();
                  updateAllDataAuction();
                });
            });
        } else {
          updateLiveDataAuction();
          updateAllDataAuction();
          supabase
            .from('nft_data')
            .update({ id_auction: item.id })
            .eq('id', item.id_nft);
        }
      });
    supabaseUpdateOnSaleNFT(idNFT, true);

    setAuctionObj(_auctionObj);
    await update();
  };

  const sellStep = (
    <SellStep
      attributes={attributes}
      setAttributes={setAttributes}
      auction={auctionObj}
      confirm={() => setStep(step + 1)}
    />
  );

  const waitStep = (
    <WaitingStep
      createAuction={createAuction}
      confirm={() => setStep(step + 1)}
      goBack={() => setStep(step - 1)}
    />
  );

  const congratsStep = <CongratsStep auction={auctionObj} />;

  const stepsSellNFT = {
    0: sellStep,
    1: waitStep,
    2: congratsStep,
  };

  // supaya gaada yang hard visit (visit without nft)
  if (!idNFT && wallet.publicKey)
    history.push(`/${wallet.publicKey.toBase58()}`);

  return (
    <Row justify="center" style={{ paddingTop: 50 }}>
      <Col span={12}>
        {step < 1 && (
          <Row>
            <div className={BackButton} onClick={history.goBack}>
              <FeatherIcon icon="arrow-left" />
              <div>GO BACK</div>
            </div>
          </Row>
        )}

        <Row align={step > 0 ? 'middle' : 'top'} gutter={72}>
          <Col span={12}>
            <ArtCard pubkey={idNFT} preview={false} />
          </Col>

          {stepsSellNFT[step]}
        </Row>
      </Col>
    </Row>
  );
};
