import React from 'react';
import LawyerProfile from './page';

interface PageProps {
  params: {};
  searchParams: { lawyer: string };
}

const LawyerPage: React.FC<PageProps> = ({ params, searchParams }) => {
  const { lawyer } = searchParams;

  if (!lawyer) {
    return <div>Error: No lawyer data provided</div>;
  }

  try {
    const lawyerData = JSON.parse(lawyer);
    return <LawyerProfile {...lawyerData} />;
  } catch (error) {
    return <div>Error: Invalid lawyer data</div>;
  }
};

export default LawyerPage;