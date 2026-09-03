import PropTypes from 'prop-types';
import { useState } from 'react';
import { Button } from '../ui';
import { Plus } from 'lucide-react';

const AddUserForm = ({ onSubmitUser }) => {
  const [values, setValues] = useState({ userId: '', name: '', designation: '', password: '' });
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const handleUserIdChange = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9\-,]/g, '');
    updateField('userId', val.substring(0, 15));
  };

  const handleNameChange = (e) => {
    const val = e.target.value.replace(/[^A-Za-z\s]/g, '');
    updateField('name', val.substring(0, 25));
  };

  const handleDesignationChange = (e) => {
    const val = e.target.value.replace(/[^A-Za-z\s]/g, '');
    updateField('designation', val.substring(0, 25));
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value.replace(/[^A-Za-z0-9\-]/g, '');
    updateField('password', val.substring(0, 16));
  };

  const validate = () => {
    const nextErrors = {};

    const userId = values.userId;
    if (!userId) {
      nextErrors.userId = 'Required.';
    } else if (userId.length > 15) {
      nextErrors.userId = 'Max length is 15 characters.';
    } else if (!/^[A-Z0-9\-,]+$/.test(userId)) {
      nextErrors.userId = 'Only uppercase letters, numbers, hyphen, and comma allowed.';
    }

    const name = values.name;
    if (!name.trim()) {
      nextErrors.name = 'Required.';
    } else if (name.length > 25) {
      nextErrors.name = 'Max length is 25 characters.';
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      nextErrors.name = 'Letters and spaces only.';
    }

    const designation = values.designation;
    if (!designation.trim()) {
      nextErrors.designation = 'Required.';
    } else if (designation.length > 25) {
      nextErrors.designation = 'Max length is 25 characters.';
    } else if (!/^[A-Za-z\s]+$/.test(designation)) {
      nextErrors.designation = 'Letters and spaces only.';
    }

    const password = values.password;
    if (!password) {
      nextErrors.password = 'Required.';
    } else if (password.length > 16) {
      nextErrors.password = 'Max 16 characters.';
    } else if (!/^[A-Za-z0-9\-]+$/.test(password)) {
      nextErrors.password = 'Letters, numbers, and hyphen only.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const success = await onSubmitUser({ 
      userId: values.userId, 
      name: values.name.trim().replace(/\s{2,}/g, ' '), 
      designation: values.designation.trim().replace(/\s{2,}/g, ' '),
      password: values.password
    });
    
    if (success) {
      setValues({ userId: '', name: '', designation: '', password: '' });
    }
  };

  return (
    <section className="overflow-hidden rounded-lg border border-industrial-200 bg-white shadow-sm">
      <div className="border-b border-industrial-100 px-4 py-2.5">
        <h2 className="text-base font-bold text-industrial-900">Add User</h2>
      </div>

      <form onSubmit={submit} className="grid gap-4 p-4 sm:grid-cols-5 sm:items-start sm:p-4">
        <div className="sm:col-span-1">
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-industrial-500">User ID</label>
          <input
            type="text"
            value={values.userId}
            onChange={handleUserIdChange}
            placeholder="Enter user ID"
            className={`w-full rounded-md border bg-white px-3 py-1.5 text-sm text-industrial-900 outline-none transition focus:border-industrial-900 focus:ring-1 focus:ring-industrial-900 ${errors.userId ? 'border-red-500' : 'border-industrial-200'}`}
          />
          {errors.userId && <p className="mt-1 text-[11px] font-medium text-red-500">{errors.userId}</p>}
        </div>

        <div className="sm:col-span-1">
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-industrial-500">User Name</label>
          <input
            type="text"
            value={values.name}
            onChange={handleNameChange}
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
            onChange={handleDesignationChange}
            placeholder="Enter designation"
            className={`w-full rounded-md border bg-white px-3 py-1.5 text-sm text-industrial-900 outline-none transition focus:border-industrial-900 focus:ring-1 focus:ring-industrial-900 ${errors.designation ? 'border-red-500' : 'border-industrial-200'}`}
          />
          {errors.designation && <p className="mt-1 text-[11px] font-medium text-red-500">{errors.designation}</p>}
        </div>

        <div className="sm:col-span-1">
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-industrial-500">Password</label>
          <input
            type="password"
            value={values.password}
            onChange={handlePasswordChange}
            placeholder="Enter password"
            className={`w-full rounded-md border bg-white px-3 py-1.5 text-sm text-industrial-900 outline-none transition focus:border-industrial-900 focus:ring-1 focus:ring-industrial-900 ${errors.password ? 'border-red-500' : 'border-industrial-200'}`}
          />
          {errors.password && <p className="mt-1 text-[11px] font-medium text-red-500">{errors.password}</p>}
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
