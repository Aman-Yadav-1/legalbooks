import React, { useState, useEffect, useRef } from "react";

interface Specialization {
  id: number;
  specialization_name: string;
}

interface Practice {
  id: number;
  practice_name: string;
  specializations: Specialization[];
}

interface CheckboxesProps {
  options: Practice[];
  selected: number[];
  onChange: (selected: number[]) => void;
  onSubmit: (selected: number[], summary: string) => void;
  maxDisplayed?: number;
  primaryAreaOfPractice?: number;
  onClose?: () => void;  // Make onClose optional again
}

const Checkboxes: React.FC<CheckboxesProps> = ({ 
  options, 
  selected, 
  onChange, 
  onSubmit, 
  maxDisplayed = 5,
  primaryAreaOfPractice,
  onClose
}) => {
  const [selectedPractices, setSelectedPractices] = useState<number[]>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<number[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const practices = selected.filter(id => options.some(practice => practice.id === id));
    const specializations = selected.filter(id => options.some(practice => 
      practice.specializations.some(spec => spec.id === id)
    ));
    setSelectedPractices(practices);
    setSelectedSpecializations(specializations);
  }, [selected, options]);

  useEffect(() => {
    if (primaryAreaOfPractice) {
      const practice = options.find(p => p.id === primaryAreaOfPractice);
      if (practice) {
        setSelectedPractices(prev => Array.from(new Set([...prev, primaryAreaOfPractice])));
        setSelectedSpecializations(prev => 
          Array.from(new Set([...prev, ...practice.specializations.map(spec => spec.id)]))
        );
      }
    }
  }, [primaryAreaOfPractice, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (onClose) onClose();  // Only call onClose if it's defined
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const isPracticeSelected = (practice: Practice) => {
    return selectedPractices.includes(practice.id) &&
           practice.specializations.every(spec => selectedSpecializations.includes(spec.id));
  };

  const togglePractice = (practice: Practice) => {
    if (isPracticeSelected(practice)) {
      setSelectedPractices(prev => prev.filter(id => id !== practice.id));
      setSelectedSpecializations(prev => 
        prev.filter(id => !practice.specializations.some(spec => spec.id === id))
      );
    } else {
      setSelectedPractices(prev => [...prev, practice.id]);
      setSelectedSpecializations(prev => [
        ...prev,
        ...practice.specializations.map(spec => spec.id)
      ]);
    }
  };

  const toggleSpecialization = (specializationId: number, practice: Practice) => {
    if (selectedSpecializations.includes(specializationId)) {
      setSelectedSpecializations(prev => prev.filter(id => id !== specializationId));
      if (!practice.specializations.some(spec => selectedSpecializations.includes(spec.id) && spec.id !== specializationId)) {
        setSelectedPractices(prev => prev.filter(id => id !== practice.id));
      }
    } else {
      setSelectedSpecializations(prev => [...prev, specializationId]);
      if (practice.specializations.every(spec => selectedSpecializations.includes(spec.id) || spec.id === specializationId)) {
        setSelectedPractices(prev => [...prev, practice.id]);
      }
    }
  };

  const clearSelections = () => {
    setSelectedPractices([]);
    setSelectedSpecializations([]);
  };

  const generateSummary = (): string => {
    const practiceNames = options
      .filter(practice => selectedPractices.includes(practice.id))
      .map(practice => practice.practice_name);
    
    const specializationNames = options.flatMap(practice => 
      practice.specializations.filter(spec => selectedSpecializations.includes(spec.id))
    ).map(spec => spec.specialization_name);

    const allSelectedNames = [...practiceNames, ...specializationNames];

    if (allSelectedNames.length <= maxDisplayed) {
      return allSelectedNames.join('; ');
    } else {
      const displayedNames = allSelectedNames.slice(0, maxDisplayed);
      const remainingCount = allSelectedNames.length - maxDisplayed;
      return `${displayedNames.join('; ')} and ${remainingCount} more`;
    }
  };

  const handleSubmit = () => {
    const summary = generateSummary();
    onSubmit([...selectedPractices, ...selectedSpecializations], summary);
    if (onClose) onClose();  // Only call onClose if it's defined
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-gray-800 text-left">Select Practices and Specializations</h2>
        </div>
        <div className="p-4">
          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
            >
              Submit
            </button>
            <button
              onClick={clearSelections}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {options.map((practice) => (
              <div key={practice.id} className="p-4 bg-gray-50 border border-gray-300 rounded-lg shadow-sm">
                <label className="flex items-center mb-2 font-bold text-gray-800 text-left">
                  <input
                    type="checkbox"
                    checked={isPracticeSelected(practice)}
                    onChange={() => togglePractice(practice)}
                    className="mr-2"
                  />
                  <span className="flex-grow text-left">{practice.practice_name}</span>
                </label>
                <div className="ml-4">
                  {practice.specializations.map((specialization) => (
                    <label key={specialization.id} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        checked={selectedSpecializations.includes(specialization.id)}
                        onChange={() => toggleSpecialization(specialization.id, practice)}
                        className="mr-2"
                      />
                      <span className="flex-grow text-left">{specialization.specialization_name}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkboxes;