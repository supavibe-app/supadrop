import React, { Ref } from 'react';
import {
  MetadataCategory,
  MetadataFile,
  pubkeyToString,
  useMeta,
} from '@oyster/common';
import { MeshViewer } from '../MeshViewer';
import { useCachedImage, useExtendedArt } from '../../hooks';
import { PublicKey } from '@solana/web3.js';
import { getLast } from '../../utils/utils';
import { VideoArtContent } from './VideoArtContent';
import { CachedImageContent } from './CachedImageContent';
import { HTMLContent } from './HTMLContent';
import { MeshArtContent } from './MeshArtContent';
import { AudioArtContent } from './AudioArtContent';

export const ArtContent = ({
  category,
  className,
  preview,
  style,
  active,
  allowMeshRender,
  pubkey,
  uri,
  animationURL,
  files,
  artView,
}: {
  category?: MetadataCategory;
  className?: string;
  preview?: boolean;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  ref?: Ref<HTMLDivElement>;
  active?: boolean;
  allowMeshRender?: boolean;
  pubkey?: PublicKey | string;
  uri?: string;
  animationURL?: string;
  files?: (MetadataFile | string)[];
  artView?: boolean;
}) => {
  const id = pubkeyToString(pubkey);
  const { allDataAuctions } = useMeta();

  const { ref, data } = useExtendedArt(id);

  if (pubkey && data) {
    uri = data.image;
    animationURL = data.animation_url;
  } else if (!uri) {
    uri = allDataAuctions[id]?.original_file;
  }

  if (pubkey && data?.properties) {
    files = data.properties.files;
    category = data.properties.category;
  }

  animationURL = animationURL || '';

  const animationUrlExt = new URLSearchParams(
    getLast(animationURL.split('?')),
  ).get('ext');

  if (
    allowMeshRender &&
    (category === 'vr' ||
      animationUrlExt === 'glb' ||
      animationUrlExt === 'gltf')
  ) {
    return (
      <MeshArtContent
        uri={uri}
        animationUrl={animationURL}
        className={className}
        style={style}
        files={files}
      />
    );
  }

  const content =
    category === 'video' ? (
      <VideoArtContent
        className={className}
        style={style}
        files={files}
        uri={uri}
        animationURL={animationURL}
        active={active}
      />
    ) : category === 'html' || animationUrlExt === 'html' ? (
      <HTMLContent
        uri={uri}
        animationUrl={animationURL}
        className={className}
        preview={preview}
        style={style}
        files={files}
        artView={artView}
      />
    ) : category === 'audio' ? (
      <AudioArtContent
        uri={uri}
        className={className}
        animationURL={animationURL}
        style={style}
      />
    ) : (
      <CachedImageContent
        uri={uri}
        className={className}
        preview={preview}
        style={style}
      />
    );

  return (
    <div
      key={id}
      ref={ref as any}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {content}
    </div>
  );
};

export const ArtContent2 = ({
  category,
  className,
  preview,
  style,
  active,
  allowMeshRender,
  pubkey,

  originalFile,
  thumbnail,
  files,
}: {
  category?: string;
  className?: string;
  preview?: boolean;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  ref?: Ref<HTMLDivElement>;
  active?: boolean;
  allowMeshRender?: boolean;
  pubkey?: PublicKey | string;
  originalFile?: string;
  thumbnail?: string;
  files?: (MetadataFile | string)[];
}) => {
  const id = pubkeyToString(pubkey);

  const { ref } = useExtendedArt(id);

  if (category === 'vr') {
    return (
      <MeshArtContent
        uri={thumbnail}
        animationUrl={originalFile}
        className={className}
        style={style}
      />
    );
  }

  const content =
    category === 'video' ? (
      <VideoArtContent
        className={className}
        style={style}
        uri={thumbnail}
        animationURL={originalFile}
        active={active}
      />
    ) : category === 'html' ? (
      <HTMLContent
        uri={thumbnail}
        animationUrl={originalFile}
        className={className}
        preview={preview}
        style={style}
      />
    ) : category === 'audio' ? (
      <AudioArtContent
        uri={thumbnail}
        className={className}
        animationURL={originalFile}
        style={style}
      />
    ) : (
      <CachedImageContent
        uri={thumbnail}
        className={className}
        preview={preview}
        style={style}
      />
    );

  return (
    <div
      ref={ref as any}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {content}
    </div>
  );
};
