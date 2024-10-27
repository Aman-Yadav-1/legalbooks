import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { FaSearch, FaPlus, FaFilter, FaCheck } from 'react-icons/fa';
import PaymentHandler from './PaymentHandler';
import axios from 'axios';

interface ApiLead {
  id: string;
  created_at: string;
  created_by: number;
  modified_at: string;
  modified_by: number;
  city: number;
  specializations: number[];
  content: string;
  email: string;
  mobile: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost' | 'Bought';
  lastContact: string;
  area: string;
  state: string;
  city: string;
  // notes?: string;
}

interface LawyerProfile {
  areaOfPractice: string[];
  city: string;
}

interface AddLeadModalProps {
  onClose: () => void;
  onAddLead: (lead: Omit<Lead, 'id'>) => void;
  states: string[];
  statesData: any[];
}

interface AreaCheckboxProps {
  areas: string[];
  selectedAreas: string[];
  onAreaChange: (area: string) => void;
}

interface LeadCardProps {
  lead: Lead;
  showMyLeads: boolean;
  onAction: (id: string) => void;
}

const AreaCheckbox: React.FC<AreaCheckboxProps> = ({ areas, selectedAreas, onAreaChange }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {areas.map((area) => (
        <label key={area} className="flex items-center space-x-2 cursor-pointer">
          <div className={`w-5 h-5 border rounded flex items-center justify-center ${
            selectedAreas.includes(area) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
          }`}>
            {selectedAreas.includes(area) && <FaCheck className="text-white text-xs" />}
          </div>
          <input
            type="checkbox"
            className="hidden"
            checked={selectedAreas.includes(area)}
            onChange={() => onAreaChange(area)}
          />
          <span className="text-sm">{area}</span>
        </label>
      ))}
    </div>
  );
};


const AddLeadModal: React.FC<AddLeadModalProps> = ({ onClose, onAddLead, states, statesData }) => {
  const [newLead, setNewLead] = useState<Omit<Lead, 'id'>>({
    name: '',
    email: '',
    phone: '',
    status: 'New',
    lastContact: new Date().toISOString().split('T')[0],
    area: '',
    state: '',
    city: '',
    // notes: '',
  });
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [showAreaSelection, setShowAreaSelection] = useState(false);
  const [cities, setCities] = useState<{id: string, name: string}[]>([]);

  const areasOfPractice = ['Criminal Law', 'Family Law', 'Corporate Law', 'Civil Law', 'Intellectual Property'];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'amount') {
      setNewLead(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setNewLead(prev => ({ ...prev, [name]: value }));
    }

    if (name === 'state') {
      const selectedStateData = statesData.find(state => state.name === value);
      if (selectedStateData && Array.isArray(selectedStateData.cities)) {
        setCities(selectedStateData.cities);
      } else {
        setCities([]);
      }
      setNewLead(prev => ({ ...prev, city: '' }));
    }
  };

  const handleAreaChange = (area: string) => {
    setSelectedAreas(prev => 
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAddLead({ ...newLead, area: selectedAreas.join(', ') });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Add New Lead</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-grow p-6">
          <div className="space-y-4">
            {['name', 'email', 'phone'].map((field) => (
              <div key={field}>
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  value={newLead[field as keyof typeof newLead]}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                />
              </div>
            ))}
            
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">
                Area of Practice
              </label>
              <button
                type="button"
                className="w-full border text-sm border-gray-300 rounded-md p-2 text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                onClick={() => setShowAreaSelection(!showAreaSelection)}
              >
                {selectedAreas.length > 0 ? selectedAreas.join(', ') : "Select areas of legal assistance"}
              </button>
              {showAreaSelection && (
                <div className="mt-2">
                  <AreaCheckbox
                    areas={areasOfPractice}
                    selectedAreas={selectedAreas}
                    onAreaChange={handleAreaChange}
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">
                State
              </label>
              <select
                name="state"
                value={newLead.state}
                onChange={handleChange}
                className="w-full p-2 border text-sm border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                required
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">
                City
              </label>
              <select
                name="city"
                value={newLead.city}
                onChange={handleChange}
                className="w-full p-2 border text-sm border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                required
                disabled={!newLead.state}
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.name}>{city.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">
                Status
              </label>
              <select
                name="status"
                value={newLead.status}
                onChange={handleChange}
                className="w-full p-2 border text-sm border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
                <option value="Bought">Bought</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">
                Case Details
              </label>
              {/* <textarea
                name="notes"
                value={newLead.notes || ''}
                onChange={handleChange}
                placeholder="Briefly describe the legal issue or case details"
                className="w-full p-2 border text-sm border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 h-20 resize-none"
              /> */}
            </div>
          </div>
        </form>
        
        <div className="border-t p-4 flex justify-end gap-4">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300 transition-colors duration-200"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Add Lead
          </button>
        </div>
      </div>
    </div>
  );
};

const LeadCard: React.FC<LeadCardProps> = ({ lead, showMyLeads, onAction }) => {
  const getAreaColor = (area: string) => {
    const colors: { [key: string]: string } = {
      'Criminal Law': 'bg-red-100 text-red-800',
      'Family Law': 'bg-blue-100 text-blue-800',
      'Corporate Law': 'bg-green-100 text-green-800',
      'Civil Law': 'bg-yellow-100 text-yellow-800',
      'Intellectual Property': 'bg-purple-100 text-purple-800'
    };
    return colors[area] || 'bg-gray-100 text-gray-800';
  };

  const getLeadDescription = (area: string) => {
    const descriptions: { [key: string]: string } = {
      'Criminal Law': 'Seeking legal advice for a criminal defense case.',
      'Family Law': 'Needs assistance with divorce proceedings and child custody.',
      'Corporate Law': 'Requires help with business incorporation and contracts.',
      'Civil Law': 'Looking for representation in a personal injury lawsuit.',
      'Intellectual Property': 'Seeking guidance on patent application and trademark protection.'
    };
    return descriptions[area] || 'Requires legal consultation and representation.';
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'New': 'bg-green-100 text-green-800',
      'Contacted': 'bg-blue-100 text-blue-800',
      'Qualified': 'bg-yellow-100 text-yellow-800',
      'Lost': 'bg-red-100 text-red-800',
      'Bought': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };


  return (
    <div className="bg-white rounded-xl border shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${getAreaColor(lead.area)}`}>
              <span className="text-xl font-bold">{lead.area.split(' ').map(word => word[0]).join('')}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{lead.name}</h3>
              <p className="text-xs text-gray-600">{lead.area}</p>
            </div>
          </div>
          <div className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusColor(lead.status)}`}>
            {lead.status}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Email:</p>
            <p className="text-[0.8rem]">{lead.email}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Phone:</p>
            <p className="text-[0.8rem]">{lead.phone}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Location:</p>
            <p className="text-[0.8rem]">{lead.city}, {lead.state}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Last Contact:</p>
            <p className="text-[0.8rem]">{lead.lastContact}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 mb-1">Case Overview:</p>
          <p className="text-[0.8rem] text-gray-700">{getLeadDescription(lead.area)}</p>
        </div>
        
        <div className="flex justify-between items-center">
        {showMyLeads ? (
          <button
            onClick={() => onAction(lead.id)}
            className="px-4 py-2 text-xs rounded-md text-white font-medium transition-colors duration-200 bg-red-500 hover:bg-red-600"
          >
            Remove
          </button>
        ) : (
          <PaymentHandler
            leadId={lead.id}
            leadName={lead.name}
            onPaymentSuccess={() => onAction(lead.id)}
          />
        )}
      </div>
      </div>
    </div>
  );
};

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [boughtLeads, setBoughtLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMyLeads, setShowMyLeads] = useState(false);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<{id: string, name: string}[]>([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [statesData, setStatesData] = useState<any[]>([]);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedBoughtLeads = localStorage.getItem('boughtLeads');
    if (storedBoughtLeads) {
      setBoughtLeads(JSON.parse(storedBoughtLeads));
    }
    fetchStatesAndCities();
    if (showMyLeads) {
      fetchMyLeads();
    } else {
      fetchLeads();
    }
  }, [showMyLeads]);

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const response = await axios.get('https://api.legalbooks.in/api/v1/leads/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && Array.isArray(response.data.results)) {
        const mappedLeads = mapApiLeadsToLeads(response.data.results);
        setLeads(mappedLeads);
        setNextPage(response.data.next);
      } else {
        console.error('Unexpected API response structure:', response.data);
        setLeads([]);
        setNextPage(null);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        await refreshToken();
        fetchLeads(); // Retry after token refresh
      } else {
        setError('An error occurred while fetching leads. Please try again later.');
        setLeads([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMoreLeads = async () => {
    if (nextPage && !loading) {
      setLoading(true);
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          throw new Error('No access token found');
        }
        const response = await axios.get(nextPage, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        if (response.data && response.data.results) {
          const mappedLeads = mapApiLeadsToLeads(response.data.results);
          setLeads(prevLeads => [...prevLeads, ...mappedLeads]);
          setNextPage(response.data.next);
        } else {
          console.error('Unexpected API response structure:', response.data);
        }
      } catch (error) {
        console.error('Error fetching more leads:', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          await refreshToken();
          loadMoreLeads(); // Retry after token refresh
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const mapApiLeadsToLeads = (apiLeads: ApiLead[]): Lead[] => {
    return apiLeads.map(apiLead => ({
      id: apiLead.id,
      name: `Lead ${apiLead.id.substr(0, 8)}`,
      email: apiLead.email,
      phone: apiLead.mobile,
      status: 'New', // Set initial status as 'New'
      lastContact: new Date(apiLead.modified_at).toLocaleDateString(),
      area: mapSpecializationsToAreas(apiLead.specializations),
      state: 'Unknown',
      city: mapCityIdToName(apiLead.city),
      notes: apiLead.content
    }));
  };
  
  const mapSpecializationsToAreas = (specializations: number[]): string => {
    const specializationMap: { [key: number]: string } = {
      1: 'Criminal Law',
      2: 'Family Law',
      3: 'Corporate Law',
      10: 'Civil Law',
      11: 'Intellectual Property',
      17: 'Other'
    };
    return specializations.map(id => specializationMap[id] || 'Unknown').join(', ');
  };
  
  const mapCityIdToName = (cityId: number): string => {
    const cityMap: { [key: number]: string } = {
      2: 'Mumbai'
      // Add more city mappings as needed
    };
    return cityMap[cityId] || 'Unknown';
  };

  const fetchStatesAndCities = async () => {
    try {
      const response = await fetch('https://api.legalbooks.in/api/v1/register/fields?role=lawyer');
      const data = await response.json();
      if (data.status && Array.isArray(data.data.states)) {
        setStatesData(data.data.states);
        const stateNames = data.data.states.map((state: any) => state.name);
        setStates(stateNames);
      }
    } catch (error) {
      console.error('Error fetching states and cities:', error);
    }
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setSelectedState(newState);
    setSelectedCity('');
    
    const selectedStateData = statesData.find(state => state.name === newState);
    if (selectedStateData && Array.isArray(selectedStateData.cities)) {
      setCities(selectedStateData.cities);
    } else {
      setCities([]);
    }
  };

  const handleLeadAction = (leadId: string) => {
    const purchasedLeads = JSON.parse(localStorage.getItem('purchasedLeads') || '[]');
    if (showMyLeads) {
      // Remove from purchased leads
      const updatedPurchasedLeads = purchasedLeads.filter((id: string) => id !== leadId);
      localStorage.setItem('purchasedLeads', JSON.stringify(updatedPurchasedLeads));
    } else {
      // Add to purchased leads
      purchasedLeads.push(leadId);
      localStorage.setItem('purchasedLeads', JSON.stringify(purchasedLeads));
    }

    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId 
          ? { ...lead, status: showMyLeads ? 'New' : 'Bought' } 
          : lead
      )
    );
  };

  const filteredLeads = leads.filter(lead => 
    (showMyLeads ? lead.status === 'Bought' : lead.status !== 'Bought') &&
    (lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     lead.phone.includes(searchTerm)) &&
    (!selectedState || lead.state === selectedState) &&
    (!selectedCity || lead.city === selectedCity)
  );

  const handleAddLead = (newLead: Omit<Lead, 'id' | 'status'>) => {
    const id = (Math.random() * 1000000).toString(); // Generate a random ID for now
    const updatedLeads: Lead[] = [...leads, { ...newLead, id, status: 'New' }]; 
    setLeads(updatedLeads);
    setShowAddLeadModal(false);
  };

  const fetchMyLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const response = await axios.get('https://api.legalbooks.in/api/v1/leads/myleads', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && Array.isArray(response.data.results)) {
        const mappedLeads = mapApiLeadsToLeads(response.data.results);
        setBoughtLeads(mappedLeads);
        setNextPage(response.data.next);
      } else {
        console.error('Unexpected API response structure:', response.data);
        setBoughtLeads([]);
        setNextPage(null);
      }
    } catch (error) {
      console.error('Error fetching my leads:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          await refreshToken();
          fetchMyLeads(); // Retry after token refresh
        } else if (error.response?.status === 404) {
          console.error('404 error encountered. API endpoint might be incorrect.');
          setError('Unable to fetch leads. Please try again later.');
        } else {
          setError('An error occurred while fetching your leads. Please try again later.');
        }
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
      setBoughtLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      const response = await axios.post('https://api.legalbooks.in/api/v1/token/create/', {
        refresh: refreshToken
      });

      if (response.data && response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        if (response.data.refresh) {
          localStorage.setItem('refresh_token', response.data.refresh);
        }
        if (response.data.user_details) {
          localStorage.setItem('user_details', JSON.stringify(response.data.user_details));
        }
      } else {
        throw new Error('Invalid refresh token response');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      // Handle refresh token failure (e.g., redirect to login)
      window.location.href = '/login';
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-full mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tab buttons */}
          <div className="flex m-5">
            <button
              onClick={() => setShowMyLeads(false)}
              className={`flex-1 py-2 px-4 text-center font-semibold text-md transition-colors duration-200 ${
                !showMyLeads ? 'bg-blue-500 text-white mx-2 my-2 rounded-md' : 'mx-2 my-2 rounded-md text-gray-600 bg-gray-100 border-2'
              }`}
            >
              Leads
            </button>
            <button
              onClick={() => setShowMyLeads(true)}
              className={`flex-1 py-2 px-4 text-center font-semibold text-md transition-colors duration-200 ${
                showMyLeads ? 'bg-blue-500 text-white mx-2 my-2 rounded-md' : 'mx-2 my-2 rounded-md text-gray-600 bg-gray-100 border-2'
              }`}
            >
              My Leads
            </button>
          </div>

          <div className="p-6 m-2">
            {/* Header */}
            <h2 className="text-xl font-bold mb-2">
              {showMyLeads ? 'My Leads' : 'Leads'}
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              {showMyLeads
                ? 'Here you can find all your bought leads.'
                : 'Here you can find all the available leads.'}
            </p>

            {/* Search and filters */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative w-full md:w-1/3">
                <input
                  type="text"
                  placeholder="Search leads..."
                  className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-gray-200 text-xs text-gray-700 px-4 py-2 rounded-md flex items-center hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
                >
                  <FaFilter className="mr-2" /> Filters
                </button>
                {!showMyLeads && (
                  <button 
                    onClick={() => setShowAddLeadModal(true)}
                    className="bg-blue-600 text-xs text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <FaPlus className="mr-2" /> Add Lead
                  </button>
                )}
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6 flex flex-wrap gap-4">
                <select
                  className="border rounded-lg text-xs px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedState}
                  onChange={handleStateChange}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                <select
                  className="border rounded-lg text-xs px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedState}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>{city.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Error message */}
              {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {/* Lead cards */}
            <div className="space-y-4">
              {loading ? (
                <p>Loading leads...</p>
              ) : filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <LeadCard 
                    key={lead.id} 
                    lead={lead} 
                    showMyLeads={showMyLeads} 
                    onAction={handleLeadAction} 
                  />
                ))
              ) : (
                <p>{showMyLeads ? "You haven't bought any leads yet." : "No leads found."}</p>
              )}
            </div>
            
           {/* Load more button */}
            {nextPage && !showMyLeads && (
              <div className="mt-4 text-center">
                <button 
                  onClick={loadMoreLeads}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {showAddLeadModal && (
        <AddLeadModal 
          onClose={() => setShowAddLeadModal(false)} 
          onAddLead={handleAddLead} 
          states={states}
          statesData={statesData}
        />
      )}
    </div>
  );
};

export default Leads;