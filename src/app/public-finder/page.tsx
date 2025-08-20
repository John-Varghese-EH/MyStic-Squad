
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const PublicFinderClient = dynamic(() => import('@/components/public-finder-client'), { 
  ssr: false,
  loading: () => (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div>
        <Skeleton className="h-9 w-1/3 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Skeleton className="h-[450px] w-full" />
        </div>
        <div className="lg:col-span-2">
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    </div>
  )
});

export default function PublicFinderPage() {
  return <PublicFinderClient />;
}
