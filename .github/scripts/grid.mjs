import { readFileSync } from 'node:fs';

const [, , file, theme = 'dark'] = process.argv;
const palettes = {
  dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
  light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
};
const levels = ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE'];
const colors = palettes[theme];

const weeks = JSON.parse(readFileSync(file, 'utf8')).data.user.contributionsCollection.contributionCalendar.weeks;
const cell = 10;
const step = 13;
const rects = [];
weeks.forEach((week, x) => {
  for (const day of week.contributionDays) {
    const y = new Date(day.date + 'T00:00:00Z').getUTCDay();
    const fill = colors[Math.max(0, levels.indexOf(day.contributionLevel))];
    rects.push(`<rect x="${x * step}" y="${y * step}" width="${cell}" height="${cell}" rx="2" fill="${fill}"><title>${day.date}</title></rect>`);
  }
});

const width = weeks.length * step - (step - cell);
const height = 7 * step - (step - cell);
process.stdout.write(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${rects.join('')}</svg>\n`);
