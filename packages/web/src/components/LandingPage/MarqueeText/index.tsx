import React from 'react';
import Marquee from "react-fast-marquee";
import { GradientText, MarqueeStyle, MobileMarqueeStyle } from './style';

const MarqueeText = ({ text, refProp }: { text: string; refProp?: React.MutableRefObject<HTMLInputElement> }) => {
  return (
    <div ref={refProp}>
      <Marquee className={MarqueeStyle} gradient={false} speed={150}>
        {Array(24).fill('').map((_, idx) => (
          <div key={idx}>
            <span className={GradientText} style={{ marginRight: 16 }}>//</span>
            <span style={{ marginRight: 16 }}>{text}</span>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export const MobileMarqueeText = ({ text, refProp }: { text: string; refProp?: React.MutableRefObject<HTMLInputElement> }) => {
  return (
    <div ref={refProp}>
      <Marquee className={MobileMarqueeStyle} gradient={false} speed={100}>
        {Array(6).fill('').map((_, idx) => (
          <div key={idx}>
            <span className={GradientText} style={{ marginRight: 16 }}>//</span>
            <span style={{ marginRight: 16 }}>{text}</span>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default MarqueeText;
