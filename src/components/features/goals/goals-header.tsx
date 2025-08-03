
"use client";

import { AddGoalDialog } from "./add-goal-dialog";

export function GoalsHeader() {
  return (
    <div className="flex items-center justify-between space-y-2">
      <h2 className="text-3xl font-bold tracking-tight">Metas Financeiras</h2>
      <div className="flex items-center space-x-2">
        <AddGoalDialog />
      </div>
    </div>
  );
}
