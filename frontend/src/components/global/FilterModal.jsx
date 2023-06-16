import React, { useState } from 'react';

const FilterModal = ({ isOpen, onClose, onApply }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
        setErrorMessage('');
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
        setErrorMessage('');
    };

    const handleOptionChange = (option) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter((item) => item !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    const handleApplyFilter = () => {
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            setErrorMessage('End date cannot be higher than the start date');
            return;
        }
        setIsSubmitting(true);
        onApply(startDate, endDate, selectedOptions);
    };
    return (
        <div className={`fixed inset-0 flex items-center w-screen justify-center ${isOpen ? 'visible' : 'hidden'}`}>
            <div className="absolute top-0 left-0 z-10 w-full h-full bg-gray-900 bg-opacity-50" onClick={onClose}></div>
            <div className="z-20 bg-white rounded-lg p-4 w-4/5 max-w-lg">
                <h2 className="text-lg font-bold mb-4">Filter Options</h2>

                {errorMessage && <p className="error m-auto text-center w-full">{errorMessage}</p>}

                <div className="mb-4">
                    <label className="block mb-2">Start Date:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">End Date:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={handleEndDateChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Sources:</label>
                    <div>
                        <label className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                value="The Guardian"
                                checked={selectedOptions.includes('guardian')}
                                onChange={() => handleOptionChange('guardian')}
                                className="mr-2"
                            />
                            The Guardian
                        </label>
                        <label className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                value="New York Times"
                                checked={selectedOptions.includes('nytimes')}
                                onChange={() => handleOptionChange('nytimes')}
                                className="mr-2"
                            />
                            New York Times
                        </label>
                        <label className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                value="NewsAPI.org"
                                checked={selectedOptions.includes('newsapi')}
                                onChange={() => handleOptionChange('newsapi')}
                                className="mr-2"
                            />
                            NewsAPI.org
                        </label>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                        onClick={handleApplyFilter}
                        disabled={!!errorMessage}>
                        {isSubmitting ? "loading..." : "Apply"}

                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;
