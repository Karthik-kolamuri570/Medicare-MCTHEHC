const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, 'src', 'screens');

// List of screens to update
const files = [
  'TopDoctorsScreen.js',
  'RegisterScreen.js',
  'ProfileScreen.js',
  'PrescriptionFormScreen.js',
  'PatientHomeScreen.js',
  'NotificationsScreen.js',
  'MyPrescriptionsScreen.js',
  'LoginScreen.js',
  'GetSecondOpinionScreen.js',
  'DSecondOpinionsScreen.js',
  'DoctorProfileScreen.js',
  'DoctorHomeScreen.js',
  'DBlogsScreen.js',
  'DAppointmentsScreen.js',
  'BloodBankScreen.js',
  'BookAppointmentScreen.js'
];

files.forEach(fileName => {
  const filePath = path.join(screensDir, fileName);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Check if SafeAreaView is imported from 'react-native'
  if (content.includes('SafeAreaView') && content.includes("from 'react-native'")) {
    console.log(`Refactoring safe area in: ${fileName}`);

    // Remove SafeAreaView from 'react-native' import statement
    // Match something like: import { ..., SafeAreaView, ... } from 'react-native';
    content = content.replace(/(import\s*\{[^}]*)\bSafeAreaView\b,?\s*([^}]*\}\s*from\s*['"]react-native['"];)/, (match, before, after) => {
      // Clean up any double commas or leading/trailing commas left over
      let cleanedBefore = before.replace(/,\s*,/g, ',').replace(/\{\s*,/g, '{').trim();
      let cleanedAfter = after.replace(/,\s*,/g, ',').replace(/,\s*\}/g, '}').trim();
      
      // Ensure if we cleared all other imports we don't leave empty brackets, but standard files have multiple imports.
      return `${cleanedBefore} ${cleanedAfter}`;
    });

    // Add safe-area-context import right after
    content = "import { SafeAreaView } from 'react-native-safe-area-context';\n" + content;

    fs.writeFileSync(filePath, content, 'utf8');
  }
});

console.log('SafeAreaView refactoring complete!');
