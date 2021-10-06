import React, { useEffect, useState } from 'react';
import {
  Steps,
  Row,
  Button,
  Col,
  Input,
  Progress,
  Radio,
} from 'antd';
import { useLocation } from 'react-router-dom'
import { ArtCard } from './../../components/ArtCard';
import { QUOTE_MINT } from './../../constants';
import { Confetti } from './../../components/Confetti';
import { ArtSelector } from './artSelector';
import {
  useConnection,
  WinnerLimit,
  WinnerLimitType,
  toLamports,
  useMint,
  Creator,
  PriceFloor,
  PriceFloorType,
  IPartialCreateAuctionArgs,
  StringPublicKey,
} from '@oyster/common';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { useHistory, useParams } from 'react-router-dom';
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
import useWindowDimensions from '../../utils/layout';
import { SystemProgram } from '@solana/web3.js';
import { supabase } from '../../../supabaseClient';
import { useUserArts } from '../../hooks';
import moment from 'moment';
const { Step } = Steps;

export enum AuctionCategory {
  InstantSale,
  Single
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
}

export const AuctionCreateView = () => {
  
  const connection = useConnection();
  const wallet = useWallet();
  const { whitelistedCreatorsByCreator } = useMeta();
  const { step_param }: { step_param: string } = useParams();
  const history = useHistory();
  const mint = useMint(QUOTE_MINT);
  const { width } = useWindowDimensions();
  const [step, setStep] = useState<number>(0);
  const [stepsVisible, setStepsVisible] = useState<boolean>(true);
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
    items: [],
    category: AuctionCategory.InstantSale,
    auctionDurationType: 'days',
    gapTimeType: 'minutes',
    winnersCount: 1,
  });

  useEffect(() => {
    if (step_param) setStep(parseInt(step_param));
    else gotoNextStep(0);
  }, [step_param]);

  const gotoNextStep = (_step?: number) => {
    const nextStep = _step === undefined ? step + 1 : _step;
    history.push(`/auction/create/${nextStep.toString()}`);
  };

  const createAuction = async () => {
    let winnerLimit: WinnerLimit;
    if (attributes.category === AuctionCategory.InstantSale) {
      console.log('masuk instant sale');
      
      if (attributes.items.length > 0) {
        const item = attributes.items[0];
        if (!attributes.editions) {
          item.winningConfigType =
            item.metadata.info.updateAuthority ===
            (wallet?.publicKey || SystemProgram.programId).toBase58()
              ? WinningConfigType.FullRightsTransfer
              : WinningConfigType.TokenOnlyTransfer;
        }
        item.amountRanges = [
          new AmountRange({
            amount: new BN(1),
            length: new BN(attributes.editions || 1),
          }),
        ];
      }
      winnerLimit = new WinnerLimit({
        type: WinnerLimitType.Capped,
        usize: new BN(attributes.editions || 1),
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
      attributes.priceFloor === attributes.instantSalePrice ;

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
      );
      
    supabase.from('auction_status')
    .insert([{
      id:_auctionObj.auction,
      start_auction:attributes.startSaleTS,
      end_auction:(attributes.startSaleTS || 0 + (auctionSettings.endAuctionAt?.toNumber() || 0)),
      highest_bid:0,
      id_nft:attributes.items[0].metadata.pubkey,
      price_floor:attributes.priceFloor,
      price_tick:attributes.priceTick,
      gap_time:attributes.gapTime,
      tick_size_ending_phase:attributes.tickSizeEndingPhase,
      token_mint:QUOTE_MINT.toBase58(),
      vault:_auctionObj.vault,
      type_auction:isInstantSale || false,
      owner:wallet.publicKey?.toBase58()
    }])
    .then()
    setAuctionObj(_auctionObj);
    
  };



  const sellStep =(
    <SellStep 
    attributes={attributes}
      setAttributes={setAttributes}
      auction={auctionObj}
      confirm={() => {
        setStepsVisible(false);
        gotoNextStep();
      }}
      
    />
  )
  const waitStep = (
    <WaitingStep createAuction={createAuction} confirm={() => gotoNextStep()} />
  );
  const congratsStep = <Congrats auction={auctionObj} />;
  const stepsSellNFT = [
    ['Sell', sellStep],
    ['Publish', waitStep],
    [undefined, congratsStep],
  ]



  return (
    <>
        <Row style={{ paddingTop: 50 }}>
        <Col span={24} {...(stepsVisible ? { md: 20 } : { md: 24 })}>
          {stepsSellNFT[step][1]}
          {0 < step && stepsVisible && (
            <div style={{ margin: 'auto', width: 'fit-content' }}>
              <Button onClick={() => gotoNextStep(step - 1)}>Back</Button>
            </div>
          )}
        </Col>
      </Row>
    </>
  );
};

const SellStep = (props: {
  attributes: AuctionState;
  setAttributes: (attr: AuctionState) => void;
  confirm: () => void;
  auction?: {
    vault: StringPublicKey;
    auction: StringPublicKey;
    auctionManager: StringPublicKey;
  };
}) => {
  const [category,setCategory] = useState(AuctionCategory.InstantSale)
  const handleCategory = e => {
    setCategory(e.target.value)
  };
  const location= useLocation()
  const state:any= location.state

  const dataNFT = useUserArts();
  useEffect(()=>{
    if (state?.idNFT) {
      props.setAttributes({
        ...props.attributes,
        items:dataNFT
      })
    }
  },[])
  const [time,setTime] = useState(1)
  const [priceFloor,setPriceFloor] = useState<number>()
  const handleTime = e => {
    setTime(e.target.value)
  };
  let artistFilter = (i: SafetyDepositDraft) =>
  !(i.metadata.info.data.creators || []).find((c: Creator) => !c.verified);
  let filter: (i: SafetyDepositDraft) => boolean = (i: SafetyDepositDraft) =>
    true;

  let overallFilter = (i: SafetyDepositDraft) => filter(i) && artistFilter(i);
  
  return (
    <>
    <Row className="content-action">
      <Col xl={24}>
        <ArtSelector
          filter={overallFilter}
          selected={props.attributes.items}
          setSelected={items => {
            props.setAttributes({ ...props.attributes, items });
          }}
          allowMultiple={false}
        >
          Select NFT 
        </ArtSelector>
      </Col>
    </Row>
    <Row>
    <label className="action-field">
            <span className="field-title">Price Floor </span>
            <span className="field-info">
              This is the starting bid price for your auction. 
            </span>
            <Input
              type="number"
              min={0}
              autoFocus
              className="input"
              placeholder="Price"
              prefix="◎"
              suffix="SOL"
              onChange={info =>
                setPriceFloor(parseFloat(info.target.value))
              }
            />
          </label>
    </Row>
    <Row>
      <Radio.Group onChange={handleCategory} value={category}>
        <Radio value={AuctionCategory.InstantSale}>Instant Sale</Radio>
        <Radio value={AuctionCategory.Single}>Timed Auction</Radio>
      </Radio.Group>
    </Row>
    <Row>
      {category === AuctionCategory.Single && <Radio.Group onChange={handleTime} value={time}>
        <Radio value={1}>1 day</Radio>
        <Radio value={3}>3 days</Radio>
        <Radio value={5}>5 days</Radio>
      </Radio.Group>}
    </Row>


    <Row>
      <Button
        type="primary"
        size="large"
        onClick={async () => {
          if (category === AuctionCategory.InstantSale) {
            
            props.setAttributes({
              ...props.attributes,
              priceFloor,
              "instantSalePrice": priceFloor
            })
            
          }else{
            
            props.setAttributes({
              ...props.attributes,
              startSaleTS:moment().unix(),
              priceFloor,
              priceTick:0.1,
              auctionDuration:time,
              gapTime:15,
              tickSizeEndingPhase: 10,
            });
            
          }
          props.confirm()
        }}
        className="action-btn"
      >
        {'list my NFT'}
      </Button>
    </Row>
  </>
  );
};
const WaitingStep = (props: {
  createAuction: () => Promise<void>;
  confirm: () => void;
}) => {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const func = async () => {
      const inte = setInterval(
        () => setProgress(prog => Math.min(prog + 1, 99)),
        600,
      );
      
      await props.createAuction();
      clearInterval(inte);
      props.confirm();
    };
    func();
  }, []);

  return (
    <div
      style={{
        marginTop: 70,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Progress type="circle" percent={progress} />
      <div className="waiting-title">
        Your creation is being listed with Metaplex...
      </div>
      <div className="waiting-subtitle">This can take up to 30 seconds.</div>
    </div>
  );
};

const Congrats = (props: {
  auction?: {
    vault: StringPublicKey;
    auction: StringPublicKey;
    auctionManager: StringPublicKey;
  };
}) => {
  const history = useHistory();

  const newTweetURL = () => {
    const params = {
      text: "I've created a new NFT auction on Metaplex, check it out!",
      url: `${
        window.location.origin
      }/#/auction/${props.auction?.auction.toString()}`,
      hashtags: 'NFT,Crypto,Metaplex',
      // via: "Metaplex",
      related: 'Metaplex,Solana',
    };
    const queryParams = new URLSearchParams(params).toString();
    return `https://twitter.com/intent/tweet?${queryParams}`;
  };

  return (
    <>
      <div
        style={{
          marginTop: 70,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div className="waiting-title">
          Congratulations! Your auction is now live.
        </div>
        <div className="congrats-button-container">
          <Button
            className="metaplex-button"
            onClick={_ => window.open(newTweetURL(), '_blank')}
          >
            <span>Share it on Twitter</span>
            <span>&gt;</span>
          </Button>
          <Button
            className="metaplex-button"
            onClick={_ =>
              history.push(`/auction/${props.auction?.auction.toString()}`)
            }
          >
            <span>See it in your auctions</span>
            <span>&gt;</span>
          </Button>
        </div>
      </div>
      <Confetti />
    </>
  );
};