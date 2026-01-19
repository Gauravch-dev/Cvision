export function groupResumeLines(lines: any[]) {
  const grouped: Record<string, string[]> = {};

  for (const line of lines) {
    const section = line.section || "other";

    if (!grouped[section]) {
      grouped[section] = [];
    }

    if (!line.is_section_header && line.text.trim()) {
      grouped[section].push(line.text);
    }
  }

  return grouped;
}
