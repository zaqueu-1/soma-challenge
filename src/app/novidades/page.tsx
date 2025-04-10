import Header from '@/components/Header';
import ClientProductList from '@/components/ClientProductList';
import { Banner } from '@/components/Banner';

export default function Novidades() {
  return (
    <>
      <Header />
      <div className="pb-[130px]">
        <Banner />
        <ClientProductList />
      </div>
    </>
  );
} 