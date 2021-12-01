import React from 'react';
import { AudioArtContent } from '../../ArtContent/AudioArtContent';
import { CachedImageContent } from '../../ArtContent/CachedImageContent';
import { HTMLContent } from '../../ArtContent/HTMLContent';
import { MeshArtContent } from '../../ArtContent/MeshArtContent';
import { VideoArtContent } from '../../ArtContent/VideoArtContent';

export const DetailArtContent = ({
  category,
  className,
  preview,
  style,
  active,
  originalFile,
  thumbnail,
}: {
  category?: string;
  className?: string;
  preview?: boolean;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  active?: boolean;
  allowMeshRender?: boolean;
  originalFile?: string;
  thumbnail?: string;
}) => {
  const content =
    category === 'vr' ? (
      <MeshArtContent
        uri={thumbnail}
        animationUrl={originalFile}
        className={className}
        style={style}
      />
    ) : category === 'video' ? (
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
        uri={category === 'image' ? originalFile : thumbnail}
        className={className}
        preview={preview}
        style={style}
      />
    );

  return content;
};
