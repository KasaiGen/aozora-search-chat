import axios from 'axios'
import type { Book, Author } from '../types'

const API_BASE_URL = '/api'

export async function searchBooks(query: string): Promise<{ books: Book[] }> {
    const response = await axios.get(`${API_BASE_URL}/search/books`, {
        params: { q: query },
    })
    return response.data
}

export async function searchAuthors(query: string): Promise<{ authors: Author[] }> {
    const response = await axios.get(`${API_BASE_URL}/search/authors`, {
        params: { q: query },
    })
    return response.data
}

export async function getBookById(id: string): Promise<{ book: Book }> {
    const response = await axios.get(`${API_BASE_URL}/books/${id}`)
    return response.data
}

