import PropTypes from 'prop-types';
import { useState } from 'react';
import { Button } from '../ui';
import { Plus } from 'lucide-react';

const AddUserForm = ({ onSubmitUser }) => {
  const [values, setValues] = useState({ userId: '', name: '', designation: '' });
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const validate = () => {
    const nextErrors = {};

    const userId = values.userId.trim();
    if (!userId) {
      nextErrors.userId = 'Required.';
    } else if (userId.length > 15) {
      nextErrors.userId = 'Max length is 15 characters.';
    } else if (!/^[A-Za-z0-9]+$/.test(userId)) {
      nextErrors.userId = 'Letters and numbers only. No spaces or special characters.';
    }

    const name = values.name.trim().replace(/\s{2,}/g, ' ');
    if (!name) {
      nextErrors.name = 'Required.';
    } else if (name.length > 25) {
      nextErrors.name = 'Max length is 25 characters.';
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      nextErrors.name = 'Letters and spaces only.';
    }

    const designation = values.designation.trim().replace(/\s{2,}/g, ' ');
    if (!designation) {
      nextErrors.designation = 'Required.';
    } else if (designation.length > 20) {
      nextErrors.designation = 'Max length is 20 characters.';
    } else if (!/^[A-Za-z0-9\s]+$/.test(designation)) {
      nextErrors.designation = 'Text and spaces only.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const success = await onSubmitUser({ 
      userId: values.userId.trim(), 
      name: values.name.trim().replace(/\s{2,}/g, ' '), 
      designation: values.designation.trim().replace(/\s{2,}/g, ' ') 
    });
    
    if (success) {
      setValues({ userId: '', name: '', designation: '' });
    }
  };

  return (
    <section className="overflow-hidden rounded-lg border border-industrial-200 bg-white shadow-sm">
      <div className="border-b border-industrial-100 px-4 py-2.5">
        <h2 className="text-base font-bold text-industrial-900">Add User</h2>
      </div>

      <form onSubmit={submit} className="grid gap-4 p-4 sm:grid-cols-4 sm:items-start sm:p-4">
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

        <div className="sm:col-span-1">
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-industrial-500">Full Name</label>
          <input
            type="text"
            value={values.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="Enter user name"
            className={`w-full rounded-md border bg-white px-3 py-1.5 text-sm text-industrial-900 outline-none transition focus:border-industrial-900 focus:ring-1 focus:ring-industrial-900 ${errors.name ? 'border-red-500' : 'border-industrial-200'}`}
          />
          {errors.name && <p className="mt-1 text-[11px] font-medium text-red-500">{errors.name}</p>}
        </div>

        <div className="sm:col-span-1">
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-industrial-500">Designation</label>
          <input
            type="text"
            value={values.designation}
            onChange={(event) => updateField('designation', event.target.value)}
            placeholder="Enter designation"
            className={`w-full rounded-md border bg-white px-3 py-1.5 text-sm text-industrial-900 outline-none transition focus:border-industrial-900 focus:ring-1 focus:ring-industrial-900 ${errors.designation ? 'border-red-500' : 'border-industrial-200'}`}
          />
          {errors.designation && <p className="mt-1 text-[11px] font-medium text-red-500">{errors.designation}</p>}
        </div>

        <div className="sm:col-span-1 pt-5">
          <Button type="submit" label="Submit" icon={Plus} className="w-full h-[34px] text-sm flex items-center justify-center py-0" />
        </div>
      </form>
    </section>
  );
};

AddUserForm.propTypes = { onSubmitUser: PropTypes.func.isRequired };
export default AddUserForm;
