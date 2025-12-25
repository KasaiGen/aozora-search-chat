export interface Book {
  book_id?: string
  title: string
  author: string
  author_id?: string
  card_url?: string
  text_url?: string
  html_url?: string
}

export interface Author {
  person_id?: string
  name: string
  name_yomi?: string
  birth_date?: string
  death_date?: string
}

export interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  books?: Book[]
  authors?: Author[]
}

