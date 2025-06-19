
import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const startTime = useRef<number>(performance.now());
  const renderCount = useRef<number>(0);

  useEffect(() => {
    renderCount.current += 1;
    const renderTime = performance.now() - startTime.current;

    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName}:`, {
        renderTime: `${renderTime.toFixed(2)}ms`,
        renderCount: renderCount.current,
        memory: (performance as any).memory ? {
          used: `${((performance as any).memory.usedJSHeapSize / 1048576).toFixed(2)}MB`,
          total: `${((performance as any).memory.totalJSHeapSize / 1048576).toFixed(2)}MB`,
        } : 'Not available'
      });
    }

    // Report slow renders
    if (renderTime > 100) {
      console.warn(`[Performance Warning] ${componentName} took ${renderTime.toFixed(2)}ms to render`);
    }
  });

  const measureAction = (actionName: string, action: () => void | Promise<void>) => {
    const actionStart = performance.now();
    
    const result = action();
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const actionTime = performance.now() - actionStart;
        console.log(`[Performance] ${componentName}.${actionName}: ${actionTime.toFixed(2)}ms`);
      });
    } else {
      const actionTime = performance.now() - actionStart;
      console.log(`[Performance] ${componentName}.${actionName}: ${actionTime.toFixed(2)}ms`);
      return result;
    }
  };

  return { measureAction };
};
