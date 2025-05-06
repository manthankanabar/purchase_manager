import { ReactNode } from 'react';

export interface CreateStockItemDialogProps {
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  uomOptions: { id: string; name: string; code: string }[];
  categoryOptions: { id: string; name: string; prefixCode: string }[];
  groupOptions: { id: string; name: string; code: string; categoryId: string }[];
}

export declare function CreateStockItemDialog(props: CreateStockItemDialogProps): React.ReactElement;
