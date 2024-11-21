import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState('');
  const [availableFilters, setAvailableFilters] = useState([
    'Numbers', 'Alphabets', 'Highest Lowercase Alphabet'
  ]); // Available filter options
  const [filters, setFilters] = useState([]); // Store selected filters as an array
  const [filteredResponse, setFilteredResponse] = useState('');
  const [apiResponse, setApiResponse] = useState(null); // Store the API response

  // Fetch data from API when form is submitted
  const handleSubmit = async () => {
    try {
      const parsedData = JSON.parse(data);
      console.log(parsedData);

      const response = await fetch('https://bfhlbackend-eta.vercel.app/api/v1/bfhl', {
        method: 'POST',
        body: JSON.stringify(parsedData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const newData = await response.json();

      if (newData.is_success) {
        setApiResponse(newData); // Store the API response in state
      } else {
        setFilteredResponse('Error in API response');
      }
    } catch (error) {
      console.error('Error:', error);
      setFilteredResponse('Invalid input or API error');
    }
  };

  // Update the filtered response when filters or apiResponse changes
  useEffect(() => {
    if (apiResponse) {
      let combinedResponse = [];

      // Check each filter and add the corresponding data if available
      if (filters.includes('Numbers') && apiResponse.numbers) {
        combinedResponse.push(`Numbers: ${apiResponse.numbers.join(', ')}`);
      }
      if (filters.includes('Alphabets') && apiResponse.alphabets) {
        combinedResponse.push(`Alphabets: ${apiResponse.alphabets.join(', ')}`);
      }
      if (filters.includes('Highest Lowercase Alphabet') && apiResponse.highest_lowercase_alphabet) {
        combinedResponse.push(`Highest Lowercase Alphabet: ${apiResponse.highest_lowercase_alphabet.join(', ')}`);
      }

      // Join all the combined responses with ' | ' separator
      setFilteredResponse(combinedResponse.length ? combinedResponse.join(' | ') : 'No data for selected filters');
    }
  }, [filters, apiResponse]); // Trigger when filters or apiResponse changes

  // Handle adding filter to the active filters list
  const addFilter = (filter) => {
    if (!filters.includes(filter)) {
      setFilters([...filters, filter]);
    }
  };

  // Handle removing filter from the active filters list
  const removeFilter = (filter) => {
    setFilters(filters.filter(f => f !== filter));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        {/* Filter Selection Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="multiFilter">
            Select Filters
          </label>
          <select
            id="multiFilter"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={(e) => addFilter(e.target.value)}
            value=""
          >
            <option value="" disabled>Select a filter</option>
            {availableFilters.map((filter) => (
              <option key={filter} value={filter}>
                {filter}
              </option>
            ))}
          </select>
        </div>

        {/* Active Filters Bar */}
        <div className="mb-4 flex flex-wrap space-x-2">
          {filters.map((filter) => (
            <span
              key={filter}
              className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center cursor-pointer"
              onClick={() => removeFilter(filter)}
            >
              {filter}
              <span className="ml-2 text-xs">x</span>
            </span>
          ))}
        </div>

        {/* Input and Submit Button */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="apiInput">
            API Input
          </label>
          <input
            type="text"
            id="apiInput"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={data}
            onChange={e => setData(e.target.value)}
            placeholder='Ex-{"data":["M","1","334","4","B"]}'
          />
        </div>
        <div className="mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>

        {/* Filtered Response */}
        <div>
          <label className="block text-gray-700 font-bold mb-2" htmlFor="filteredResponse">
            Filtered Response
          </label>
          <div
            id="filteredResponse"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
          >
            {filteredResponse || 'Please submit data'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
