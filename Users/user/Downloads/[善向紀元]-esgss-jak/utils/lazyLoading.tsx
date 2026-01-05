import React, { Suspense, ComponentType, LazyExoticComponent } from 'react';
import { ErrorBoundary, LightweightErrorBoundary } from '../components/ErrorBoundary';
import { Loader2 } from 'lucide-react';

/**
 * 懶加載組件配置選項
 */
interface LazyOptions {
  /** 載入時顯示的 fallback 組件 */
  fallback?: React.ComponentType<any>;
  /** 錯誤時顯示的 fallback 組件 */
  errorFallback?: React.ComponentType<any>;
  /** 載入超時時間 (毫秒) */
  timeout?: number;
  /** 重試次數 */
  retries?: number;
}

/**
 * 預設載入組件
 */
const DefaultLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="flex items-center gap-3">
      <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      <span className="text-slate-600">載入中...</span>
    </div>
  </div>
);

/**
 * 預設錯誤組件
 */
const DefaultErrorFallback: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <div className="text-red-500 mb-2">載入失敗</div>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        重新載入
      </button>
    </div>
  </div>
);

/**
 * 創建懶加載組件的工廠函數
 * @param importFunc 動態 import 函數
 * @param options 配置選項
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LazyOptions = {}
): LazyExoticComponent<T> {
  const {
    fallback: LoadingFallback = DefaultLoadingFallback,
    errorFallback: ErrorFallback = DefaultErrorFallback,
    timeout = 10000,
    retries = 2
  } = options;

  // 創建懶加載組件
  const LazyComponent = React.lazy(() =>
    Promise.race([
      importFunc(),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('載入超時')), timeout);
      })
    ])
  );

  // 添加顯示名稱
  LazyComponent.displayName = `LazyComponent(${importFunc.toString().slice(0, 50)}...)`;

  return LazyComponent;
}

/**
 * 帶錯誤邊界和載入狀態的懶加載包裝器
 */
export const LazyWrapper: React.FC<{
  children: React.ReactNode;
  loadingFallback?: React.ComponentType;
  errorFallback?: React.ComponentType;
  className?: string;
}> = ({
  children,
  loadingFallback: LoadingFallback = DefaultLoadingFallback,
  errorFallback: ErrorFallback = DefaultErrorFallback,
  className = ''
}) => (
  <div className={className}>
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback={<LoadingFallback />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  </div>
);

/**
 * 預定義的懶加載組件
 */
export const LazyComponents = {
  // ESG 核心組件
  ESGConsole: createLazyComponent(() => import('../components/ESGConsole')),
  RealtimeDashboard: createLazyComponent(() => import('../components/RealtimeDashboard')),
  OmniKeyDashboard: createLazyComponent(() => import('../components/OmniKeyDashboard')),

  // 企業服務組件
  EnterpriseServices: createLazyComponent(() => import('../components/EnterpriseServices')),
  FinancialTracking: createLazyComponent(() => import('../components/FinancialTracking')),
  TeamPlanning: createLazyComponent(() => import('../components/TeamPlanning')),
  MarketingStrategy: createLazyComponent(() => import('../components/MarketingStrategy')),

  // 遊戲化組件
  CardGameArena: createLazyComponent(() => import('../components/CardGameArena')),
  HypercubeAiLab: createLazyComponent(() => import('../components/HypercubeAiLab')),
  OmniEsgCell: createLazyComponent(() => import('../components/OmniEsgCell')),

  // 核心服務 (如果需要的話)
  EvolutionEngine: createLazyComponent(() => import('../services/evolutionEngine')),
  DataManager: createLazyComponent(() => import('../services/dataManager')),
  AnalyticsEngine: createLazyComponent(() => import('../services/analytics'))
};

/**
 * 路由級懶加載配置
 * 用於大型應用的路由分割
 * 注意：pages目錄目前不存在，這些組件引用已註釋
 */
export const RouteLazyComponents = {
  // 主應用路由 - 暫時註釋，因為pages目錄不存在
  // Dashboard: createLazyComponent(() => import('../pages/Dashboard')),
  // ESGConsole: createLazyComponent(() => import('../pages/ESGConsole')),
  // RealtimeDashboard: createLazyComponent(() => import('../pages/RealtimeDashboard')),
  // OmniKeyDashboard: createLazyComponent(() => import('../pages/OmniKeyDashboard')),

  // 企業服務路由 - 暫時註釋，因為pages目錄不存在
  // EnterpriseServices: createLazyComponent(() => import('../pages/EnterpriseServices')),
  // FinancialTracking: createLazyComponent(() => import('../pages/FinancialTracking')),

  // 遊戲化路由 - 暫時註釋，因為pages目錄不存在
  // CardGameArena: createLazyComponent(() => import('../pages/CardGameArena')),
  // HypercubeAiLab: createLazyComponent(() => import('../pages/HypercubeAiLab')),

  // 管理路由 - 暫時註釋，因為pages目錄不存在
  // Settings: createLazyComponent(() => import('../pages/Settings')),
  // AdminPanel: createLazyComponent(() => import('../pages/AdminPanel')),
  // UserManagement: createLazyComponent(() => import('../pages/UserManagement'))
};

/**
 * 依條件懶加載的工具函數
 * 根據用戶權限或功能標誌動態決定是否載入
 */
export function conditionalLazyComponent<T extends ComponentType<any>>(
  condition: () => boolean | Promise<boolean>,
  importFunc: () => Promise<{ default: T }>,
  fallbackComponent?: ComponentType
): LazyExoticComponent<T> {
  return createLazyComponent(async () => {
    const shouldLoad = await condition();

    if (shouldLoad) {
      return importFunc();
    }

    // 如果條件不滿足，返回空組件或指定的 fallback
    if (fallbackComponent) {
      return { default: fallbackComponent as T };
    }

    // 返回空的預設組件
    return {
      default: (() => null) as unknown as T
    };
  });
}

/**
 * 批量預載入組件
 * 用於預測用戶可能訪問的頁面
 */
export class ComponentPreloader {
  private preloaded = new Set<string>();

  async preload(componentName: string): Promise<void> {
    if (this.preloaded.has(componentName)) {
      return; // 已預載入
    }

    try {
      const lazyComponent = LazyComponents[componentName as keyof typeof LazyComponents];
      if (lazyComponent) {
        // 手動觸發載入
        await lazyComponent._payload._result;
        this.preloaded.add(componentName);
      }
    } catch (error) {
      console.warn(`預載入組件 ${componentName} 失敗:`, error);
    }
  }

  async preloadBatch(componentNames: string[]): Promise<void> {
    const promises = componentNames.map(name => this.preload(name));
    await Promise.allSettled(promises);
  }

  async preloadBasedOnRoute(currentRoute: string): Promise<void> {
    // 根據當前路由預測可能訪問的組件
    const routePredictions: Record<string, string[]> = {
      '/dashboard': ['ESGConsole', 'RealtimeDashboard'],
      '/esg': ['ESGConsole', 'OmniKeyDashboard'],
      '/enterprise': ['EnterpriseServices', 'FinancialTracking'],
      '/gaming': ['CardGameArena', 'HypercubeAiLab']
    };

    const predictions = routePredictions[currentRoute];
    if (predictions) {
      await this.preloadBatch(predictions);
    }
  }

  isPreloaded(componentName: string): boolean {
    return this.preloaded.has(componentName);
  }

  clearCache(): void {
    this.preloaded.clear();
  }
}

// 導出預載入實例
export const componentPreloader = new ComponentPreloader();

/**
 * 性能監控 Hook
 * 用於追蹤懶加載組件的載入性能
 */
export function useLazyLoadingPerformance() {
  React.useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes('lazy')) {
          console.log(`懶加載性能: ${entry.name}`, {
            loadTime: entry.duration,
            startTime: entry.startTime
          });
        }
      }
    });

    observer.observe({ entryTypes: ['measure'] });

    return () => observer.disconnect();
  }, []);
}

/**
 * 智能載入策略
 * 根據網路狀況和設備性能調整載入策略
 */
export class SmartLoadingStrategy {
  private connectionSpeed: 'slow' | 'fast' = 'fast';
  private deviceCapability: 'low' | 'high' = 'high';

  constructor() {
    this.detectConnectionSpeed();
    this.detectDeviceCapability();
  }

  private detectConnectionSpeed(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        const slowConnections = ['slow-2g', '2g', '3g'];
        this.connectionSpeed = slowConnections.includes(connection.effectiveType)
          ? 'slow' : 'fast';
      }
    }
  }

  private detectDeviceCapability(): void {
    // 簡單的設備性能檢測
    const cores = navigator.hardwareConcurrency || 2;
    const memory = (navigator as any).deviceMemory || 4;

    this.deviceCapability = (cores >= 4 && memory >= 4) ? 'high' : 'low';
  }

  shouldPreload(): boolean {
    return this.connectionSpeed === 'fast' && this.deviceCapability === 'high';
  }

  getBatchSize(): number {
    if (this.connectionSpeed === 'slow' || this.deviceCapability === 'low') {
      return 1; // 一次只載入一個組件
    }
    return 3; // 一次載入多個組件
  }

  getTimeout(): number {
    return this.connectionSpeed === 'slow' ? 20000 : 10000;
  }
}

export const smartLoadingStrategy = new SmartLoadingStrategy();