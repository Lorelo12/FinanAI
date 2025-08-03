
import { GoalsHeader } from '@/components/features/goals/goals-header';
import { GoalsList } from '@/components/features/goals/goals-list';

export default function GoalsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <GoalsHeader />
      <GoalsList />
    </div>
  );
}
