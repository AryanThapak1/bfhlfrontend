import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState('');
  const [filters, setFilters] = useState(['Numbers']); // Store selected filters as an array
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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
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
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="multiFilter">
            Multi Filter
          </label>
          <select
            id="multiFilter"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            multiple
            value={filters}
            onChange={e => setFilters(Array.from(e.target.selectedOptions, option => option.value))}
          >
            <option value="Numbers">Numbers</option>
            <option value="Alphabets">Alphabets</option>
            <option value="Highest Lowercase Alphabet">Highest Lowercase Alphabet</option>
          </select>
        </div>
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
