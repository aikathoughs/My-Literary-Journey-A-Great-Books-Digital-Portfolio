// verify_fixes_v2.js
const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('My Literary Journey — Great Books Workspace.html', 'utf8');
const indexHtml = fs.readFileSync('index.html', 'utf8');

console.log('=== VERIFYING REFINEMENTS V2 ===\n');

let allPassed = true;
function check(desc, pass, detail) {
  console.log(`${pass ? '✓ PASS' : '✗ FAIL'}: ${desc}${detail ? ' (' + detail + ')' : ''}`);
  if (!pass) allPassed = false;
}

// 1. Files match
check('Both Workspace.html and index.html exist and match in size', html.length === indexHtml.length, `${html.length} bytes`);

// 2. Solid Backgrounds & Colors
check('Pinned cards have solid #D8C5A3 background', html.includes('background-color:#D8C5A3 !important'));
check('Pinned cards have charcoal #25231F text', html.includes('color:#25231F !important'));
check('Pinned cards have deep burgundy #5A1E28 signature', html.includes('color:#5A1E28 !important'));
check('Learning Cards (.index-card) have solid #D8C5A3 background', html.includes('.index-card{position:relative;background-color:#D8C5A3 !important'));
check('Learning Cards have deep burgundy #5A1E28 headings', html.includes('.ic-card-body h3{font-family:var(--hand);font-size:clamp(1.6rem,2.6vw,2.1rem);color:#5A1E28 !important'));
check('Learning Cards have charcoal #25231F text', html.includes('.ic-card-body p{font-size:14.5px;line-height:1.6;color:#25231F !important'));

// 3. Shared Sizing System for Books & Spread
check('--page-w and --page-h CSS variables defined', html.includes('--page-w: 430px') && html.includes('--page-h: 620px'));
check('.book-shell has explicit height from --page-h', html.includes('height:calc(var(--page-h) + (var(--book-pad-y)*2))'));
check('.spread has explicit grid-template-columns and height', html.includes('grid-template-columns:var(--page-w) var(--page-w)') && html.includes('height:var(--page-h)'));
check('.page has explicit width, height, and no scrollbars', html.includes('width:var(--page-w);height:var(--page-h);max-height:var(--page-h);box-sizing:border-box;overflow:hidden'));
check('.page-foot is anchored to the bottom', html.includes('position:absolute;bottom:10px'));

// 4. Index sizing
check('.idx-item has compact 38px motif column', html.includes('grid-template-columns:38px minmax(0,1fr)'));

// 5. 3D Flipping Animation
check('.flip-sheet 3D transform-style defined', html.includes('.flip-sheet{position:absolute;top:0;width:var(--page-w);height:var(--page-h);transform-style:preserve-3d'));
check('.flip-sheet--next has left-center transform-origin', html.includes('.flip-sheet--next{right:0;transform-origin:left center}'));
check('.flip-sheet--prev has right-center transform-origin', html.includes('.flip-sheet--prev{left:0;transform-origin:right center}'));
check('.flip-face has backface-visibility: hidden', html.includes('backface-visibility:hidden'));
check('flipPage function implemented in JS', html.includes('function flipPage(spreadEl, direction, renderFn, onComplete)'));
check('Rapid click guard (isTurningPage) implemented', html.includes('var isTurningPage = false;') && html.includes('if (isTurningPage) return;'));
check('prefers-reduced-motion respected in flipPage', html.includes("window.matchMedia('(prefers-reduced-motion: reduce)')"));

// 6. Learning Cards refinement
check('Learning Cards have fixed 500px height', html.includes('max-width:760px;height:500px;box-sizing:border-box'));
check('Learning Cards have cardLift animation', html.includes('animation:cardLift .35s'));
check('Dynamic tip text switcher configured', html.includes('&bull; Tip: Choose a category tab above or use Previous and Next Card to explore.'));

// 7. References Landscape Card
check('References Card has solid #D8C5A3 background', html.includes('.references-card{position:relative;background-color:#D8C5A3 !important'));
check('References Card has 3 columns grid', html.includes('grid-template-columns:1.2fr 1fr 1fr'));
check('References Card has charcoal text', html.includes('.ref-compact-list li{font-size:13px;line-height:1.45;color:#25231F !important'));

// 8. Defects & Escaped entities
check('No literal &middot; inside fig-list CSS content', !html.includes('.fig-list li::before{content:"&middot;"'));
check('Bullet character used in fig-list', html.includes('.fig-list li::before{content:"• "'));
check('Stage foot buttons have consistent dimensions', html.includes('.stage-foot-bar .btn{height:36px;min-width:115px'));

// 9. Preserved Features
check('Read in Full button preserved', html.includes('id="readFullTrigger"'));
check('Read in Full overlay preserved', html.includes('id="fullReader"'));
check('Job 38 whirlwind SVG preserved', html.includes('JOB &#183; XXXVIII'));
check('Hero starry plate SVG preserved', html.includes('id="plateTitle"'));
check('All 7 literary works data present', html.includes('The Tale of Genji') && html.includes('Pride and Prejudice') && html.includes('Les Mis&eacute;rables') && html.includes('To Kill a Mockingbird') && html.includes('Voice Out of the Whirlwind') && html.includes('The Iliad') && html.includes('The Odyssey'));

// 10. Validate all embedded script tags for syntax
const scriptRegex = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let sIdx = 1;
while ((match = scriptRegex.exec(html)) !== null) {
  try {
    new vm.Script(match[1]);
    check(`Script #${sIdx} syntax valid`, true);
  } catch (err) {
    check(`Script #${sIdx} syntax valid`, false, err.message);
  }
  sIdx++;
}

console.log('\n================================');
if (allPassed) {
  console.log('🎉 ALL CHECKS PASSED WITH 100% SUCCESS!');
} else {
  console.error('❌ Some checks failed.');
  process.exit(1);
}

