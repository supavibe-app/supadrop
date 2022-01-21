import { Stream, StreamPlayerApi } from '@cloudflare/stream-react';
import { MetadataFile } from '@oyster/common';
import React, { useCallback, useEffect, useState } from 'react';
import { CachedImageContent } from './CachedImageContent';

export const AudioArtContent = ({
  className,
  style,
  uri,
  animationURL,
}: {
  className?: string;
  style?: React.CSSProperties;
  uri?: string;
  animationURL?: string;
  active?: boolean;
}) => {
  const content = (
    <div>
      <CachedImageContent uri={uri} className={className} />
      <audio
        playsInline={true}
        autoPlay={false}
        controls={true}
        controlsList="nodownload"
        loop={true}
      >
        <source src={animationURL} type="audio/mp3" />
      </audio>
    </div>
  );
  return content;
};
