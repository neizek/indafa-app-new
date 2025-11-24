// Formats number >99 to 00.0k
export function formatCompact(num: number) {
	if (Math.abs(num) < 100) return num.toString();
	return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
}
