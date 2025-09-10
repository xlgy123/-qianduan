const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('正在尝试修复Vue外部依赖问题并启动项目...');

// 确保vite.config.basic.js存在
if (!fs.existsSync(path.join(__dirname, 'vite.config.basic.js'))) {
  console.log('创建简化配置文件...');
  const basicConfig = `import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

// 使用最基本的配置，避免Vue外部依赖问题
export default defineConfig({
  plugins: [
    uni(),
  ],
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    cors: true,
  }
})`;

  fs.writeFileSync(path.join(__dirname, 'vite.config.basic.js'), basicConfig);
}

// 检查package.json中是否有dev:basic脚本
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

if (!packageJson.scripts['dev:basic']) {
  console.log('添加简化配置启动脚本...');
  packageJson.scripts['dev:basic'] = 'uni --config vite.config.basic.js';
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

// 检查Vue版本
if (packageJson.dependencies.vue !== '3.3.4') {
  console.log('锁定Vue版本为3.3.4...');
  packageJson.dependencies.vue = '3.3.4';
  if (packageJson.devDependencies['@vue/runtime-core']) {
    packageJson.devDependencies['@vue/runtime-core'] = '3.3.4';
  }
  
  // 添加resolutions字段
  if (!packageJson.resolutions) {
    packageJson.resolutions = {};
  }
  packageJson.resolutions.vue = '3.3.4';
  packageJson.resolutions['@vue/runtime-core'] = '3.3.4';
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

try {
  // 尝试使用简化配置启动项目
  console.log('\n使用简化配置启动项目...');
  console.log('如果项目正常启动，可以使用 npm run dev:basic 命令启动项目\n');
  execSync('npm run dev:basic', { stdio: 'inherit' });
} catch (error) {
  console.error('\n使用简化配置启动失败，尝试备选方案...\n');
  
  try {
    // 备选方案：使用3.2.47版本的Vue
    console.log('尝试切换到Vue 3.2.47版本...');
    packageJson.dependencies.vue = '3.2.47';
    if (packageJson.devDependencies['@vue/runtime-core']) {
      packageJson.devDependencies['@vue/runtime-core'] = '3.2.47';
    }
    packageJson.resolutions.vue = '3.2.47';
    packageJson.resolutions['@vue/runtime-core'] = '3.2.47';
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    
    console.log('安装Vue 3.2.47版本...');
    execSync('npm install vue@3.2.47 @vue/runtime-core@3.2.47 --save-exact', { stdio: 'inherit' });
    
    console.log('\n使用新的Vue版本启动项目...');
    execSync('npm run dev:basic', { stdio: 'inherit' });
  } catch (finalError) {
    console.error('\n自动修复失败，请查看 ERROR_FIX_GUIDE.md 手动解决问题\n');
  }
} 