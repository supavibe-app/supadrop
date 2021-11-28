import { AuctionViewItem } from '@oyster/common';
import { ArtContent } from '../../../components/ArtContent';
import { ImageCard } from './style';

export const AuctionItem = ({
  item,
  active,
}: {
  item: AuctionViewItem;
  active?: boolean;
}) => (
  <ArtContent
    className={ImageCard}
    pubkey={item.metadata.pubkey}
    active={active}
    allowMeshRender={true}
  />
);
