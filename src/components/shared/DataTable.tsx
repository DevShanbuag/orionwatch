import React from 'react';

interface DataTableProps {
  columns: { key: string; header: string }[];
  data: any[];
  renderRow: (item: any) => React.ReactNode;
}

export const DataTable: React.FC<DataTableProps> = ({ columns, data, renderRow }) => (
  <div className="overflow-x-auto rounded-none border border-[var(--border-primary)]">
    <table className="enterprise-table text-left">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} className="text-label">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{data.map((item) => renderRow(item))}</tbody>
    </table>
  </div>
);
