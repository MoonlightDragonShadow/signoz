const fs = require('node:fs');
const path = require('node:path');

const localeRoot = path.join(__dirname, '../public/locales');
const englishRoot = path.join(localeRoot, 'en');
const chineseRoot = path.join(localeRoot, 'zh-CN');

function leafEntries(value, prefix = '') {
	return Object.entries(value).flatMap(([key, entry]) => {
		const name = prefix ? `${prefix}.${key}` : key;
		return entry && typeof entry === 'object'
			? leafEntries(entry, name)
			: [[name, entry]];
	});
}

function placeholders(text) {
	return [...String(text).matchAll(/{{\s*(-?[^{}]+?)\s*}}/g)]
		.map((match) => match[1].trim())
		.sort();
}

const failures = [];
let checkedKeys = 0;

for (const file of fs
	.readdirSync(englishRoot)
	.filter((name) => name.endsWith('.json'))) {
	const chinesePath = path.join(chineseRoot, file);
	if (!fs.existsSync(chinesePath)) {
		failures.push(`${file}: missing Chinese namespace`);
		continue;
	}

	const english = JSON.parse(
		fs.readFileSync(path.join(englishRoot, file), 'utf8'),
	);
	const chinese = new Map(
		leafEntries(JSON.parse(fs.readFileSync(chinesePath, 'utf8'))),
	);

	for (const [key, value] of leafEntries(english)) {
		checkedKeys += 1;
		if (!chinese.has(key)) {
			failures.push(`${file}: missing ${key}`);
		} else if (
			JSON.stringify(placeholders(value)) !==
			JSON.stringify(placeholders(chinese.get(key)))
		) {
			failures.push(`${file}: interpolation variables differ for ${key}`);
		}
	}
}

if (failures.length) {
	console.error(failures.join('\n'));
	process.exitCode = 1;
} else {
	console.log(
		`Verified ${checkedKeys} English keys and their Chinese interpolation variables.`,
	);
}
