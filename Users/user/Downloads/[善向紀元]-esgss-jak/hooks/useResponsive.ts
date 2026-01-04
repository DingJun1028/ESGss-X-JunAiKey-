// 響應式設計hooks
import { useState, useEffect, useCallback } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ViewportSize {
  width: number;
  height: number;
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  orientation: 'portrait' | 'landscape';
}

const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const useResponsive = () => {
  const [viewport, setViewport] = useState<ViewportSize>(() => {
    if (typeof window === 'undefined') {
      return {
        width: 1024,
        height: 768,
        breakpoint: 'lg',
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isLargeDesktop: false,
        orientation: 'landscape',
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    let breakpoint: Breakpoint = 'xs';
    if (width >= breakpoints['2xl']) breakpoint = '2xl';
    else if (width >= breakpoints.xl) breakpoint = 'xl';
    else if (width >= breakpoints.lg) breakpoint = 'lg';
    else if (width >= breakpoints.md) breakpoint = 'md';
    else if (width >= breakpoints.sm) breakpoint = 'sm';

    return {
      width,
      height,
      breakpoint,
      isMobile: width < breakpoints.md,
      isTablet: width >= breakpoints.md && width < breakpoints.lg,
      isDesktop: width >= breakpoints.lg,
      isLargeDesktop: width >= breakpoints.xl,
      orientation: height > width ? 'portrait' : 'landscape',
    };
  });

  const updateViewport = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    let breakpoint: Breakpoint = 'xs';
    if (width >= breakpoints['2xl']) breakpoint = '2xl';
    else if (width >= breakpoints.xl) breakpoint = 'xl';
    else if (width >= breakpoints.lg) breakpoint = 'lg';
    else if (width >= breakpoints.md) breakpoint = 'md';
    else if (width >= breakpoints.sm) breakpoint = 'sm';

    setViewport({
      width,
      height,
      breakpoint,
      isMobile: width < breakpoints.md,
      isTablet: width >= breakpoints.md && width < breakpoints.lg,
      isDesktop: width >= breakpoints.lg,
      isLargeDesktop: width >= breakpoints.xl,
      orientation: height > width ? 'portrait' : 'landscape',
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, [updateViewport]);

  return viewport;
};

// 自適應佈局hook
export const useAdaptiveLayout = () => {
  const { breakpoint, isMobile, isTablet, isDesktop } = useResponsive();

  const getGridColumns = useCallback((defaultCols: number = 3) => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return defaultCols;
  }, [isMobile, isTablet]);

  const getContainerWidth = useCallback(() => {
    if (isMobile) return '100%';
    if (isTablet) return '90%';
    return '1200px';
  }, [isMobile, isTablet]);

  const getFontSize = useCallback((baseSize: number = 16) => {
    if (isMobile) return Math.max(baseSize * 0.9, 14);
    if (isTablet) return baseSize * 0.95;
    return baseSize;
  }, [isMobile, isTablet]);

  const getSpacing = useCallback((baseSpacing: number = 16) => {
    if (isMobile) return Math.max(baseSpacing * 0.8, 8);
    if (isTablet) return baseSpacing * 0.9;
    return baseSpacing;
  }, [isMobile, isTablet]);

  return {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    getGridColumns,
    getContainerWidth,
    getFontSize,
    getSpacing,
  };
};

// 觸摸友好的互動hook
export const useTouchFriendly = () => {
  const { isMobile, isTablet } = useResponsive();
  const isTouchDevice = isMobile || isTablet;

  const getTouchTargetSize = useCallback((minimumSize: number = 44) => {
    return isTouchDevice ? Math.max(minimumSize, 44) : minimumSize;
  }, [isTouchDevice]);

  const getSwipeThreshold = useCallback(() => {
    return isTouchDevice ? 50 : 30;
  }, [isTouchDevice]);

  const supportsHover = useCallback(() => {
    return !isTouchDevice && window.matchMedia('(hover: hover)').matches;
  }, [isTouchDevice]);

  return {
    isTouchDevice,
    getTouchTargetSize,
    getSwipeThreshold,
    supportsHover,
  };
};

// 載入狀態hook
export const useLoadingStates = () => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: loading }));
  }, []);

  const isLoading = useCallback((key: string) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const getLoadingCount = useCallback(() => {
    return Object.values(loadingStates).filter(Boolean).length;
  }, [loadingStates]);

  const clearAllLoading = useCallback(() => {
    setLoadingStates({});
  }, []);

  return {
    setLoading,
    isLoading,
    getLoadingCount,
    clearAllLoading,
  };
};

// 動畫偏好hook
export const useAnimationPreferences = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const shouldAnimate = useCallback((animationType?: 'micro' | 'macro' | 'entrance') => {
    if (prefersReducedMotion) return false;

    // 對於微動畫，即使在減少動畫偏好下也可以允許
    if (animationType === 'micro') return true;

    return !prefersReducedMotion;
  }, [prefersReducedMotion]);

  const getAnimationDuration = useCallback((baseDuration: number = 300) => {
    return prefersReducedMotion ? 0 : baseDuration;
  }, [prefersReducedMotion]);

  return {
    prefersReducedMotion,
    shouldAnimate,
    getAnimationDuration,
  };
};