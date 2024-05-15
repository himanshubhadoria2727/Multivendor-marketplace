import { User } from '@/types';
import { NextPageWithLayout } from '@/types';
import Layout from '@/layouts/_layout';
import Seo from '@/layouts/_seo';
import routes from '@/config/routes';
import { PurchaseIconDB } from '@/components/icons/purchaseIconDB';
import { BalanceIcon } from '@/components/icons/BalanceIcon';
import { SearchIcon } from '@/components/icons/search-icon';
import { HeartIcon } from '@/components/icons/heart-icon';
import { PeopleIcon } from '@/components/icons/people-icon';
import { ProductIcon } from '@/components/icons/product-icon';
import { InformationIcon } from '@/components/icons/information-icon';
import { ReportIcon } from '@/components/icons/report-icon';
import { UserFollowingIcon } from '@/components/icons/user-following-icon';
import { CreditCardIcon } from '@/components/icons/credit-card-icon';
import { UserIcon } from '@/components/icons/user-icon';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';

interface DashboardProps {
  users: User[];
}

const Dashboard: React.FC<DashboardProps> = ({ users }) => {

    


  return (
    <div className="parent flex flex-col  p-4">
      <div className="Username flex flex-col md:flex-row items-center justify-center h-auto m-2 md:m-4 p-5 dark:bg-dark-200 dark:text-brand-dark rounded-lg shadow-xl bg-white dark:shadow-lg dark:shadow-[#8D9797] w-full md:w-auto sm:w-auto">
        <h1 className="text-3xl w-100 text-[#474E4E] font-bold dark:text-white p-4">
          Hello Customer !
        </h1>
      </div>
      <div className="OrderDetails-parent  m-4 flex flex-wrap justify-around  ">
        <div
          className="OrderDetails lg:w-1/5 w-full md:full  p-4 pt-6 pb-6 m-4 items-center justify-start p-1 dark:bg-dark-200 dark:text-brand-dark p-5 rounded-lg shadow-xl bg-white dark:bg-dark-200 
        border-l-4 border-brand dark:border-white"
        >
          <div className="flex justify-between sm:justify-between">
            <span className="flex-col text-lg font-bold dark:text-white">
              Active Orders
              <p className="text-brand">0</p>
            </span>
            <span className="flex items-center justify-center">
              <PurchaseIconDB color="#3FD424" className="h-10 w-10" />
            </span>
          </div>
        </div>
        <div
          className="OrderDetails lg:w-1/5 w-full md:full  p-4 pt-6 pb-6 m-4 items-center justify-start p-1 dark:bg-dark-200 dark:text-brand-dark p-5 rounded-lg shadow-xl bg-white dark:bg-dark-200 
          border-l-4 border-brand dark:border-white"
        >
          <div className="flex justify-between sm:justify-between">
            <span className="flex-col text-lg font-bold dark:text-white">
              Completed Orders
              <p className="text-[#F5EA04]">0</p>
            </span>
            <span className="flex items-center justify-center">
              <PurchaseIconDB color="#F5EA04" className="h-10 w-10" />
            </span>
          </div>
        </div>
        <div
          className="OrderDetails lg:w-1/5 w-full md:full  p-4 pt-6 pb-6 m-4 items-center justify-start p-1 dark:bg-dark-200 dark:text-brand-dark p-5 rounded-lg shadow-xl bg-white dark:bg-dark-200 
          border-l-4 border-brand dark:border-white"
        >
          <div className="flex justify-between sm:justify-between">
            <span className="flex-col text-lg font-bold dark:text-white">
              Wallet Balance
              <p className="text-brand">0</p>
            </span>
            <span className="flex items-center justify-center">
              <BalanceIcon color="#3FD424" className="h-10 w-10" />
            </span>
          </div>
        </div>
        <div
          className="OrderDetails lg:w-1/5 w-full md:full  p-4 pt-6 pb-6 m-4 items-center justify-start p-1 dark:bg-dark-200 dark:text-brand-dark p-5 rounded-lg shadow-xl bg-white dark:bg-dark-200 
          border-l-4 border-brand dark:border-white"
        >
          <div className="flex justify-between sm:justify-between">
            <span className="flex-col text-lg font-bold dark:text-white">
              Lifetime Spending
              <p className="text-brand">0</p>
            </span>
            <span className="flex items-center justify-center">
              <BalanceIcon color="#3FD424" className="h-10 w-10" />
            </span>
          </div>
        </div>
      </div>
      <div className="OtherDetails-parent m-4 flex flex-wrap justify-around  ">
        <div
          className="lg:w-1/5 w-full md:full  p-4 pt-6 pb-6 m-4 items-center justify-start p-1 dark:bg-dark-200 dark:text-brand-dark p-5 rounded-lg shadow-xl bg-white dark:bg-dark-200 
           "
        >
          <span className=" flex flex-col items-center justify-center p-4 ">
            <UserIcon className="h-24 w-24 " />
            <p className="flex-col text-lg text-[#C9C4C4] mt-4 dark:text-white">
              My Profile
            </p>
          </span>
        </div>
        <div
          className="OtherDetails lg:w-1/5 w-full md:full  p-4 pt-6 pb-6 m-4 items-center justify-start p-1 dark:bg-dark-200 dark:text-brand-dark p-5 rounded-lg shadow-xl bg-white dark:bg-dark-200 
           "
        >
          <span className=" flex flex-col items-center justify-center p-4 ">
            <HeartIcon className="h-24 w-24 " />
            <p className="flex-col text-lg text-[#C9C4C4] mt-4 dark:text-white">
              My Wishlist
            </p>
          </span>
        </div>
        <div
          className="OtherDetails lg:w-1/5 w-full md:full  p-4 pt-6 pb-6 m-4 items-center justify-start p-1 dark:bg-dark-200 dark:text-brand-dark p-5 rounded-lg shadow-xl bg-white dark:bg-dark-200 
          "
        >
          <span className=" flex flex-col items-center justify-center p-4 ">
            <PeopleIcon className="h-24 w-24 " />
            <p className="flex-col text-lg text-[#C9C4C4] mt-4 dark:text-white">
              My Publishers
            </p>
          </span>
        </div>
        <div
          className="OtherDetails lg:w-1/5 w-full md:full  p-4 pt-6 pb-6 m-4 items-center justify-start p-1 dark:bg-dark-200 dark:text-brand-dark p-5 rounded-lg shadow-xl bg-white dark:bg-dark-200 
          "
        >
          <span className=" flex flex-col items-center justify-center p-4 ">
            <ProductIcon className="h-24 w-24 " />
            <p className="flex-col text-lg text-[#C9C4C4] mt-4 dark:text-white">
              My Order
            </p>
          </span>
        </div>
        <div
          className="OtherDetails lg:w-1/5 w-full md:full  p-4 pt-6 pb-6 m-4 items-center justify-start p-1 dark:bg-dark-200 dark:text-brand-dark p-5 rounded-lg shadow-xl bg-white dark:bg-dark-200 
          "
        >
          <span className=" flex flex-col items-center justify-center p-4 ">
            <InformationIcon className="h-24 w-24 " />
            <p className="flex-col text-lg text-[#C9C4C4] mt-4 dark:text-white">
              My Questions
            </p>
          </span>
        </div>
        <div
          className="OtherDetails lg:w-1/5 w-full md:full  p-4 pt-6 pb-6 m-4 items-center justify-start p-1 dark:bg-dark-200 dark:text-brand-dark p-5 rounded-lg shadow-xl bg-white dark:bg-dark-200 
          "
        >
          <span className=" flex flex-col items-center justify-center p-4 ">
            <ReportIcon className="h-24 w-24 " />
            <p className="flex-col text-lg text-[#C9C4C4] mt-4 dark:text-white">
              My Reports
            </p>
          </span>
        </div>
        <div
          className="OtherDetails lg:w-1/5 w-full md:full  p-4 pt-6 pb-6 m-4 items-center justify-start p-1 dark:bg-dark-200 dark:text-brand-dark p-5 rounded-lg shadow-xl bg-white dark:bg-dark-200 
          "
        >
          <span className=" flex flex-col items-center justify-center p-4 ">
            <UserFollowingIcon className="h-24 w-24 " />
            <p className="flex-col text-lg text-[#C9C4C4] mt-4 dark:text-white">
              Place Order
            </p>
          </span>
        </div>
        <div
          className="OtherDetails lg:w-1/5 w-full md:full  p-4 pt-6 pb-6 m-4 items-center justify-start p-1 dark:bg-dark-200 dark:text-brand-dark p-5 rounded-lg shadow-xl bg-white dark:bg-dark-200 
          "
        >
          <span className=" flex flex-col items-center justify-center p-4 ">
            <CreditCardIcon className="h-24 w-24 " />
            <p className="flex-col text-lg text-[#C9C4C4] mt-4 dark:text-white">
              Place Order
            </p>
          </span>
        </div>
      </div>

      
    </div>
  );
};

const DashboardPage: NextPageWithLayout<DashboardProps> = ({ users }) => {

  return (
    <>
      <Seo
        title="Dashboard"
        description="Fastest digital download template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        url={routes.authors}
      />
      <Dashboard users={users} />
    </>
  );
};

DashboardPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export const getStaticProps: GetStaticProps<DashboardProps> = async ({
  locale,
}) => {
  // Mock users data for demonstration
  const users: User[] = [];

  return {
    props: {
      users,
      ...(await serverSideTranslations(locale!, ['common'])),
    },
    revalidate: 60, // In seconds
  };
};

export default DashboardPage;
