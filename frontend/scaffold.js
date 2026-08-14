import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = [
  'src/layouts/PublicLayout.jsx',
  'src/layouts/MemberLayout.jsx',
  'src/layouts/GymOwnerLayout.jsx',
  'src/layouts/AdminLayout.jsx',
  'src/pages/public/LandingPage.jsx',
  'src/pages/public/Onboarding.jsx',
  'src/pages/member/MemberHome.jsx',
  'src/pages/member/ExploreGyms.jsx',
  'src/pages/member/GymDetails.jsx',
  'src/pages/member/DigitalPass.jsx',
  'src/pages/member/CheckInFlow.jsx',
  'src/pages/member/Activity.jsx',
  'src/pages/partner/GymOwnerDashboard.jsx',
  'src/pages/admin/AdminDashboard.jsx',
  'src/components/ui/Button.jsx',
  'src/components/ui/Badge.jsx',
  'src/components/ui/Card.jsx',
  'src/components/gym/GymCard.jsx',
  'src/services/mockData.js'
];

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  
  const componentName = path.basename(file, '.jsx').replace('.js', '');
  
  let content = `export default function ${componentName}() {\n  return <div>${componentName}</div>;\n}\n`;
  if (file.endsWith('.js')) {
    content = `export const mockData = {};\n`;
  }
  
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, content);
  }
});

console.log('Scaffolding complete.');
