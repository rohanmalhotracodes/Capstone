type CsvValue = string | number | boolean | null | undefined;

export function exportCsv(filename: string, rows: Record<string, CsvValue>[]): void {
  if (rows.length === 0) {
    return;
  }

  const headers = Object.keys(rows[0]);
  const escape = (value: CsvValue) => {
    const stringValue = value === null || value === undefined ? "" : String(value);
    return `"${stringValue.replace(/"/g, '""')}"`;
  };
  const csv = [headers.join(","), ...rows.map((row) => headers.map((header) => escape(row[header])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
