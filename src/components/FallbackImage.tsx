import React, { useState, useEffect, useRef } from 'react';
import { Flame, UtensilsCrossed } from 'lucide-react';

export type FallbackVariant = 'food' | 'hero' | 'gallery';

export interface FallbackImageProps {
  src: string;
  alt: string;
  variant?: FallbackVariant;
  className?: string;
  containerClassName?: string;
  aspectRatioClass?: string;
  eager?: boolean;
  sizes?: string;
  srcSet?: string;
  decorative?: boolean;
  forceFallback?: boolean;
  onClick?: () => void;
}

/**
 * In-memory registry of image URLs that have failed to load during this session.
 * Prevents repeated broken network requests and console errors.
 */
const failedUrlCache = new Set<string>();

/**
 * Reusable resilient `<FallbackImage />` component with Dera Sajji red-and-white brand fallback.
 * - Never shows a broken-image icon or empty image box.
 * - Preserves original image dimensions/aspect ratio.
 * - Displays:
 *   DERA SAJJI
 *   Authentic Sajji. Bold Pakistani Flavor.
 */
export const FallbackImage: React.FC<FallbackImageProps> = ({
  src,
  alt,
  variant = 'food',
  className = '',
  containerClassName = '',
  aspectRatioClass = '',
  eager = false,
  sizes,
  srcSet,
  decorative = false,
  forceFallback = false,
  onClick,
}) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(() => {
    if (forceFallback || !src || src.trim() === '' || failedUrlCache.has(src)) {
      return 'error';
    }
    return 'loading';
  });

  const errorHandledRef = useRef(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const computedSizes =
    sizes ||
    (variant === 'hero'
      ? '100vw'
      : variant === 'gallery'
        ? '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw'
        : '(max-width: 768px) 100vw, 50vw');

  const computedSrcSet = srcSet || (src ? `${src} 1x, ${src} 2x` : undefined);

  useEffect(() => {
    errorHandledRef.current = false;

    if (forceFallback || !src || src.trim() === '' || failedUrlCache.has(src)) {
      setStatus('error');
      return;
    }

    setStatus('loading');

    const imgEl = imgRef.current;
    if (imgEl && imgEl.complete) {
      if (imgEl.naturalWidth > 0) {
        setStatus('loaded');
      } else {
        failedUrlCache.add(src);
        setStatus('error');
      }
    }
  }, [src, forceFallback]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    if (target.naturalWidth === 0) {
      handleError();
      return;
    }
    setStatus('loaded');
  };

  const handleError = () => {
    if (errorHandledRef.current) return;
    errorHandledRef.current = true;
    if (src) {
      failedUrlCache.add(src);
    }
    setStatus('error');
  };

  const effectiveStatus = forceFallback ? 'error' : status;
  const accessibleLabel =
    decorative ? undefined : alt || 'Dera Sajji — Authentic Sajji. Bold Pakistani Flavor.';

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden select-none bg-[#650D0D] ${aspectRatioClass} ${containerClassName}`}
    >
      {/* Lightweight Shimmer Placeholder While Loading */}
      {effectiveStatus === 'loading' && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#650D0D] via-[#7A1111] to-[#420707]"
        >
          <div className="absolute inset-0 bg-[#9E1717]/15 backdrop-blur-xl animate-pulse" />
          <div className="relative z-10 flex flex-col items-center gap-2.5 opacity-60">
            <div className="w-10 h-10 rounded-xl bg-[#9E1717]/60 border border-white/15 flex items-center justify-center">
              <Flame className="w-5 h-5 text-white animate-pulse" />
            </div>
            <span className="font-serif-display text-xs font-semibold tracking-[0.24em] text-white uppercase">
              DERA SAJJI
            </span>
          </div>
        </div>
      )}

      {/* Branded Dera Sajji Red-and-White Fallback State */}
      {effectiveStatus === 'error' && (
        <div
          role={decorative ? 'presentation' : 'img'}
          aria-hidden={decorative ? true : undefined}
          aria-label={accessibleLabel}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#650D0D] via-[#7C1212] to-[#3B0606] text-white overflow-hidden"
        >
          {/* Subtle Decorative Pakistani Heritage Frame */}
          <div
            aria-hidden="true"
            className="absolute inset-3.5 border border-white/15 rounded-xl pointer-events-none"
          />

          <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center gap-3 px-4">
            <div className="w-12 h-12 rounded-xl bg-[#9E1717] border border-white/25 flex items-center justify-center shadow-lg">
              {variant === 'food' ? (
                <UtensilsCrossed className="w-5 h-5 text-white" />
              ) : (
                <Flame className="w-6 h-6 text-white" />
              )}
            </div>

            <span className="font-serif-display text-xl sm:text-3xl font-bold tracking-[0.2em] uppercase text-white">
              DERA SAJJI
            </span>

            <div className="w-12 h-[1px] bg-white/35" aria-hidden="true" />

            <p className="font-editorial italic text-base sm:text-xl text-[#FAF7F5] tracking-wide">
              Authentic Sajji. Bold Pakistani Flavor.
            </p>
          </div>
        </div>
      )}

      {/* Photographic Image Element */}
      {effectiveStatus !== 'error' && (
        <img
          ref={imgRef}
          src={src}
          srcSet={computedSrcSet}
          sizes={computedSizes}
          alt={decorative ? '' : alt}
          role={decorative ? 'presentation' : undefined}
          loading={eager ? 'eager' : 'lazy'}
          decoding={eager ? 'sync' : 'async'}
          fetchPriority={eager ? 'high' : 'auto'}
          referrerPolicy="no-referrer"
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
            effectiveStatus === 'loaded'
              ? 'opacity-100 scale-100 blur-0'
              : 'opacity-0 scale-105 blur-md'
          } ${className}`}
        />
      )}
    </div>
  );
};

export default FallbackImage;
