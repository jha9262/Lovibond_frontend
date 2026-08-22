import PropTypes from 'prop-types';
import { useState } from 'react';
import { Button } from '../ui';
import { Plus } from 'lucide-react';

const AddSampleForm = ({ onSubmitSample }) => {
  const [values, setValues] = useState({ sampleId: '', userId: '' });
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    const sampleId = values.sampleId.trim();
    if (!sampleId) {
      nextErrors.sampleId = 'Required.';
    } else if (!/^[A-Za-z0-9]+$/.test(sampleId)) {
      nextErrors.sampleId = 'Sample ID can contain only letters and numbers. Spaces and special characters are not allowed.';
    }

    if (!values.userId.trim()) nextErrors.userId = 'Required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const success = await onSubmitSample({ 
      sampleId: values.sampleId.trim(), 
      userId: values.userId.trim() 
    });
    
    if (success) {
      setValues({ sampleId: '', userId: '' });
    }
  };

  return (
    <section className="overflow-hidden rounded-lg border border-industrial-200 bg-white shadow-sm">
      <div className="border-b border-industrial-100 px-4 py-2.5">
        <h2 className="text-base font-bold text-industrial-900">Add Sample</h2>
      </div>

      <form onSubmit={submit} className="grid gap-4 p-4 sm:grid-cols-3 sm:items-start sm:p-4">
        <div className="sm:col-span-1">
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-industrial-500">Sample ID</label>
          <input
            type="text"
            value={values.sampleId}
            onChange={(event) => updateField('sampleId', event.target.value)}
            placeholder="Enter sample ID"
            className={`w-full rounded-md border bg-white px-3 py-1.5 text-sm text-industrial-900 outline-none transition focus:border-industrial-900 focus:ring-1 focus:ring-industrial-900 ${errors.sampleId ? 'border-red-500' : 'border-industrial-200'}`}
          />
          {errors.sampleId && <p className="mt-1 text-[11px] font-medium text-red-500">{errors.sampleId}</p>}
        </div>

        <div className="sm:col-span-1">
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-industrial-500">User ID</label>
          <input
            type="text"
            value={values.userId}
            onChange={(event) => updateField('userId', event.target.value)}
            placeholder="Enter user ID"
            className={`w-full rounded-md border bg-white px-3 py-1.5 text-sm text-industrial-900 outline-none transition focus:border-industrial-900 focus:ring-1 focus:ring-industrial-900 ${errors.userId ? 'border-red-500' : 'border-industrial-200'}`}
          />
          {errors.userId && <p className="mt-1 text-[11px] font-medium text-red-500">{errors.userId}</p>}
        </div>

        <div className="sm:col-span-1 pt-5">
          <Button type="submit" label="Submit" icon={Plus} className="w-full h-[34px] text-sm flex items-center justify-center py-0" />
        </div>
      </form>
    </section>
  );
};

AddSampleForm.propTypes = { onSubmitSample: PropTypes.func.isRequired };
export default AddSampleForm;
