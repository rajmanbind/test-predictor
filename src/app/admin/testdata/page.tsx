'use client';
import { useState, useEffect, SetStateAction } from 'react';

const DynamicForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    itemType: '', // 'all-india' or 'state'
    state: '',
    quota: '',
    subQuota: '',
    category: '',
    subCategory: ''
  });

  // Available options
  const [states, setStates] = useState<{id: string, name: string}[]>([]);
  const [quotas, setQuotas] = useState<{id: string, name: string}[]>([]);
  const [subQuotas, setSubQuotas] = useState<{id: string, name: string}[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [subCategories, setSubCategories] = useState<{id: string, name: string}[]>([]);

  // Fetch states on component mount
  useEffect(() => {
    // In a real app, you would fetch this from an API
    const mockStates = [
      { id: 'maharashtra', name: 'Maharashtra' },
      { id: 'karnataka', name: 'Karnataka' },
      { id: 'tamil-nadu', name: 'Tamil Nadu' },
      { id: 'delhi', name: 'Delhi' },
    ];
    setStates(mockStates);
  }, []);

  // Update quotas when itemType or state changes
  useEffect(() => {
    if (!formData.itemType) return;

    let newQuotas: SetStateAction<{ id: string; name: string; }[]> = [];
    if (formData.itemType === 'all-india') {
      newQuotas = [
        { id: 'ai-general', name: 'General' },
        { id: 'ai-obc', name: 'OBC' },
        { id: 'ai-sc', name: 'SC' },
        { id: 'ai-st', name: 'ST' },
      ];
    } else if (formData.itemType === 'state' && formData.state) {
      newQuotas = [
        { id: `${formData.state}-general`, name: 'General' },
        { id: `${formData.state}-obc`, name: 'OBC' },
        { id: `${formData.state}-sc`, name: 'SC' },
        { id: `${formData.state}-st`, name: 'ST' },
        { id: `${formData.state}-ews`, name: 'EWS' },
      ];
    }

    setQuotas(newQuotas);
    setFormData(prev => ({ ...prev, quota: '', subQuota: '', category: '', subCategory: '' }));
  }, [formData.itemType, formData.state]);

  // Update sub-quotas when quota changes
  useEffect(() => {
    if (!formData.quota) {
      setSubQuotas([]);
      return;
    }

    // Only some quotas have sub-quotas
    if (formData.quota.includes('obc') || formData.quota.includes('ews')) {
      setSubQuotas([
        { id: `${formData.quota}-creamy`, name: 'Creamy Layer' },
        { id: `${formData.quota}-non-creamy`, name: 'Non-Creamy Layer' },
      ]);
    } else {
      setSubQuotas([]);
    }

    setFormData(prev => ({ ...prev, subQuota: '', category: '', subCategory: '' }));
  }, [formData.quota]);

  // Update categories when quota or sub-quota changes
  useEffect(() => {
    if (!formData.quota) {
      setCategories([]);
      return;
    }

    let newCategories: SetStateAction<{ id: string; name: string; }[]> = [];
    if (formData.quota.includes('general')) {
      newCategories = [
        { id: 'gen-ur', name: 'Urban' },
        { id: 'gen-rural', name: 'Rural' },
      ];
    } else if (formData.quota.includes('obc')) {
      newCategories = [
        { id: 'obc-ur', name: 'Urban' },
        { id: 'obc-rural', name: 'Rural' },
        { id: 'obc-special', name: 'Special Group' },
      ];
    } else if (formData.quota.includes('sc') || formData.quota.includes('st')) {
      newCategories = [
        { id: 'scst-general', name: 'General' },
        { id: 'scst-women', name: 'Women' },
        { id: 'scst-ph', name: 'Physically Handicapped' },
      ];
    }

    setCategories(newCategories);
    setFormData(prev => ({ ...prev, category: '', subCategory: '' }));
  }, [formData.quota, formData.subQuota]);

  // Update sub-categories when category changes
  useEffect(() => {
    if (!formData.category) {
      setSubCategories([]);
      return;
    }

    // Only some categories have sub-categories
    if (formData.category.includes('special')) {
      setSubCategories([
        { id: 'sub-special-1', name: 'Sub Group 1' },
        { id: 'sub-special-2', name: 'Sub Group 2' },
      ]);
    } else if (formData.category.includes('ph')) {
      setSubCategories([
        { id: 'sub-ph-1', name: 'Blindness' },
        { id: 'sub-ph-2', name: 'Locomotor Disability' },
        { id: 'sub-ph-3', name: 'Hearing Impairment' },
      ]);
    } else {
      setSubCategories([]);
    }

    setFormData(prev => ({ ...prev, subCategory: '' }));
  }, [formData.category]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to an API
    alert('Form submitted successfully!');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Dynamic Form</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Item Type Selection */}
        <div>
          <label htmlFor="itemType" className="block text-sm font-medium text-gray-700">
            Item Type*
          </label>
          <select
            id="itemType"
            name="itemType"
            value={formData.itemType}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Item Type</option>
            <option value="all-india">All India</option>
            <option value="state">State</option>
          </select>
        </div>

        {/* State Selection (only shown when itemType is 'state') */}
        {formData.itemType === 'state' && (
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State*
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select State</option>
              {states.map(state => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Quota Selection (shown when itemType is selected) */}
        {(formData.itemType === 'all-india' || (formData.itemType === 'state' && formData.state)) && (
          <div>
            <label htmlFor="quota" className="block text-sm font-medium text-gray-700">
              Quota*
            </label>
            <select
              id="quota"
              name="quota"
              value={formData.quota}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Quota</option>
              {quotas.map(quota => (
                <option key={quota.id} value={quota.id}>
                  {quota.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sub-Quota Selection (only shown for certain quotas) */}
        {subQuotas.length > 0 && (
          <div>
            <label htmlFor="subQuota" className="block text-sm font-medium text-gray-700">
              Sub Quota
            </label>
            <select
              id="subQuota"
              name="subQuota"
              value={formData.subQuota}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Sub Quota (Optional)</option>
              {subQuotas.map(subQuota => (
                <option key={subQuota.id} value={subQuota.id}>
                  {subQuota.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Category Selection (shown when quota is selected) */}
        {formData.quota && (
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category*
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sub-Category Selection (only shown for certain categories) */}
        {subCategories.length > 0 && (
          <div>
            <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700">
              Sub Category
            </label>
            <select
              id="subCategory"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Sub Category (Optional)</option>
              {subCategories.map(subCat => (
                <option key={subCat.id} value={subCat.id}>
                  {subCat.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={!formData.itemType || !formData.quota || !formData.category}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${(!formData.itemType || !formData.quota || !formData.category) ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default DynamicForm;