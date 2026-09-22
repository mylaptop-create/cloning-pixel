import fs from 'fs';
import path from 'path';
import { RouteNode, DesignTokens } from '../../shared/types.js';

export class CodeGeneratorService {
  static generateProjectCode(
    workspaceDir: string,
    routes: RouteNode[],
    tokens: DesignTokens,
    customComponents?: Record<string, string>
  ): string {
    const projectDir = path.join(workspaceDir, 'project');
    const srcDir = path.join(projectDir, 'src');
    const pagesDir = path.join(srcDir, 'pages');
    const componentsDir = path.join(srcDir, 'components');

    fs.mkdirSync(pagesDir, { recursive: true });
    fs.mkdirSync(componentsDir, { recursive: true });

    // 1. Write package.json for generated React clone
    const packageJson = {
      name: 'pixelforge-generated-clone',
      private: true,
      version: '1.0.0',
      type: 'module',
      scripts: {
        dev: 'vite --port 5173',
        build: 'tsc && vite build',
        preview: 'vite preview',
      },
      dependencies: {
        react: '^19.0.0',
        'react-dom': '^19.0.0',
        'react-router-dom': '^7.1.5',
        'lucide-react': '^0.475.0',
      },
      devDependencies: {
        '@types/react': '^19.0.10',
        '@types/react-dom': '^19.0.4',
        '@vitejs/plugin-react': '^4.3.4',
        autoprefixer: '^10.4.20',
        postcss: '^8.5.2',
        tailwindcss: '^3.4.17',
        typescript: '^5.7.3',
        vite: '^6.1.0',
      },
    };

    fs.writeFileSync(path.join(projectDir, 'package.json'), JSON.stringify(packageJson, null, 2));

    // 2. Write index.html
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cloned Application</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
    fs.writeFileSync(path.join(projectDir, 'index.html'), indexHtml);

    // 3. Write vite.config.ts & tailwind.config.js
    const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
});`;
    fs.writeFileSync(path.join(projectDir, 'vite.config.ts'), viteConfig);

    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: ${JSON.stringify(tokens.colors || {})},
      borderRadius: ${JSON.stringify(tokens.radius || {})},
      spacing: ${JSON.stringify(tokens.spacing || {})}
    },
  },
  plugins: [],
};`;
    fs.writeFileSync(path.join(projectDir, 'tailwind.config.js'), tailwindConfig);

    // 4. Write CSS with CSS Variables
    const cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --colors-primary: ${tokens.colors?.primary || '#9fe870'};
  --colors-canvas: ${tokens.colors?.canvas || '#ffffff'};
  --colors-ink: ${tokens.colors?.ink || '#0e0f0c'};
  --colors-body: ${tokens.colors?.body || '#454745'};
}

body {
  margin: 0;
  font-family: ${tokens.typography?.primaryFont || 'system-ui, sans-serif'};
  background-color: var(--colors-canvas);
  color: var(--colors-ink);
}
`;
    fs.writeFileSync(path.join(srcDir, 'index.css'), cssContent);

    // 5. Build Header, Hero, Footer, and Navigation components
    const headerCode = customComponents?.Header || `import React from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-8">
        <Link to="/" className="text-2xl font-black tracking-tight text-gray-900 flex items-center space-x-2">
          <span className="w-8 h-8 bg-[#9fe870] rounded-full inline-block"></span>
          <span>Brand</span>
        </Link>
        <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-black transition">Home</Link>
          <Link to="/about" className="hover:text-black transition">About</Link>
          <Link to="/pricing" className="hover:text-black transition">Pricing</Link>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <button className="bg-[#9fe870] text-[#0e0f0c] font-semibold px-5 py-2.5 rounded-full hover:bg-[#cdffad] transition text-sm">
          Get Started
        </button>
      </div>
    </header>
  );
};
`;
    fs.writeFileSync(path.join(componentsDir, 'Header.tsx'), headerCode);

    const footerCode = customComponents?.Footer || `import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0e0f0c] text-white py-12 px-6 mt-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="text-xl font-bold mb-4">Brand</div>
          <p className="text-gray-400 text-sm">Autonomous Pixel-Perfect Reconstructed Application.</p>
        </div>
        <div>
          <div className="font-semibold mb-3 text-sm text-gray-300">Product</div>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Features</li>
            <li>Pricing</li>
            <li>Security</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3 text-sm text-gray-300">Company</div>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>About Us</li>
            <li>Careers</li>
            <li>Blog</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3 text-sm text-gray-300">Legal</div>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto border-t border-gray-800 mt-12 pt-6 text-xs text-gray-500 text-center">
        © ${new Date().getFullYear()} Reconstructed Clone. All rights reserved.
      </div>
    </footer>
  );
};
`;
    fs.writeFileSync(path.join(componentsDir, 'Footer.tsx'), footerCode);

    const heroCode = customComponents?.Hero || `import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="w-full py-20 px-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
      <div className="flex-1 space-y-6">
        <span className="inline-block px-3 py-1 bg-[#e2f6d5] text-[#163300] rounded-full text-xs font-semibold">
          Autonomous Generation v1.0
        </span>
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
          Money without borders
        </h1>
        <p className="text-lg text-gray-600 max-w-lg">
          Save up to 2x when you send, spend, and receive money internationally.
        </p>
        <div className="flex items-center space-x-4 pt-2">
          <button className="bg-[#9fe870] text-[#0e0f0c] font-bold px-8 py-3.5 rounded-full hover:bg-[#cdffad] transition text-base">
            Open an account
          </button>
        </div>
      </div>
      <div className="flex-1 w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 shadow-xl">
        <h2 className="text-lg font-bold mb-4 text-gray-900">Currency Converter</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <label className="text-xs text-gray-500 block mb-1">You send exactly</label>
            <div className="flex justify-between items-center">
              <input type="number" defaultValue="1000" className="bg-transparent font-bold text-xl outline-none w-full" />
              <span className="font-bold text-gray-700">USD</span>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <label className="text-xs text-gray-500 block mb-1">Recipient gets</label>
            <div className="flex justify-between items-center">
              <input type="number" defaultValue="920.50" className="bg-transparent font-bold text-xl outline-none w-full" readOnly />
              <span className="font-bold text-gray-700">EUR</span>
            </div>
          </div>
          <button className="w-full bg-[#0e0f0c] text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition">
            Get started
          </button>
        </div>
      </div>
    </section>
  );
};
`;
    fs.writeFileSync(path.join(componentsDir, 'Hero.tsx'), heroCode);

    // 6. Build App.tsx with Routing for all crawled routes
    const routeImports: string[] = [];
    const routeElements: string[] = [];

    const effectiveRoutes = routes.length > 0 ? routes : [{ path: '/', title: 'Home' } as any];

    effectiveRoutes.forEach((route, idx) => {
      const componentName = idx === 0 ? 'HomePage' : `PageRoute_${idx}`;

      const pageCode = `import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Hero } from '../components/Hero';

export const ${componentName}: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        ${idx === 0 ? '<Hero />' : `
        <div className="max-w-5xl mx-auto py-16 px-6">
          <h1 className="text-4xl font-bold mb-4">${route.title || route.path}</h1>
          <p className="text-gray-600">Reconstructed route component for: ${route.path}</p>
        </div>
        `}
      </main>
      <Footer />
    </div>
  );
};
`;

      fs.writeFileSync(path.join(pagesDir, `${componentName}.tsx`), pageCode);

      routeImports.push(`import { ${componentName} } from './pages/${componentName}';`);
      routeElements.push(`<Route path="${route.path}" element={<${componentName} />} />`);
    });

    const appJsx = `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
${routeImports.join('\n')}

export function App() {
  return (
    <Router>
      <Routes>
        ${routeElements.join('\n        ')}
      </Routes>
    </Router>
  );
}
export default App;
`;
    fs.writeFileSync(path.join(srcDir, 'App.tsx'), appJsx);

    const mainJsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
    fs.writeFileSync(path.join(srcDir, 'main.tsx'), mainJsx);

    return projectDir;
  }
}
