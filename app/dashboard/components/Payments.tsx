import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FaDownload, FaSearch, FaSort, FaFileDownload } from 'react-icons/fa';

interface Payment {
  created_at: string;
  modified_at: string;
  amount: string;
  currency: string;
  status: string;
  order_id: string;
  payment_mode: string;
  receipt: string | null;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Payment[];
}

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Payment; direction: 'asc' | 'desc' } | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [totalCount, setTotalCount] = useState(0);
  const [statusOptions, setStatusOptions] = useState<string[]>(['All']);

  const refreshToken = async (): Promise<string> => {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post<{ access: string }>('https://api.legalbooks.in/api/v1/token/refresh', { refresh });
      localStorage.setItem('access_token', response.data.access);
      return response.data.access;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  };

  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let token = localStorage.getItem('access_token');

      if (!token) {
        throw new Error('No access token available');
      }

      const fetchData = async (accessToken: string): Promise<ApiResponse> => {
        const response = await axios.get<ApiResponse>('https://api.legalbooks.in/api/v1/payments', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          params: {
            page: currentPage,
          },
        });
        return response.data;
      };

      let data: ApiResponse;
      try {
        data = await fetchData(token);
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          const newToken = await refreshToken();
          data = await fetchData(newToken);
        } else {
          throw error;
        }
      }

      setPayments(data.results);
      setFilteredPayments(data.results);
      setTotalCount(data.count);

      const uniqueStatuses = ['All', ...Array.from(new Set(data.results.map(payment => payment.status)))];
      setStatusOptions(uniqueStatuses);

    } catch (error) {
      console.error('Error fetching payments:', error);
      setError('Failed to load payments. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [currentPage]);
  
  useEffect(() => {
    const results = payments.filter(payment =>
      Object.values(payment).some(value => 
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      ) &&
      (statusFilter === 'All' || payment.status === statusFilter)
    );
    setFilteredPayments(results);
  }, [searchTerm, statusFilter, payments]);

  const sortPayments = (key: keyof Payment) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedPayments = [...filteredPayments].sort((a, b) => {
      if (a[key] === null || b[key] === null) {
        return 0;
      }
      
      if (typeof a[key] === 'string' && typeof b[key] === 'string') {
        return direction === 'asc' 
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      }
      
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredPayments(sortedPayments);
  };

  const exportCSV = () => {
    const headers = ['Created At', 'Amount', 'Currency', 'Status', 'Order ID', 'Payment Mode', 'Receipt'];
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + "\n"
      + filteredPayments.map(p => 
          [p.created_at, p.amount, p.currency, p.status, p.order_id, p.payment_mode, p.receipt]
          .map(value => `"${value ?? ''}"`).join(',')
        ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "payment_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadReceipt = (receiptUrl: string) => {
    const link = document.createElement('a');
    link.href = receiptUrl;
    link.target = '_blank';
    link.download = 'receipt.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderReceipt = (receipt: string | null) => {
    if (!receipt) {
      return 'N/A';
    }
    if (receipt.startsWith('https://')) {
      return (
        <button
          onClick={() => downloadReceipt(receipt)}
          className="text-indigo-600 hover:text-indigo-800 flex items-center justify-center"
          title="Download Receipt"
        >
          <FaFileDownload />
        </button>
      );
    }
    return receipt;
  };

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Payment History</h1>
        
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
              <div className="relative w-full sm:w-auto">
                <input 
                  type="text" 
                  placeholder="Search payments..." 
                  className="w-full sm:w-72 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
              </div>
              <div className="flex space-x-4">
                <select
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                  value={statusFilter}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <button 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-150 ease-in-out flex items-center text-sm"
                  onClick={exportCSV}
                >
                  <FaDownload className="mr-2" /> Export CSV
                </button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-sm text-gray-600">Loading payments...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Payment Date', 'Amount', 'Currency', 'Status', 'Order ID', 'Payment Mode', 'Receipt'].map((header) => (
                        <th
                          key={header}
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150 ease-in-out"
                          onClick={() => sortPayments(header.toLowerCase().replace(' ', '_') as keyof Payment)}
                        >
                          <div className="flex items-center">
                            <span className="mr-2">{header}</span>
                            <FaSort className="text-gray-400" />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPayments && filteredPayments.length > 0 ? (
                      filteredPayments.map((payment, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                          <td className="px-4 py-4 whitespace-nowrap text-sm">{new Date(payment.created_at).toLocaleString()}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">{payment.amount}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">{payment.currency}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              payment.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">{payment.order_id}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">{payment.payment_mode}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">{renderReceipt(payment.receipt)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-4 py-4 whitespace-nowrap text-sm text-center">
                          No payments found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to <span className="font-medium">{Math.min(currentPage * 10, totalCount)}</span> of <span className="font-medium">{totalCount}</span> results
              </p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition duration-150 ease-in-out"
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(prev => prev + 1)} 
                disabled={!payments.length || payments.length < 10}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition duration-150 ease-in-out"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;