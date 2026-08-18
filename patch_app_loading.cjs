const fs = require('fs');
const path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

// Add import
const importLoc = code.indexOf('import { LoginScreen }');
if (importLoc !== -1) {
  code = code.slice(0, importLoc) + "import { LoadingScreen } from './screens/LoadingScreen';\n" + code.slice(importLoc);
} else {
  code = "import { LoadingScreen } from './screens/LoadingScreen';\n" + code;
}

// Add state for booting
const stateLoc = code.indexOf('const [authLoading, setAuthLoading] = useState(true);');
if (stateLoc !== -1) {
  code = code.slice(0, stateLoc) + "const [isBooting, setIsBooting] = useState(true);\n  " + code.slice(stateLoc);
}

// Replace the old loading block
const oldLoadingBlock = `  if (authLoading || (user && profileLoading)) {
    return (
      <div className="min-h-dvh bg-stone-950 flex flex-col items-center justify-center relative overflow-hidden text-stone-100">
        <AnimatedBackground variant="STADIUM" inGame={false} />
        <div className="z-10 flex flex-col items-center animate-pulse">
           <div className="w-16 h-16 bg-emerald-500/20 backdrop-blur-md border border-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)] mb-6">
              <svg className="w-8 h-8 text-emerald-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
           </div>
           <h2 className="text-2xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-stone-100 to-stone-400">LOADING...</h2>
        </div>
      </div>
    );
  }`;

const newLoadingBlock = `  if (isBooting) {
    return (
      <LoadingScreen 
        authLoading={authLoading} 
        profileLoading={user ? profileLoading : false} 
        onReady={() => setIsBooting(false)} 
      />
    );
  }`;

code = code.replace(oldLoadingBlock, newLoadingBlock);

fs.writeFileSync(path, code);
console.log('App patched with LoadingScreen');
