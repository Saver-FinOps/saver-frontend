import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
          color: 'white',
          fontSize: 120,
          fontWeight: 900,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          lineHeight: 1,
          letterSpacing: '-0.04em',
        }}
      >
        S
      </div>
    ),
    size,
  );
}
