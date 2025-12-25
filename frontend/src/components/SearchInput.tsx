import { useState } from 'react'
import type React from 'react'

interface SearchInputProps {
    onSearch: (query: string) => void
    disabled?: boolean
}

export default function SearchInput({ onSearch, disabled }: SearchInputProps) {
    const [query, setQuery] = useState('')

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (query.trim() && !disabled) {
            onSearch(query.trim())
            setQuery('')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
            type="text"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            placeholder="作品名や作者名を入力..."
            disabled={disabled}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
            type="submit"
            disabled={disabled || !query.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
            検索
        </button>
        </form>
    )
}

