import { Search, Edit2, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../ui';
import AddUserForm from './AddUserForm';

const PAGE_OPTIONS = [10, 20, 50];

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).format(date);
};

const TableSkeleton = () => <div className="space-y-2 p-4 animate-pulse">{[1, 2, 3, 4, 5].map((item) => <div key={item} className="h-10 rounded bg-industrial-100" />)}</div>;

const UserDirectory = ({ users, pagination, loading, error, onRequest }) => {
  const [query, setQuery] = useState('');
  const request = (next) => onRequest({ page: pagination.page, limit: pagination.limit, search: query, ...next });
  const changeSearch = (value) => { setQuery(value); onRequest({ page: 1, limit: pagination.limit, search: value }); };

  return (
    <section className="overflow-hidden rounded-lg border border-industrial-200 bg-white shadow-sm flex flex-col">
      <div className="flex flex-col gap-3 border-b border-industrial-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-industrial-900">User Directory</h2>
          <p className="mt-0.5 text-xs text-industrial-500">Manage and view all registered users</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <label className="relative block sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-industrial-400" size={15} />
            <input 
              value={query} 
              onChange={(event) => changeSearch(event.target.value)} 
              placeholder="Search users..." 
              className="w-full rounded-md border border-industrial-200 py-1.5 pl-9 pr-3 text-sm text-industrial-900 outline-none transition focus:border-industrial-900 focus:ring-1 focus:ring-industrial-900" 
            />
          </label>
          <label className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-industrial-600">
            Show:
            <select 
              value={pagination.limit} 
              onChange={(event) => request({ page: 1, limit: Number(event.target.value) })} 
              className="rounded-md border border-industrial-200 bg-white px-2 py-1 text-sm font-semibold text-industrial-800 outline-none focus:border-industrial-900 focus:ring-1 focus:ring-industrial-900"
            >
              {PAGE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            per page
          </label>
        </div>
      </div>

      {loading ? <TableSkeleton /> : error ? (
        <div className="px-6 py-12 text-center">
          <p className="text-sm font-bold text-industrial-900">Unable to load users</p>
          <p className="mt-1 text-xs text-industrial-500">The user data could not be retrieved.</p>
          <Button label="Retry" variant="secondary" className="mt-4 h-8 text-xs px-4 py-0" onClick={() => request({})} />
        </div>
      ) : users.length ? (
        <>
          <div className="overflow-x-auto flex-1">
            <table className="w-full min-w-[640px] text-left">
              <thead className="bg-industrial-50 text-[10px] font-bold uppercase tracking-wider text-industrial-500">
                <tr>
                  <th className="px-4 py-2.5 w-16">No</th>
                  <th className="px-4 py-2.5">User ID</th>
                  <th className="px-4 py-2.5">Name</th>
                  <th className="px-4 py-2.5">Designation</th>
                  <th className="px-4 py-2.5">Created Date</th>
                  <th className="px-4 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-industrial-100">
                {users.map((user, index) => (
                  <tr key={user.userId} className="text-sm text-industrial-700 hover:bg-industrial-50/70 transition-colors">
                    <td className="whitespace-nowrap px-4 py-2.5 font-medium text-industrial-500">
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 font-bold text-industrial-900">{user.userId}</td>
                    <td className="px-4 py-2.5 font-medium text-industrial-800">{user.name || '—'}</td>
                    <td className="px-4 py-2.5">{user.designation || '—'}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-industrial-600">{formatDate(user.createdDate)}</td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button disabled className="rounded border border-industrial-200 bg-white p-1.5 text-industrial-400 opacity-50 cursor-not-allowed">
                          <Edit2 size={13} />
                        </button>
                        <button disabled className="rounded border border-industrial-200 bg-white p-1.5 text-industrial-400 opacity-50 cursor-not-allowed">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-industrial-100 px-4 py-3 bg-white">
            <p className="text-xs text-industrial-500">
              Showing <span className="font-semibold text-industrial-800">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="font-semibold text-industrial-800">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-semibold text-industrial-800">{pagination.total}</span> entries
            </p>
            <nav className="flex items-center gap-1" aria-label="Pagination">
              <button aria-label="Previous page" disabled={pagination.page === 1} onClick={() => request({ page: pagination.page - 1 })} className="rounded-md border border-industrial-200 bg-white px-2.5 py-1 text-xs font-semibold text-industrial-600 hover:bg-industrial-50 transition-colors disabled:cursor-not-allowed disabled:opacity-40">Prev</button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => request({ page: p })}
                  className={`min-w-[28px] rounded-md border px-2 py-1 text-center text-xs font-semibold transition-colors ${pagination.page === p ? 'border-industrial-900 bg-industrial-900 text-white' : 'border-industrial-200 bg-white text-industrial-600 hover:bg-industrial-50'}`}
                >
                  {p}
                </button>
              ))}
              <button aria-label="Next page" disabled={pagination.page === pagination.totalPages} onClick={() => request({ page: pagination.page + 1 })} className="rounded-md border border-industrial-200 bg-white px-2.5 py-1 text-xs font-semibold text-industrial-600 hover:bg-industrial-50 transition-colors disabled:cursor-not-allowed disabled:opacity-40">Next</button>
            </nav>
          </div>
        </>
      ) : (
        <div className="px-6 py-12 text-center">
          <p className="text-sm font-bold text-industrial-900">{query ? 'No users found' : 'No users available'}</p>
          <p className="mt-1 text-xs text-industrial-500">{query ? 'Try a different search term.' : 'There are currently no users configured.'}</p>
        </div>
      )}
    </section>
  );
};

const UserManagement = ({ users, pagination, loading, error, onRequestUsers, onCreateUser }) => {
  const handleCreateUser = async (payload) => {
    try {
      const result = await onCreateUser([payload]);
      if (result.failedCount > 0) {
        toast.error('A user with this ID may already exist');
        return false;
      } else {
        toast.success('User created successfully');
        return true;
      }
    } catch (createError) {
      toast.error(createError?.message || 'Unable to create user');
      return false;
    }
  };

  return (
    <div className="w-full space-y-5">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-widest text-industrial-500">Home / Users</p>
        <h1 className="mt-1.5 text-2xl font-black tracking-tight text-industrial-900 sm:text-3xl">Users</h1>
        <p className="mt-1 text-sm text-industrial-500">Create and manage system users</p>
      </header>

      <AddUserForm onSubmitUser={handleCreateUser} />

      <UserDirectory users={users} pagination={pagination} loading={loading} error={error} onRequest={onRequestUsers} />
    </div>
  );
};

const userShape = PropTypes.shape({ userId: PropTypes.string.isRequired, name: PropTypes.string.isRequired, designation: PropTypes.string.isRequired, createdDate: PropTypes.string });
const paginationShape = PropTypes.shape({ page: PropTypes.number.isRequired, limit: PropTypes.number.isRequired, total: PropTypes.number.isRequired, totalPages: PropTypes.number.isRequired });
UserDirectory.propTypes = { users: PropTypes.arrayOf(userShape).isRequired, pagination: paginationShape.isRequired, loading: PropTypes.bool.isRequired, error: PropTypes.bool.isRequired, onRequest: PropTypes.func.isRequired };
UserManagement.propTypes = { users: PropTypes.arrayOf(userShape).isRequired, pagination: paginationShape.isRequired, loading: PropTypes.bool.isRequired, error: PropTypes.bool.isRequired, onRequestUsers: PropTypes.func.isRequired, onCreateUser: PropTypes.func.isRequired };
export default UserManagement;
