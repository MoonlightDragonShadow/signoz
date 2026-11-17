type Translate = (message: string, values?: Record<string, unknown>) => string;

const STATIC_LABELS = new Set([
	'just now',
	'Few seconds ago',
	'No updates yet!',
	'a few seconds ago',
	'a minute ago',
	'an hour ago',
	'a day ago',
	'a month ago',
	'a year ago',
	'in a few seconds',
	'in a minute',
	'in an hour',
	'in a day',
	'in a month',
	'in a year',
]);

const UNIT_KEYS: Record<string, string> = {
	s: 'seconds',
	sec: 'seconds',
	secs: 'seconds',
	second: 'seconds',
	seconds: 'seconds',
	m: 'minutes',
	min: 'minutes',
	mins: 'minutes',
	minute: 'minutes',
	minutes: 'minutes',
	h: 'hours',
	hr: 'hours',
	hrs: 'hours',
	hour: 'hours',
	hours: 'hours',
	d: 'days',
	day: 'days',
	days: 'days',
	month: 'months',
	months: 'months',
	year: 'years',
	years: 'years',
};

// Only call this for interface-generated time labels, not user-supplied values.
// Unknown formats and English labels keep their original representation.
export function localizeRelativeTime(
	value: string,
	translate: Translate,
): string {
	if (STATIC_LABELS.has(value)) {
		return translate(value);
	}

	const yesterday = /^Yesterday at (\d{2}:\d{2})$/.exec(value);
	if (yesterday) {
		return translate('Yesterday at {{value1}}', { value1: yesterday[1] });
	}

	const past = /^(?:(Refreshed|Last Updated) )?(-?\d+)\s*([a-z]+) ago$/.exec(
		value,
	);
	const future = /^in (\d+) ([a-z]+)$/.exec(value);
	const number = past?.[2] ?? future?.[1];
	const unit = UNIT_KEYS[past?.[3] ?? future?.[2] ?? ''];
	if (!number || !unit) {
		return value;
	}

	const key = past ? `{{value1}} ${unit} ago` : `in {{value1}} ${unit}`;
	const translated = translate(key, { value1: number });
	// English resources fall back to the key. Keep abbreviations and singular
	// forms exactly as generated instead of changing, for example, "5m ago".
	if (translated === key || translated === key.replace('{{value1}}', number)) {
		return value;
	}
	if (past?.[1] === 'Refreshed') {
		return translate('Refreshed {{value1}}', { value1: translated });
	}
	if (past?.[1] === 'Last Updated') {
		return translate('Last Updated {{value1}}', { value1: translated });
	}
	return translated;
}
