import { useMeQuery } from '@/data/user';
import { STORE_OWNER, SUPER_ADMIN } from '@/utils/constants';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Loader from '../ui/loader/loader';
import NotFound from '../ui/not-found';

const AdminLayout = dynamic(() => import('@/components/layouts/admin'));
const OwnerLayout = dynamic(() => import('@/components/layouts/owner'));

export default function AppLayout({
  userPermissions,
  ...props
}: {
  userPermissions: string[];
}) {

  
  if (userPermissions?.includes(SUPER_ADMIN)) {
    return <AdminLayout {...props} />;
  }
  // useEffect(() => {
  //   // Refetch data on mount to ensure fresh data
  //   refetch();
  // }, []);
else if(userPermissions?.includes(STORE_OWNER)){
  
  const router = useRouter();
  const { data, isLoading, error} = useMeQuery();
    if (!isLoading && !error) {
      router.push(`/${data?.shops[0]?.id}`);
    }
  if (isLoading) {
    return <Loader />; // Display a loading message or spinner
  }

  if (error) {
    return <NotFound />; // Display an error message
  }
  return <Loader />;
}
 // Default to Loader if no conditions are met
}
