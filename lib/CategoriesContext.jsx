'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const CategoriesContext = createContext([])

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]))
  }, [])

  return (
    <CategoriesContext.Provider value={categories}>
      {children}
    </CategoriesContext.Provider>
  )
}

export function useCategories() {
  return useContext(CategoriesContext)
}