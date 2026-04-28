import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
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
          fontSize: 22,
          fontWeight: 900,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          lineHeight: 1,
          borderRadius: 6,
        }}
      >
        S
      </div>
    ),
    size,
  );
}
