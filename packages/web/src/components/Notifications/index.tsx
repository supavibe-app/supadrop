import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircleTwoTone,
  LoadingOutlined,
  PlayCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import {
  findProgramAddress,
  programIds,
  StringPublicKey,
  toPublicKey,
  useConnection,
  useUserAccounts,
  VaultState,
  WalletSigner,
  WRAPPED_SOL_MINT,
  supabase,
} from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { Badge, Popover, List, Button, Tooltip } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import moment from 'moment';
import { closePersonalEscrow } from '../../actions/closePersonalEscrow';
import { decommAuctionManagerAndReturnPrizes } from '../../actions/decommAuctionManagerAndReturnPrizes';
import { sendSignMetadata } from '../../actions/sendSignMetadata';
import { unwindVault } from '../../actions/unwindVault';
import { settle } from '../../actions/settle';
import { startAuctionManually } from '../../actions/startAuctionManually';
import { QUOTE_MINT } from '../../constants';
import { useMeta } from '../../contexts';
import {
  AuctionViewState,
  processAccountsIntoAuctionView,
  useAuctions,
  useHighestBidForAuction,
} from '../../hooks';
import {
  BadgeStyle,
  CircleButton,
  EmptyNotification,
  ListStyle,
  NotificationPopover,
} from './style';
import {
  GreyColor,
  uBoldFont,
  uFlexSpaceBetween,
  uLowerCase,
  WhiteColor,
} from '../../styles';
import Coffee from '../../assets/icons/coffee';
import FeatherIcon from 'feather-icons-react';
import {
  getEndedOnSale,
  getInfoEndedBidding,
  getOnSale,
} from '../../database/userData';

interface NotificationCard {
  id: string;
  title: string;
  description: string | JSX.Element;
  action: () => Promise<boolean>;
  dismiss?: () => Promise<boolean>;
  textButton: string;
  notifiedAt?: number;
}

enum RunActionState {
  NotRunning,
  Running,
  Success,
  Failed,
}

function RunAction({
  id,
  action,
  onFinish,
  icon,
}: {
  id: string;
  action: () => Promise<boolean>;
  onFinish?: () => void;
  icon: JSX.Element;
}) {
  const [state, setRunState] = useState<RunActionState>(
    RunActionState.NotRunning,
  );

  useMemo(() => setRunState(RunActionState.NotRunning), [id]);

  const run = async () => {
    await setRunState(RunActionState.Running);
    const result = await action();
    if (result) {
      await setRunState(RunActionState.Success);
      setTimeout(() => (onFinish ? onFinish() : null), 2000); // Give user a sense of completion before removal from list
    } else {
      await setRunState(RunActionState.Failed);
    }
  };

  let component;
  switch (state) {
    case RunActionState.NotRunning:
      component = (
        <span className="hover-button" onClick={run}>
          {icon}
        </span>
      );
      break;
    case RunActionState.Failed:
      component = (
        <span className="hover-button" onClick={run}>
          <SyncOutlined />
        </span>
      );
      break;
    case RunActionState.Running:
      component = <LoadingOutlined />;
      break;
    case RunActionState.Success:
      component = <CheckCircleTwoTone twoToneColor="#52c41a" />;
  }

  return component;
}

export async function getPersonalEscrowAta(
  wallet: WalletSigner | undefined,
): Promise<StringPublicKey | undefined> {
  const PROGRAM_IDS = programIds();
  if (!wallet?.publicKey) return;

  return (
    await findProgramAddress(
      [
        wallet.publicKey.toBuffer(),
        PROGRAM_IDS.token.toBuffer(),
        QUOTE_MINT.toBuffer(),
      ],
      PROGRAM_IDS.associatedToken,
    )
  )[0];
}
export function useCollapseWrappedSol({
  connection,
  wallet,
  notifications,
}: {
  connection: Connection;
  wallet: WalletSigner;
  notifications: NotificationCard[];
}) {
  const [showNotification, setShowNotification] = useState(false);
  const fn = async () => {
    const ata = await getPersonalEscrowAta(wallet);
    if (ata) {
      try {
        const balance = await connection.getTokenAccountBalance(
          toPublicKey(ata),
        );

        if ((balance && balance.value.uiAmount) || 0 > 0) {
          setShowNotification(true);
        }
      } catch (e) { }
    }
    setTimeout(fn, 60000);
  };
  useEffect(() => {
    fn();
  }, []);

  if (showNotification) {
    notifications.push({
      id: 'unsettled',
      title: 'Unsettled funds!',
      textButton: 'settle',
      description:
        'You have unsettled royalties in your personal escrow account.',
      notifiedAt: moment().unix(),
      action: async () => {
        try {
          const ata = await getPersonalEscrowAta(wallet);
          if (ata) {
            const data = await connection.getAccountInfo(toPublicKey(ata));
            if (data?.data.length || 0 > 0)
              await closePersonalEscrow(connection, wallet, ata);
          }
        } catch (e) {
          console.error(e);
          return false;
        }
        return true;
      },
    });
  }
}

const CALLING_MUTEX: Record<string, boolean> = {};
export function useSettlementAuctions({
  connection,
  wallet,
  notifications,
}: {
  connection: Connection;
  wallet: WalletSigner;
  notifications: NotificationCard[];
}) {
  const { accountByMint } = useUserAccounts();
  const walletPubkey = wallet?.publicKey?.toBase58();
  const { bidderPotsByAuctionAndBidder, pullAuctionPage } = useMeta();
  const auctionsNeedingSettling = [
    ...useAuctions(AuctionViewState.Ended),
    ...useAuctions(AuctionViewState.BuyNow),
  ];

  const [validDiscoveredEndedAuctions, setValidDiscoveredEndedAuctions] =
    useState<Record<string, number>>({});
  useMemo(() => {
    const f = async () => {
      const nextBatch = auctionsNeedingSettling
        .filter(a => {
          const isEndedInstantSale =
            a.isInstantSale &&
            a.items.length === a.auction.info.bidState.bids.length;

          return (
            walletPubkey &&
            a.auctionManager.authority === walletPubkey &&
            (a.auction.info.ended() || isEndedInstantSale)
          );
        })
        .sort(
          (a, b) =>
            (b.auction.info.endedAt?.toNumber() || 0) -
            (a.auction.info.endedAt?.toNumber() || 0),
        );
      for (let i = 0; i < nextBatch.length; i++) {
        const av = nextBatch[i];
        if (!CALLING_MUTEX[av.auctionManager.pubkey]) {
          CALLING_MUTEX[av.auctionManager.pubkey] = true;
          try {
            const balance = await connection.getTokenAccountBalance(
              toPublicKey(av.auctionManager.acceptPayment),
            );
            if (
              ((balance.value.uiAmount || 0) === 0 &&
                av.auction.info.bidState.bids
                  .map(b => b.amount.toNumber())
                  .reduce((acc, r) => (acc += r), 0) > 0) ||
              // FIXME: Why 0.01? If this is used,
              //        no auctions with lower prices (e.g. 0.0001) appear in notifications,
              //        thus making settlement of such an auction impossible.
              //        Temporarily making the number a lesser one.
              // (balance.value.uiAmount || 0) > 0.01
              (balance.value.uiAmount || 0) > 0.00001
            ) {
              setValidDiscoveredEndedAuctions(old => ({
                ...old,
                [av.auctionManager.pubkey]: balance.value.uiAmount || 0,
              }));
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
    };
    f();
  }, [auctionsNeedingSettling.length, walletPubkey]);

  Object.keys(validDiscoveredEndedAuctions).forEach(auctionViewKey => {
    const auctionView = auctionsNeedingSettling.find(
      a => a.auctionManager.pubkey === auctionViewKey,
    );
    if (!auctionView) return;
    const winners = [...auctionView.auction.info.bidState.bids]
      .reverse()
      .slice(0, auctionView.auctionManager.numWinners.toNumber())
      .reduce((acc: Record<string, boolean>, r) => {
        acc[r.key] = true;
        return acc;
      }, {});

    const myPayingAccount = accountByMint.get(
      auctionView.auction.info.tokenMint,
    );
    const auctionKey = auctionView.auction.pubkey;
    const bidsToClaim = Object.values(bidderPotsByAuctionAndBidder).filter(
      b =>
        winners[b.info.bidderAct] &&
        !b.info.emptied &&
        b.info.auctionAct === auctionKey,
    );

    if (bidsToClaim.length || validDiscoveredEndedAuctions[auctionViewKey] > 0)
      notifications.push({
        id: auctionViewKey,
        title: 'You have an ended auction that needs settling!',
        textButton: 'settle',
        notifiedAt: auctionView.auction.info.endedAt?.toNumber(),
        description: (
          <span>
            One of your auctions ended and it has monies that can be claimed.
            For more detail,{' '}
            <Link to={`/auction/${auctionKey}/settle`}>click here.</Link>
          </span>
        ),
        action: async () => {
          try {
            // pull missing data and complete the auction view to settle.
            const {
              auctionDataExtended,
              auctionManagersByAuction,
              safetyDepositBoxesByVaultAndIndex,
              metadataByMint,
              bidderMetadataByAuctionAndBidder:
              updatedBidderMetadataByAuctionAndBidder,
              bidderPotsByAuctionAndBidder,
              bidRedemptionV2sByAuctionManagerAndWinningIndex,
              masterEditions,
              vaults,
              safetyDepositConfigsByAuctionManagerAndIndex,
              masterEditionsByPrintingMint,
              masterEditionsByOneTimeAuthMint,
              metadataByMasterEdition,
              metadataByAuction,
            } = await pullAuctionPage(auctionView.auction.pubkey);
            const completeAuctionView = processAccountsIntoAuctionView(
              auctionView.auction.pubkey,
              auctionView.auction,
              auctionDataExtended,
              auctionManagersByAuction,
              safetyDepositBoxesByVaultAndIndex,
              metadataByMint,
              updatedBidderMetadataByAuctionAndBidder,
              bidderPotsByAuctionAndBidder,
              bidRedemptionV2sByAuctionManagerAndWinningIndex,
              masterEditions,
              vaults,
              safetyDepositConfigsByAuctionManagerAndIndex,
              masterEditionsByPrintingMint,
              masterEditionsByOneTimeAuthMint,
              metadataByMasterEdition,
              {},
              metadataByAuction,
              undefined,
            );
            if (completeAuctionView) {
              await settle(
                connection,
                wallet,
                completeAuctionView,
                // Just claim all bidder pots
                bidsToClaim,
                myPayingAccount?.pubkey,
                accountByMint,
              );
              // accept funds (open WSOL & close WSOL) only if Auction currency SOL
              if (
                wallet.publicKey &&
                auctionView.auction.info.tokenMint ==
                WRAPPED_SOL_MINT.toBase58()
              ) {
                const ata = await getPersonalEscrowAta(wallet);
                if (ata) await closePersonalEscrow(connection, wallet, ata);

              }
            }
          } catch (e) {
            console.error(e);
            return false;
          }
          return true;
        },
      });
  });
}

export function Notifications() {
  const {
    metadata,
    whitelistedCreatorsByCreator,
    store,
    vaults,
    safetyDepositBoxesByVaultAndIndex,
    pullAllSiteData,
  } = useMeta();
  const possiblyBrokenAuctionManagerSetups = useAuctions(
    AuctionViewState.Defective,
  );

  // const liveAuctions = useAuctions(
  //   AuctionViewState.Live,
  // );
  const history = useHistory();
  const upcomingAuctions = useAuctions(AuctionViewState.Upcoming);
  const connection = useConnection();
  const wallet = useWallet();

  //NOTE: notifications untuk kasih tau seller sol yg bisa diambil (settle)
  const notifications: NotificationCard[] = [];

  const walletPubkey = wallet.publicKey?.toBase58() || '';

  useCollapseWrappedSol({ connection, wallet, notifications });

  useSettlementAuctions({ connection, wallet, notifications });
  const notifBidding = getInfoEndedBidding(walletPubkey).data;
  const notifAuction = getEndedOnSale(walletPubkey).data;

  notifBidding.forEach(bidding => {
    let isWinner = bidding?.id_auction?.winner === walletPubkey;

    let title = 'your bid lose the auction, you can refund your bid now';
    let textButton = 'refund';

    // claim, refund bid
    if (isWinner) {
      title = 'your bid won the auction, claim the artwork now';
      textButton = 'claim';
    }
    notifications.push({
      title,
      textButton,
      id: bidding.id,
      notifiedAt: Number(bidding.id_auction.end_auction),
      description: '',
      action: async () => {
        try {
          history.push(`/auction/${bidding.id_auction.id}`);
        } catch (e) {
          console.error(e);
          return false;
        }
        return true;
      },
    });
  });

  // notifAuction.forEach(auction => {
  //   let title = 'you have ended auction that needs to be reclaim';
  //   let textButton = 'reclaim';
  //   const highestBid = auction?.highest_bid;
  //   const haveWinner = highestBid > 0;
  //   // claim, refund bid
  //   if (haveWinner) {
  //     title = 'you have ended auction that needs to be settling';
  //     textButton = 'settle';
  //   }

  //   notifications.push({
  //     title,
  //     textButton,
  //     id: auction.id,
  //     notifiedAt: Number(auction.end_auction),
  //     description: '',
  //     action: async () => {
  //       try {
  //         history.push(`/auction/${auction.id}`);
  //       } catch (e) {
  //         console.error(e);
  //         return false;
  //       }
  //       return true;
  //     },
  //   });
  // });

  const vaultsNeedUnwinding = useMemo(
    () =>
      Object.values(vaults).filter(
        v =>
          v.info.authority === walletPubkey &&
          v.info.state !== VaultState.Deactivated &&
          v.info.tokenTypeCount > 0,
      ),
    [vaults, walletPubkey],
  );

  vaultsNeedUnwinding.forEach(v => {
    notifications.push({
      id: v.pubkey,
      title: 'You have items locked in a defective auction!',
      textButton: 'claim',
      notifiedAt: moment().unix(),
      description: (
        <span>
          During an auction creation process that probably had some issues, you
          lost an item. Reclaim it now.
        </span>
      ),
      action: async () => {
        try {
          await unwindVault(
            connection,
            wallet,
            v,
            safetyDepositBoxesByVaultAndIndex,
          );
        } catch (e) {
          console.error(e);
          return false;
        }
        return true;
      },
    });
  });

  possiblyBrokenAuctionManagerSetups
    .filter(v => v.auctionManager.authority === walletPubkey)
    .forEach(v => {
      notifications.push({
        id: v.auctionManager.pubkey,
        textButton: 'refund',
        title: 'You have items locked in a defective auction!',
        notifiedAt: moment().unix(),
        description: (
          <span>
            During an auction creation process that probably had some issues,
            you lost an item. Reclaim it now.
          </span>
        ),
        action: async () => {
          try {
            await decommAuctionManagerAndReturnPrizes(
              connection,
              wallet,
              v,
              safetyDepositBoxesByVaultAndIndex,
            );
          } catch (e) {
            console.error(e);
            return false;
          }
          return true;
        },
      });
    });

  const metaNeedsApproving = useMemo(
    () =>
      metadata.filter(m => {
        return (
          m.info.data.creators &&
          (whitelistedCreatorsByCreator[m.info.updateAuthority]?.info
            ?.activated ||
            store?.info.public) &&
          m.info.data.creators.find(
            c => c.address === walletPubkey && !c.verified,
          )
        );
      }),
    [metadata, whitelistedCreatorsByCreator, walletPubkey],
  );

  metaNeedsApproving.forEach(m => {
    notifications.push({
      id: m.pubkey,
      title: 'You have a new artwork to approve!',
      textButton: 'approve',
      notifiedAt: moment().unix(),
      description: (
        <span>
          {whitelistedCreatorsByCreator[m.info.updateAuthority]?.info?.name ||
            m.pubkey}{' '}
          wants you to approve that you helped create their art{' '}
          <Link to={`/art/${m.pubkey}`}>here.</Link>
        </span>
      ),
      action: async () => {
        try {
          await sendSignMetadata(connection, wallet, m.pubkey);
        } catch (e) {
          console.error(e);
          return false;
        }
        return true;
      },
    });
  });

  upcomingAuctions
    .filter(v => v.auctionManager.authority === walletPubkey)
    .forEach(v => {
      notifications.push({
        id: v.auctionManager.pubkey,
        title: 'You have an auction which is not started yet!',
        textButton: 'activate',
        notifiedAt: moment().unix(),
        description: <span>You can activate it now if you wish.</span>,
        action: async () => {
          try {
            await startAuctionManually(connection, wallet, v);
          } catch (e) {
            console.error(e);
            return false;
          }
          return true;
        },
      });
    });

  const content = notifications.length ? (
    <div>
      <List
        itemLayout="vertical"
        size="small"
        dataSource={notifications}
        renderItem={(notification: NotificationCard) => (
          <List.Item
            className={ListStyle}
            extra={
              <Button
                className={uBoldFont}
                onClick={notification.action}
                type="link"
              >
                {notification.textButton}
              </Button>
            }
          >
            {notification.description && (
              <Tooltip
                title={
                  <div className={uLowerCase}>{notification.description}</div>
                }
              >
                <div className={uLowerCase}>{notification.title}</div>
              </Tooltip>
            )}
            {!notification.description && (
              <div className={uLowerCase}>{notification.title}</div>
            )}
            <div className={GreyColor}>
              {moment((notification.notifiedAt || 0) * 1000).fromNow()}
            </div>
          </List.Item>
        )}
      />
    </div>
  ) : (
    <div className={EmptyNotification}>
      <Coffee />
      <div>no notifications</div>
    </div>
  );

  if (notifications.length === 0) {
    return (
      <Popover
        overlayClassName={NotificationPopover}
        content={content}
        trigger="click"
        placement="bottomRight"
        title={
          <div className={`${uBoldFont} ${uFlexSpaceBetween}`}>
            <div className={WhiteColor}>notification</div>
          </div>
        }
      >
        <Button
          className={CircleButton({ active: false })}
          icon={<FeatherIcon icon="bell" size="20" />}
          shape="circle"
        />
      </Popover>
    );
  }

  return (
    <Badge className={BadgeStyle} dot>
      <Popover
        overlayClassName={NotificationPopover}
        content={content}
        trigger="click"
        placement="bottomRight"
        title={
          <div className={`${uBoldFont} ${uFlexSpaceBetween}`}>
            <div className={WhiteColor}>notification</div>
          </div>
        }
      >
        <Button
          className={CircleButton({ active: true })}
          icon={<FeatherIcon icon="bell" size="20" />}
          shape="circle"
        />
      </Popover>
    </Badge>
  );

  // const content = notifications.length ? (
  //   <div
  //     style={{ width: '300px', color: 'white' }}
  //     className={'notifications-container'}
  //   >
  //     <List
  //       itemLayout="vertical"
  //       size="small"
  //       dataSource={notifications.slice(0, 10)}
  //       renderItem={(item: NotificationCard) => (
  //         <List.Item
  //           extra={
  //             <>
  //               <RunAction
  //                 id={item.id}
  //                 action={item.action}
  //                 icon={<PlayCircleOutlined />}
  //               />
  //               {item.dismiss && (
  //                 <RunAction
  //                   id={item.id}
  //                   action={item.dismiss}
  //                   icon={<PlayCircleOutlined />}
  //                 />
  //               )}
  //             </>
  //           }
  //         >
  //           <List.Item.Meta
  //             title={<span>{item.title}</span>}
  //             description={
  //               <span>
  //                 <i>{item.description}</i>
  //               </span>
  //             }
  //           />
  //         </List.Item>
  //       )}
  //     />
  //   </div>
  // ) : (
  //   <span>No notifications</span>
  // );

  // const justContent = (
  //   <Popover placement="bottomLeft" content={content} trigger="click">
  //     <img src={'/bell.svg'} style={{ cursor: 'pointer' }} />
  //   </Popover>
  // );

  // if (notifications.length === 0) return justContent;
  // else
  //   return (
  //     <Badge
  //       count={notifications.length - 1}
  //       style={{ backgroundColor: 'white', color: 'black' }}
  //     >
  //       {justContent}
  //     </Badge>
  //   );
}
