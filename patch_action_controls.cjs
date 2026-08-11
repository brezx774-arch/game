const fs = require('fs');
let code = fs.readFileSync('src/components/ActionControls.tsx', 'utf8');

code = code.replace("disabled?: boolean;", "disabled?: boolean;\n  onSendEmoji?: (emoji: string) => void;\n  showEmoji?: boolean;");
code = code.replace("disabled,\n}) => {", "disabled,\n  onSendEmoji,\n  showEmoji,\n}) => {\n  const [isEmojiMenuOpen, setIsEmojiMenuOpen] = React.useState(false);\n  const EMOJIS = ['😂', '😎', '😡', '😭', '🔥', '👎'];\n");

const emojiMenuStr = `
        {/* Emoji Button (only if showEmoji true) */}
        {showEmoji && onSendEmoji && (
          <div className="relative flex flex-col justify-end pb-1">
             <motion.button 
               whileTap={{ scale: 0.9 }}
               onClick={() => setIsEmojiMenuOpen(!isEmojiMenuOpen)}
               className="w-12 h-12 bg-stone-800 rounded-full border-2 border-stone-600 flex items-center justify-center text-xl shadow-lg"
             >
               😎
             </motion.button>
             
             {isEmojiMenuOpen && (
               <div className="absolute bottom-[60px] left-[-20px] bg-stone-900 border-2 border-stone-700 p-2 rounded-2xl flex flex-col gap-2 shadow-2xl z-[100]">
                 {EMOJIS.map(e => (
                   <button 
                     key={e} 
                     onClick={() => {
                        onSendEmoji(e);
                        setIsEmojiMenuOpen(false);
                     }}
                     className="text-2xl hover:scale-125 transition-transform"
                   >
                     {e}
                   </button>
                 ))}
               </div>
             )}
          </div>
        )}
`;

code = code.replace("{/* Tactics Column */}", emojiMenuStr + "\n        {/* Tactics Column */}");
fs.writeFileSync('src/components/ActionControls.tsx', code);
