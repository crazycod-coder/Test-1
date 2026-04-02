import { Composition } from 'remotion';
import QuoteComposition from './QuoteComposition';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="QuoteReel"
      component={QuoteComposition}
      durationInFrames={750}  // 25s × 30fps
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill",
      }}
    />
  );
};
