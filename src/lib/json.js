export function safeJsonObject(raw) {
  let cleaned = String(raw || '')
    .replace(/```[\s\S]*?json\s*/gi, '')
    .replace(/```/g, '')
    .trim();

  // Try direct parse first
  try { return JSON.parse(cleaned); } catch {}

  // Find outermost { ... }
  const first = cleaned.indexOf('{');
  if (first === -1) throw new Error(`No JSON object: ${cleaned.slice(0, 80)}`);

  // Walk brackets to find the matching closing brace
  let depth = 0;
  let end = -1;
  for (let i = first; i < cleaned.length; i++) {
    if (cleaned[i] === '{') depth++;
    else if (cleaned[i] === '}') {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }

  // If JSON was truncated (no closing brace), try to close it
  const slice = end !== -1 ? cleaned.slice(first, end + 1) : cleaned.slice(first) + '}}}';

  try { return JSON.parse(slice); } catch {}

  // Last resort: close open braces/arrays
  const partial = cleaned.slice(first);
  let fixed = partial;
  const opens = (partial.match(/\{/g) || []).length - (partial.match(/\}/g) || []).length;
  const arrOpens = (partial.match(/\[/g) || []).length - (partial.match(/\]/g) || []).length;
  if (arrOpens > 0) fixed += ']'.repeat(arrOpens);
  if (opens > 0) fixed += '}'.repeat(opens);
  return JSON.parse(fixed);
}

export function parseChatLines(raw) {
  const lines = String(raw || '').split('\n').map((x) => x.trim()).filter(Boolean);
  const replies = [];

  const speakerMap = {
    cloud: 'cloud',
    zack: 'zack',
    tifa: 'tifa',
    aerith: 'aerith',
    aeris: 'aerith',
    barret: 'barrett',
    barrett: 'barrett',
    sephiroth: 'sephiroth',
  };

  for (const line of lines) {
    const match = line.match(/^\[?([^\]:：]+)\]?[：:]\s*(.+)$/);
    if (!match) continue;
    const key = match[1].trim().toLowerCase();
    const speaker = speakerMap[key] || speakerMap[key.replace(/\s+/g, '')];
    if (speaker) replies.push({ speaker, text: match[2].trim() });
  }

  return replies.slice(0, 4);
}
