import React, { useState, useEffect, useRef } from 'react'
import ChatMessage from './components/ChatMessage'
import SearchInput from './components/SearchInput'
import { searchBooks, searchAuthors } from './services/api'
import type { Book, Author, Message } from './types'

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // 初期メッセージを表示
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: 'どんな情報から調べたいかを教えてください（作品名・作者など）',
        timestamp: new Date(),
      },
    ])
  }, [])

  useEffect(() => {
    // メッセージが追加されたらスクロール
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSearch = async (query: string) => {
    if (!query.trim()) return

    // ユーザーメッセージを追加
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
      timestamp: new Date(),
    }
    setMessages((prev: Message[]) => [...prev, userMessage])
    setIsLoading(true)

    try {
      // 作品検索
      const booksResponse = await searchBooks(query)
      const books: Book[] = booksResponse.books || []

      // 作者検索
      const authorsResponse = await searchAuthors(query)
      const authors: Author[] = authorsResponse.authors || []

      // 検索結果メッセージを作成
      let resultContent = ''

      if (books.length > 0) {
        resultContent += `📚 作品が見つかりました（${books.length}件）:\n\n`
        books.slice(0, 5).forEach((book, index) => {
          resultContent += `${index + 1}. **${book.title}**\n`
          resultContent += `   作者: ${book.author}\n`
          if (book.book_id) {
            resultContent += `   ID: ${book.book_id}\n`
          }
          resultContent += '\n'
        })
        if (books.length > 5) {
          resultContent += `他 ${books.length - 5} 件の作品があります。\n\n`
        }
      }

      if (authors.length > 0) {
        resultContent += `👤 作者が見つかりました（${authors.length}件）:\n\n`
        authors.slice(0, 5).forEach((author, index) => {
          resultContent += `${index + 1}. **${author.name}**\n`
          if (author.name_yomi) {
            resultContent += `   読み: ${author.name_yomi}\n`
          }
          resultContent += '\n'
        })
        if (authors.length > 5) {
          resultContent += `他 ${authors.length - 5} 人の作者がいます。\n\n`
        }
      }

      if (books.length === 0 && authors.length === 0) {
        resultContent = '検索結果が見つかりませんでした。別のキーワードで検索してみてください。'
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: resultContent,
        timestamp: new Date(),
        books: books.slice(0, 5),
        authors: authors.slice(0, 5),
      }

      setMessages((prev: Message[]) => [...prev, botMessage])
    } catch (error) {
      console.error('検索エラー:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: '検索中にエラーが発生しました。もう一度お試しください。',
        timestamp: new Date(),
      }
      setMessages((prev: Message[]) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">青空文庫検索システム</h1>
      </header>

      {/* チャットエリア */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message: Message) => {
          // @ts-ignore - key is a special React prop, not part of component props
          return <ChatMessage key={message.id} message={message} />;
        })}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-4 shadow-md max-w-md">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' } as React.CSSProperties}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' } as React.CSSProperties}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 入力エリア */}
      <div className="border-t bg-white p-4">
        <SearchInput onSearch={handleSearch} disabled={isLoading} />
      </div>
    </div>
  )
}

export default App

