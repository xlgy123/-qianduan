import {
	createSSRApp
} from "vue";
import App from "./App.vue";
// 导入并初始化模拟API服务
import { setupMockApi } from '@/utils/mockApi';

// 全局加载延迟和网络超时设置
const NETWORK_TIMEOUT = 10000; // 10秒网络超时
const isDebug = process.env.NODE_ENV !== 'production';

// 确保只有一个页面实例
let hasInitialized = false;

export function createApp() {
	// 防止重复初始化
	if (hasInitialized && process.env.NODE_ENV === 'production') {
		console.warn('应用已经初始化，避免重复创建');
		return null;
	}
	
	hasInitialized = true;
	
	// 在应用创建前初始化模拟API
	if (!hasInitialized || process.env.NODE_ENV !== 'production') {
		setupMockApi();
		console.log('[App] 模拟API已在应用启动时初始化');
	}
	
	const app = createSSRApp(App);
	
	// 配置全局错误处理
	app.config.errorHandler = (err, instance, info) => {
		console.error('Vue错误:', err, info);
		
		// 特殊处理动态导入失败的错误
		if (err.message && err.message.includes('Failed to fetch dynamically imported module')) {
			console.error('动态导入模块失败:', err.message);
			
			// 如果在浏览器环境，显示网络错误提示
			if (typeof uni !== 'undefined') {
				uni.showToast({
					title: '网络异常，请检查网络连接',
					icon: 'none',
					duration: 2000
				});
			}
		}
	};
	
	// 配置全局性能监控
	app.config.performance = isDebug;
	
	// 配置警告处理
	app.config.warnHandler = isDebug ? console.warn : null;
	
	// 配置网络请求拦截（适用于H5环境）
	if (typeof window !== 'undefined' && typeof XMLHttpRequest !== 'undefined') {
		const originalXHR = window.XMLHttpRequest;
		
		window.XMLHttpRequest = function() {
			const xhr = new originalXHR();
			const originalOpen = xhr.open;
			
			// 添加超时设置
			xhr.timeout = NETWORK_TIMEOUT;
			
			xhr.open = function() {
				originalOpen.apply(this, arguments);
			};
			
			return xhr;
		};
	}
	
	// 配置Fetch API拦截（适用于H5环境）
	if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
		const originalFetch = window.fetch;
		
		window.fetch = function(input, init = {}) {
			// 添加超时控制
			const timeoutController = new AbortController();
			const { signal } = timeoutController;
			
			const timeoutId = setTimeout(() => {
				timeoutController.abort();
			}, NETWORK_TIMEOUT);
			
			return originalFetch(input, {
				...init,
				signal
			}).finally(() => {
				clearTimeout(timeoutId);
			});
		};
	}
	
	// 防止重复打开页面
	if (typeof window !== 'undefined') {
		window.addEventListener('beforeunload', () => {
			hasInitialized = false;
		});
	}
	
	return {
		app,
	};
}
