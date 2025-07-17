import React, { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import adminApi from '../../config/adminAxios';
import toast from 'react-hot-toast';

const AdminSettingsPage = () => {
  const { settings, loading, error, setSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  useEffect(() => {
    const fetchAllSettings = async () => {
      try {
        setPageLoading(true);
        const response = await adminApi.get('/settings');
        if (response.data && response.data.status === 'success') {
          const fetchedSettings = {};
          response.data.data.settings.forEach(setting => {
            fetchedSettings[setting.key] = setting.value;
          });
          setLocalSettings(fetchedSettings);
          setSettings(fetchedSettings); // Update global context
        }
      } catch (err) {
        console.error('Error fetching all settings for admin page:', err);
        setPageError(err.message);
      } finally {
        setPageLoading(false);
      }
    };

    fetchAllSettings();
  }, []);

  useEffect(() => {
    // Update local settings if global settings change (e.g., via Socket.IO)
    if (!pageLoading && !pageError) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (key) => {
    setIsSaving(true);
    try {
      const response = await adminApi.patch(`/settings/${key}`, {
        value: localSettings[key],
      });
      if (response.data.status === 'success') {
        toast.success(`${key} setting updated!`);
      } else {
        toast.error(`Failed to update ${key} setting.`);
      }
    } catch (err) {
      console.error(`Error updating ${key} setting:`, err);
      toast.error(`Error updating ${key} setting: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (pageLoading) {
    return <div className="text-white text-center py-8">Loading settings...</div>;
  }

  if (pageError) {
    return <div className="text-red-500 text-center py-8">Error loading settings: {pageError}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-6">Admin Settings</h1>
      <div className="space-y-6">
        {Object.keys(localSettings).length === 0 && (
          <p className="text-gray-400">No settings found. Add some default settings in your database or through an initial setup script.</p>
        )}
        {Object.keys(localSettings).map(key => {
          const value = localSettings[key];
          let inputType = "text";
          if (typeof value === "boolean") {
            inputType = "checkbox";
          } else if (key.includes("Email") || key.includes("social")) {
            inputType = "url";
          } else if (key.includes("Cost") || key.includes("Rate") || key.includes("Amount") || key.includes("Threshold") || key.includes("Discount")) {
            inputType = "number";
          }

          const labelText = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

          return (
            <div key={key} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-700 rounded-md">
              <label htmlFor={key} className="text-white text-lg font-medium mb-2 sm:mb-0 sm:w-1/3">
                {labelText}:
              </label>
              {inputType === "checkbox" ? (
                <input
                  type="checkbox"
                  id={key}
                  name={key}
                  checked={value === 'true' || value === true}
                  onChange={(e) => handleChange({ target: { name: key, value: e.target.checked ? 'true' : 'false' } })}
                  className="form-checkbox h-6 w-6 text-indigo-600 bg-gray-900 border-gray-600 rounded focus:ring-indigo-500"
                />
              ) : (
                <input
                  type={inputType}
                  id={key}
                  name={key}
                  value={value || ''}
                  onChange={handleChange}
                  className="flex-1 p-2 rounded-md bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:mr-4"
                />
              )}
              <button
                onClick={() => handleSave(key)}
                disabled={isSaving}
                className="mt-3 sm:mt-0 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSettingsPage;
