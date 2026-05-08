import api from '../../lib/axios'
import { KeyRound, Pencil, Plus, Trash2 } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { useToast } from '../../context/ToastContext'
import AddUserModal from './userModel/AddUserModal'
import EditUserModal from './userModel/EditUserModal'
import ResetPasswordModal from './userModel/ResetPasswordModal'
import DeleteUserModal from './userModel/DeleteUserModal'
import { AuthContext } from '../../context/AuthContext'
import { role_colors } from '../../config/Colors'


const UserManagement = () => {
  const { user, setUser} = useContext(AuthContext);
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast();

  const [addOpen, setAddOpen] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [resetUser, setResetUser] = useState(null)
  const [deleteUser, setDeleteUser] = useState(null)


  useEffect(() => {
    Promise.all([
      api.get('/users'),
      api.get('/roles'),
    ]).then(([usersRes, rolesRes]) => {
      setUsers(usersRes.data)
      setRoles(rolesRes.data)
    }).finally(() => setLoading(false))
  }, [])
  // const role_style = {
  //   Admin: 'bg-purple-50 text-purple-500',
  //   Cashier: 'bg-blue-50 text-blue-500',
  //   Chef: 'bg-orange-50 text-orange-500',
  //   Driver: 'bg-green-50 text-green-500',
  //   Client: 'bg-gray-100 text-gray-500',
  // }

  const [currentPage, setCurrentPage] = useState(1)
  const user_per_page = 5

  const totalPages = Math.ceil(users.length / user_per_page)
  const paginatedUsers = users.slice(
    (currentPage - 1) * user_per_page,
    currentPage * user_per_page
  )


  const handleRoleChange = (userId, roleId) => {
    const prev = [...users]
    setUsers(u => u.map(x => x.id === userId ? { ...x, role_id: roleId, role: roles.find(r => r.id === roleId) } : x));

    api.patch(`/users/${userId}`, { role_id: roleId })
      .then(() => toast({ message: 'Role updated', type: 'success' }))
      .catch(() => { setUsers(prev); toast({ message: 'Failed to update role', type: 'error' }) })
  }


  const handleAdd = (newUser) => {
    setUsers(prev => [...prev, newUser])
    setAddOpen(false)
    setCurrentPage(1)
    toast({ message: 'User created successfully!', type: 'success' })
  }

  const handleEdit = (updated) => {
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u))
    setUser(updated.id===user.id?updated:user);
    setEditUser(null)

    toast({ message: 'User updated successfully!', type: 'success' })
  }

  const handleResetPassword = () => {
    setResetUser(null)
    toast({ message: 'Password reset successfully!', type: 'success' })
  }

  const handleDelete = (id) => {
    if (user.id === id) {
      setDeleteUser(null)
      return toast({ message: 'User can not delete himself!', type: 'error' })
    }
    setUsers(prev => prev.filter(u => u.id !== id))
    setDeleteUser(null)
    setCurrentPage(1)
    toast({ message: 'User Deleted!', type: 'success' })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 w-[80%] mx-auto">
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h3 className="font-bold text-gray-800 text-lg">User Management</h3>
          <p className="text-gray-400 text-sm">{users.length} users total</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 mb-3 px-4 py-2.5 bg-primary-orange hover:bg-primary-orange-dark text-white font-semibold rounded-xl text-sm transition-all cursor-pointer"
        >
          <Plus size={16} />
          Add User
        </button>
      </div>
      {loading ? (
        <p className="text-gray-400 text-sm text-center py-10">Loading users...</p>

      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className='text-left text-xs text-gray-400 font-medium pb-3 pl-2'>User</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-3">Email</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-3">Role</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-3">Joined</th>
                <th className="text-right text-xs text-gray-400 font-medium pb-3 pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedUsers.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 pl-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar_url}
                        alt={u.name}
                        className="w-9 h-9 rounded-xl object-cover border border-gray-100"
                      />
                      <span className="text-sm font-medium text-gray-800">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="text-sm text-gray-500">{u.email}</span>
                  </td>
                  <td className="py-3">
                    <select value={u.role_id}
                      onChange={(e) => handleRoleChange(u.id, parseInt(e.target.value))}
                      className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border-0 outline-none cursor-pointer
                        ${role_colors[u.role?.label] ?? 'bg-gray-100 text-gray-500'}`}
                    >
                      {roles.map(r => (
                        <option key={r.id} value={r.id}>{r.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3">
                    <span className="text-xs text-gray-400">
                      {new Date(u.created_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </span>
                  </td>
                  <td className="py-3 pr-2">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditUser(u)}
                        className="w-8 h-8 cursor-pointer rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-blue-500 text-gray-400 flex items-center justify-center transition-colors"
                      ><Pencil size={14} /></button>

                      <button
                        onClick={() => setResetUser(u)}
                        className="w-8 h-8 cursor-pointer rounded-lg bg-gray-50 hover:bg-orange-50 hover:text-orange-500 text-gray-400 flex items-center justify-center transition-colors"
                      ><KeyRound size={14} /></button>

                      <button
                        onClick={() => setDeleteUser(u)}
                        disabled={u.id === user.id}
                        className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-red-50 hover:text-red-400 text-gray-400 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed "
                      ><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Showing {(currentPage - 1) * user_per_page + 1}–{Math.min(currentPage * user_per_page, users.length)} of {users.length} users
              </p>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => p - 1)}
                  disabled={currentPage === 1}
                  className="w-8 h-8 cursor-pointer rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-500 flex items-center justify-center transition-colors text-sm"
                >‹</button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 cursor-pointer rounded-lg text-sm font-medium transition-colors
            ${currentPage === page
                        ? 'bg-primary-orange text-white'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-500'}`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 cursor-pointer rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-500 flex items-center justify-center transition-colors text-sm"
                >›</button>
              </div>
            </div>
          )}
        </div>
      )}
      {addOpen && <AddUserModal roles={roles} onAdd={handleAdd} onClose={() => setAddOpen(false)} />}
      {editUser && <EditUserModal user={editUser} roles={roles} onEdit={handleEdit} onClose={() => setEditUser(null)} />}
      {resetUser && <ResetPasswordModal user={resetUser} onSuccess={handleResetPassword} onClose={() => setResetUser(null)} />}
      {deleteUser && <DeleteUserModal user={deleteUser} onDelete={handleDelete} onClose={() => setDeleteUser(null)} />}
    </div>
  )
}

export default UserManagement