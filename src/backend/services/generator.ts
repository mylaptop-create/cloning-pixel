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
<html lang="en" class="light">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cloned Wise Application</title>
  </head>
  <body class="bg-[var(--colors-canvas)] text-[var(--colors-ink)] transition-colors duration-200">
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
  darkMode: 'class',
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

    // 4. Write CSS with Light and Dark Mode CSS Variables
    const cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --colors-primary: #163300;
  --colors-accent: #9FE870;
  --colors-ink: #0E0F0C;
  --colors-body: #454745;
  --colors-canvas: #FFFFFF;
  --colors-surface: #FFFFFF;
  --colors-surface-alt: #F1F1ED;
  --colors-surface-tint: #E2F6D5;
  --colors-border: rgba(14, 15, 12, 0.12157);
  --colors-on-primary: #FFFFFF;
  --colors-on-accent: #163300;
}

.dark {
  --colors-primary: #9FE870;
  --colors-accent: #9FE870;
  --colors-ink: #EDEDED;
  --colors-body: #B0B3B0;
  --colors-canvas: #0E0F0C;
  --colors-surface: #161815;
  --colors-surface-alt: #21231D;
  --colors-surface-tint: #163300;
  --colors-border: rgba(255, 255, 255, 0.15);
  --colors-on-primary: #0E0F0C;
  --colors-on-accent: #163300;
}

body {
  margin: 0;
  font-family: "Inter", Helvetica, Arial, sans-serif;
  background-color: var(--colors-canvas);
  color: var(--colors-ink);
}
`;
    fs.writeFileSync(path.join(srcDir, 'index.css'), cssContent);

    // 5. Build Header component with Theme Switcher (Light / Dark Mode toggle)
    const headerCode = customComponents?.Header || `import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';

export const Header: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <header className="w-full bg-[var(--colors-surface)] border-b border-[var(--colors-border)] sticky top-0 z-50 px-6 py-4 flex items-center justify-between transition-colors">
      <div className="flex items-center space-x-8">
        <Link to="/" className="text-2xl font-black tracking-tight text-[var(--colors-ink)] flex items-center space-x-2">
          <span className="w-8 h-8 bg-[#9FE870] rounded-full inline-block"></span>
          <span className="font-bold tracking-tight">Wise</span>
        </Link>
        <nav className="hidden md:flex space-x-6 text-sm font-bold text-[var(--colors-body)]">
          <Link to="/" className="hover:text-[var(--colors-ink)] transition">Personal</Link>
          <Link to="/business" className="hover:text-[var(--colors-ink)] transition">Business</Link>
          <Link to="/pricing" className="hover:text-[var(--colors-ink)] transition">Pricing</Link>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-full bg-[var(--colors-surface-alt)] text-[var(--colors-ink)] hover:opacity-80 transition flex items-center justify-center"
          title="Toggle Light/Dark Mode"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="bg-[#163300] dark:bg-[#9FE870] text-white dark:text-[#163300] font-bold px-6 py-2.5 rounded-full hover:opacity-90 transition text-sm">
          Register
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
    <footer className="w-full bg-[#163300] text-[#9FE870] py-12 px-6 mt-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="text-2xl font-black mb-4 text-white">Wise</div>
          <p className="text-sm opacity-80">Money without borders. Transparent, fast, and low cost.</p>
        </div>
        <div>
          <div className="font-bold mb-3 text-sm text-white">Product</div>
          <ul className="space-y-2 text-sm opacity-80">
            <li>International Money Transfer</li>
            <li>Multi-Currency Account</li>
            <li>Wise Business</li>
          </ul>
        </div>
        <div>
          <div className="font-bold mb-3 text-sm text-white">Company</div>
          <ul className="space-y-2 text-sm opacity-80">
            <li>About Us</li>
            <li>Careers</li>
            <li>Press</li>
          </ul>
        </div>
        <div>
          <div className="font-bold mb-3 text-sm text-white">Legal</div>
          <ul className="space-y-2 text-sm opacity-80">
            <li>Privacy Policy</li>
            <li>Terms of Use</li>
          </ul>
        </div>
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
        <span className="inline-block px-3.5 py-1 bg-[#E2F6D5] dark:bg-[#163300] text-[#163300] dark:text-[#9FE870] rounded-full text-xs font-bold">
          Transparent Money Product System
        </span>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-[var(--colors-ink)] leading-none">
          Money for here, there and everywhere
        </h1>
        <p className="text-lg text-[var(--colors-body)] max-w-lg">
          Save up to 2x when you send, spend, and receive money internationally.
        </p>
        <div className="flex items-center space-x-4 pt-2">
          <button className="bg-[#9FE870] text-[#163300] font-bold px-8 py-3.5 rounded-full hover:bg-[#80E142] transition text-base">
            Open an account
          </button>
        </div>
      </div>
      <div className="flex-1 w-full max-w-md bg-[var(--colors-surface)] border border-[var(--colors-border)] rounded-2xl p-6 shadow-xl">
        <h2 className="text-lg font-bold mb-4 text-[var(--colors-ink)]">Currency Calculator</h2>
        <div className="space-y-4">
          <div className="p-4 bg-[var(--colors-surface-alt)] rounded-xl border border-[var(--colors-border)]">
            <label className="text-xs text-[var(--colors-body)] block mb-1 font-semibold">You send exactly</label>
            <div className="flex justify-between items-center">
              <input type="number" defaultValue="1000" className="bg-transparent font-bold text-2xl outline-none w-full text-[var(--colors-ink)]" />
              <span className="font-bold text-[var(--colors-ink)] bg-[var(--colors-surface)] px-3 py-1 rounded-full border border-[var(--colors-border)] text-sm">USD</span>
            </div>
          </div>
          <div className="p-4 bg-[var(--colors-surface-alt)] rounded-xl border border-[var(--colors-border)]">
            <label className="text-xs text-[var(--colors-body)] block mb-1 font-semibold">Recipient gets</label>
            <div className="flex justify-between items-center">
              <input type="number" defaultValue="920.50" className="bg-transparent font-bold text-2xl outline-none w-full text-[var(--colors-ink)]" readOnly />
              <span className="font-bold text-[var(--colors-ink)] bg-[var(--colors-surface)] px-3 py-1 rounded-full border border-[var(--colors-border)] text-sm">EUR</span>
            </div>
          </div>
          <button className="w-full bg-[#163300] dark:bg-[#9FE870] text-white dark:text-[#163300] font-bold py-3.5 rounded-full hover:opacity-90 transition">
            Get started
          </button>
        </div>
      </div>
    </section>
  );
};
`;
    fs.writeFileSync(path.join(componentsDir, 'Hero.tsx'), heroCode);

    // 6. Build App.tsx with Routing
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
    <div className="min-h-screen flex flex-col bg-[var(--colors-canvas)] text-[var(--colors-ink)] transition-colors">
      <Header />
      <main className="flex-1">
        ${idx === 0 ? '<Hero />' : `
        <div className="max-w-5xl mx-auto py-16 px-6">
          <h1 className="text-4xl font-bold mb-4">${route.title || route.path}</h1>
          <p className="text-[var(--colors-body)]">Reconstructed Wise route component for: ${route.path}</p>
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
