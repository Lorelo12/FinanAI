
import { BillsHeader } from '@/components/features/bills/bills-header';
import { BillsList } from '@/components/features/bills/bills-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BillsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BillsHeader />
      <Card>
        <CardHeader>
          <CardTitle>Contas Mensais</CardTitle>
        </CardHeader>
        <CardContent>
          <BillsList />
        </CardContent>
      </Card>
    </div>
  );
}
