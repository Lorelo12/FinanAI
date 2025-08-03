
"use client";

import { AddBillDialog } from "./add-bill-dialog";

export function BillsHeader() {
  return (
    <div className="flex items-center justify-between space-y-2">
      <h2 className="text-3xl font-bold tracking-tight">Contas a Pagar</h2>
      <div className="flex items-center space-x-2">
        <AddBillDialog />
      </div>
    </div>
  );
}
