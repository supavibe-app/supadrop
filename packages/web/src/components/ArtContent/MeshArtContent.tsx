import { MetadataFile } from '@oyster/common';
import React from 'react';
import { useCachedImage } from '../../hooks';
import { MeshViewer } from '../MeshViewer';
import { CachedImageContent } from './CachedImageContent';

export const MeshArtContent = ({
  uri,
  animationUrl,
  className,
  style,
  files,
}: {
  uri?: string;
  animationUrl?: string;
  className?: string;
  style?: React.CSSProperties;
  files?: (MetadataFile | string)[];
}) => {
  // const { isLoading } = useCachedImage(uri || '', true);

  // if (isLoading) {
  //   return (
  //     <CachedImageContent
  //       uri={uri}
  //       className={className}
  //       preview={false}
  //       style={{ width: 300, ...style }}
  //     />
  //   );
  // }

  return <MeshViewer url={animationUrl} className={className} style={style} />;
};
