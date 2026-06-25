import React, { useEffect, useState } from 'react'
import api from '../../lib/axios'
import * as Icons from 'lucide-react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import AddCategoryModal from './categoryModel/AddCategoryModal'
import EditCategoryModal from './categoryModel/EditCategoryModal'
import DeleteCategoryModal from './categoryModel/DeleteCategoryModal'
// import EditCategoryModal from './categoryModel/EditCategoryModal'
// import DeleteCategoryModal from './categoryModel/DeleteCategoryModal'

const CategoriesSettings = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [editCategory, setEditCategory] = useState(null)
  const [deleteCategory, setDeleteCategory] = useState(null)
  const { toast } = useToast()
  const [currentPage, setCurrentPage] = useState(1)
  const categories_per_page = 6

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data))
      .finally(() => setLoading(false))
  }, [])

  const totalPages = Math.ceil(categories.length / categories_per_page)
  const paginated = categories.slice(
    (currentPage - 1) * categories_per_page,
    currentPage * categories_per_page
  )

  const handleAdd = (newCategory) => {
    setCategories(prev => [...prev, newCategory])
    setAddOpen(false)
    toast({ message: 'Category added!', type: 'success' })
  }

  const handleEdit = (updated) => {
    setCategories(prev => prev.map(c => c.id === updated.id ? updated : c))
    setEditCategory(null)
    toast({ message: 'Category updated!', type: 'success' })
  }

  const handleDelete = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id))
    setDeleteCategory(null)
    // toast({ message: 'Category deleted!', type: 'success' })
  }

  const handleDeleteClick = (category) => {
    if ((category.products_count ?? category.product_count) > 0) {
      toast({
        message: `Cannot delete "${category.name}" — it has ${category.products_count ?? category.product_count} products.`,
        type: 'error'
      })
      return
    }
    setDeleteCategory(category)
  }
  console.log(categories)
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6  mx-auto">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-gray-800 text-lg">Category Management</h3>
          <p className="text-gray-400 text-sm">{categories.length} categories total</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-orange hover:bg-primary-orange-dark text-white font-semibold rounded-xl text-sm transition-all cursor-pointer"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm text-center py-10">Loading categories...</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs text-gray-400 font-medium pb-3 pl-2">Icon</th>
              <th className="text-left text-xs text-gray-400 font-medium pb-3">Name</th>
              <th className="text-left text-xs text-gray-400 font-medium pb-3">Products</th>
              <th className="text-right text-xs text-gray-400 font-medium pb-3 pr-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginated.map(c => {
              const Icon = Icons[c.icon] ?? Icons['UtensilsIcon']
              return (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">

                  <td className="py-3 pl-2">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                      <Icon size={18} className="text-primary-orange" />
                    </div>
                  </td>

                  <td className="py-3">
                    <span className="text-sm font-medium text-gray-800">{c.name}</span>
                  </td>

                  <td className="py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium
                      ${(c.products_count ?? c.product_count) > 0
                        ? 'bg-blue-50 text-blue-500'
                        : 'bg-gray-100 text-gray-400'}`}>
                      {c.products_count ?? c.product_count ?? 0} products
                    </span>
                  </td>

                  <td className="py-3 pr-2">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditCategory(c)}
                        className="w-8 h-8 cursor-pointer rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-blue-500 text-gray-400 flex items-center justify-center transition-colors"
                      ><Pencil size={14} /></button>

                      <button
                        onClick={() => handleDeleteClick(c)}
                        className="w-8 h-8 cursor-pointer rounded-lg bg-gray-50 hover:bg-red-50 hover:text-red-400 text-gray-400 flex items-center justify-center transition-colors"
                      ><Trash2 size={14} /></button>
                    </div>
                  </td>

                </tr>
              )
            })}

          </tbody>
        </table>

      )}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {(currentPage - 1) * categories_per_page + 1}–{Math.min(currentPage * categories_per_page, categories.length)} of {categories.length} categories
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
              className="w-8 h-8 cursor-pointer rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-500 flex items-center justify-center text-sm"
            >‹</button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 cursor-pointer rounded-lg text-sm font-medium transition-colors
                      ${currentPage === page
                    ? 'bg-primary-orange text-white'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-500'}`}
              >{page}</button>
            ))}

            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages}
              className="w-8 h-8 cursor-pointer rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-500 flex items-center justify-center text-sm"
            >›</button>
          </div>
        </div>
      )}
      {addOpen && <AddCategoryModal onAdd={handleAdd} categories={categories} onClose={() => setAddOpen(false)} />}
      {editCategory && <EditCategoryModal category={editCategory} categories={categories} onEdit={handleEdit} onClose={() => setEditCategory(null)} />}
      {deleteCategory && <DeleteCategoryModal category={deleteCategory} onDelete={handleDelete} onClose={() => setDeleteCategory(null)} />}

    </div>
  )
}

export default CategoriesSettings

// import React, { useMemo, useState } from "react";
// import { icons, Search } from "lucide-react";

// export default function CategoriesSettings() {
//   const [query, setQuery] = useState("");

//   const iconNames = Object.keys(icons);

//   const filteredIcons = useMemo(() => {
//     return iconNames.filter((name) =>
//       name.toLowerCase().includes(query.toLowerCase())
//     );
//   }, [query, iconNames]);

//   return (
//     <div className="min-h-screen bg-zinc-950 text-white p-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold text-center mb-6">
//           Lucide Icon Search
//         </h1>

//         {/* Search */}
//         <div className="relative mb-8">
//           <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400" />
//           <input
//             type="text"
//             placeholder="Search icons..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500"
//           />
//         </div>

//         {/* Grid */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
//           {filteredIcons.map((name) => {
//             const Icon = icons[name];

//             return (
//               <div
//                 key={name}
//                 onClick={() => navigator.clipboard.writeText(name)}
//                 className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center gap-3 hover:border-blue-500 cursor-pointer transition"
//               >
//                 <Icon size={28} />
//                 <span className="text-xs text-center">{name}</span>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }