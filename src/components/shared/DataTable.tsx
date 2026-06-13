import React from 'react';

interface DataTableProps {
  columns: { key: string; header: string }[];
  data: any[];
  renderRow: (item: any) => React.ReactNode;
}

export const DataTable: React.FC<DataTableProps> = ({ columns, data, renderRow }) => (
  <div className="overflow-x-auto rounded-xl">
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-slate-700/50">
          {columns.map((col) => (
            <th key={col.key} className="py-3 px-4 text-slate-400 font-medium text-sm uppercase tracking-wider">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{data.map((item) => renderRow(item))}</tbody>
    </table>
  </div>
);
