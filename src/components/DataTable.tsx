import type { ReactNode } from "react";
import { EmptyState } from "./EmptyState";
import { Inbox } from "lucide-react";

export interface DataTableColumn<T> {
  header: string;
  accessor?: keyof T;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTable<T>({
  columns,
  data,
  getRowKey,
  onRowClick,
  emptyTitle = "No records found",
  emptyDescription = "Try adjusting filters or search terms."
}: DataTableProps<T>) {
  if (data.length === 0) {
    return <EmptyState icon={Inbox} title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="table-scroll overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            {columns.map((column) => (
              <th key={column.header} scope="col" className={`whitespace-nowrap px-4 py-3 font-bold ${column.className ?? ""}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {data.map((row) => (
            <tr
              key={getRowKey(row)}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? "cursor-pointer hover:bg-blue-50/50" : "hover:bg-slate-50"}
            >
              {columns.map((column) => (
                <td key={column.header} className={`whitespace-nowrap px-4 py-3 text-slate-700 ${column.className ?? ""}`}>
                  {column.render ? column.render(row) : column.accessor ? String(row[column.accessor]) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
