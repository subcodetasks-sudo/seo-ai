import EmptyState from "@/components/empty-state";
import { TableCell, TableRow } from "@/components/ui/table";

type TableEmptyRowProps = {
  colSpan: number;
  title: string;
};

export function TableEmptyRow({ colSpan, title }: TableEmptyRowProps) {
  return (
    <TableRow className="hover:bg-transparent border-neutral-200">
      <TableCell colSpan={colSpan} className="p-0">
        <EmptyState title={title} fullPage={false} className="border-0 py-12" />
      </TableCell>
    </TableRow>
  );
}
