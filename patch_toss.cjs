const fs = require('fs');
let code = fs.readFileSync('src/components/TossScreen.tsx', 'utf8');
code = code.replace("import { socketService } from '../services/socket';", "import { socketService } from '../utils/socket';");
code = code.replace("interface TossScreenProps {", "interface TossScreenProps {\n  roomId?: string;");
code = code.replace("roomId: socketService.socket?.rooms?.[0], // Need to pass room id properly or use generic broadcast", "roomId: roomId,");
code = code.replace("payload: { decision: selectedDecision, firstStrikerId }", "roomId: roomId, payload: { decision: selectedDecision, firstStrikerId }");
code = code.replace("isBotMatch,", "isBotMatch,\n  roomId,");
fs.writeFileSync('src/components/TossScreen.tsx', code);
