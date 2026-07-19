const { execSync } = require('child_process');
try {
  const output = execSync('git checkout -- src/components/ExamEngine.tsx', { encoding: 'utf-8' });
  console.log('REVERT_SUCCESS:', output);
} catch (error) {
  console.error('REVERT_FAIL:', error.message);
}
