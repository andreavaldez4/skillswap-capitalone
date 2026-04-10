import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <Skeleton className="h-6 w-40 bg-orange-100" />
        <Card className="border-orange-100 shadow-sm">
          <CardContent className="space-y-6 p-6">
            <div className="flex items-start gap-4">
              <Skeleton className="h-20 w-20 rounded-3xl bg-orange-100" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-8 w-56 bg-orange-100" />
                <Skeleton className="h-4 w-72 bg-orange-100" />
                <Skeleton className="h-4 w-full max-w-xl bg-orange-100" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Skeleton className="h-24 rounded-2xl bg-orange-100" />
              <Skeleton className="h-24 rounded-2xl bg-orange-100" />
              <Skeleton className="h-24 rounded-2xl bg-orange-100" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}