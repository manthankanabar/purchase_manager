import { ReactNode } from 'react';

export interface StockItemsTableProps {
  data: any[];
  uomOptions: any[];
  categoryOptions: any[];
  groupOptions: any[];
}

declare const StockItemsTable: React.FC<StockItemsTableProps>;
export default StockItemsTable;
