import { MetadataFile } from '@oyster/common';
import React from 'react';
import { CachedImageContent } from './CachedImageContent';

export const HTMLContent = ({
  uri,
  animationUrl,
  className,
  preview,
  style,
  files,
  artView,
}: {
  uri?: string;
  animationUrl?: string;
  className?: string;
  preview?: boolean;
  style?: React.CSSProperties;
  files?: (MetadataFile | string)[];
  artView?: boolean;
}) => {
  if (!artView) {
    return (
      <CachedImageContent
        uri={uri}
        className={className}
        preview={preview}
        style={style}
      />
    );
  }
  const htmlURL =
    files && files.length > 0 && typeof files[0] === 'string'
      ? files[0]
      : animationUrl;
  return (
    <iframe
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      sandbox="allow-scripts"
      frameBorder="0"
      src={htmlURL}
      className={className}
      style={style}
    ></iframe>
  );
};
