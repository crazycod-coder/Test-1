import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// ─── Timing constants (frames) ───────────────────────────────────────────────
const WORD_DELAY          = 8;   // frames between each word entrance
const UNDERLINE_DURATION  = 30;  // frames for the golden line slide
const UNDERLINE_START     = 90;
const AUTHOR_START        = 600;
const AUTHOR_FADE_DURATION = 20;
const FADEOUT_START       = 720;
const FADEOUT_DURATION    = 30;  // 720 → 750

// ─── Styles ───────────────────────────────────────────────────────────────────
const QUOTE_COLOR   = '#FFFFFF';
const ACCENT_COLOR  = '#C9A84C';
const BG_COLOR      = '#000000';
const SIDE_MARGIN   = 80;

// ─── Types ───────────────────────────────────────────────────────────────────
interface Props {
  quote: string;
  author: string;
}

// ─── Word component ───────────────────────────────────────────────────────────
interface WordProps {
  word: string;
  startFrame: number;
}

const Word: React.FC<WordProps> = ({ word, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - startFrame);

  const opacity = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const translateY = spring({
    frame: localFrame,
    fps,
    config: { damping: 18, stiffness: 120, mass: 0.6 },
    from: 28,
    to: 0,
  });

  return (
    <span
      style={{
        display: 'inline-block',
        opacity,
        transform: `translateY(${translateY}px)`,
        marginRight: '0.3em',
      }}
    >
      {word}
    </span>
  );
};

// ─── Main composition ─────────────────────────────────────────────────────────
const QuoteComposition: React.FC<Props> = ({ quote, author }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const words = quote.split(' ');

  // Global fade-out [720 – 750]
  const globalOpacity = interpolate(
    frame,
    [FADEOUT_START, FADEOUT_START + FADEOUT_DURATION],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Golden underline: slides from left to right [90 – 120]
  const underlineProgress = interpolate(
    frame,
    [UNDERLINE_START, UNDERLINE_START + UNDERLINE_DURATION],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Author fade-in [600 – 620]
  const authorOpacity = interpolate(
    frame,
    [AUTHOR_START, AUTHOR_START + AUTHOR_FADE_DURATION],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG_COLOR,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: globalOpacity,
      }}
    >
      <div
        style={{
          width: `calc(100% - ${SIDE_MARGIN * 2}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 36,
        }}
      >
        {/* Quote text – word by word */}
        <p
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontWeight: 'bold',
            fontSize: 72,
            color: QUOTE_COLOR,
            textAlign: 'center',
            textTransform: 'uppercase',
            lineHeight: 1.3,
            margin: 0,
            letterSpacing: '0.04em',
          }}
        >
          {words.map((word, i) => (
            <Word key={i} word={word} startFrame={i * WORD_DELAY} />
          ))}
        </p>

        {/* Golden underline */}
        <div
          style={{
            height: 4,
            width: '100%',
            backgroundColor: ACCENT_COLOR,
            transformOrigin: 'left center',
            transform: `scaleX(${underlineProgress})`,
            borderRadius: 2,
          }}
        />

        {/* Author */}
        <p
          style={{
            fontFamily: 'Helvetica Neue, Arial, sans-serif',
            fontStyle: 'italic',
            fontSize: 38,
            color: ACCENT_COLOR,
            textAlign: 'center',
            margin: 0,
            opacity: authorOpacity,
            letterSpacing: '0.06em',
          }}
        >
          — {author}
        </p>
      </div>
    </AbsoluteFill>
  );
};

export default QuoteComposition;
