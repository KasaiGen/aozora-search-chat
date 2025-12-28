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
        content: 'どんな情報から調べたいか教えてください\n(作品名・作者など)',
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

      // 検索結果メッセージを作成（作品と作者を別々のメッセージとして追加）
      const newMessages: Message[] = []
      let messageIdCounter = Date.now() + 1

      // 作品が見つかった場合
      if (books.length > 0) {
        let booksContent = `作品が見つかりました（${books.length}件）:\n\n`
        books.forEach((book, index) => {
          booksContent += `${index + 1}. ${book.title}\n`
          booksContent += `   作者: ${book.author}\n`
          if (book.book_id) {
            booksContent += `   ID: ${book.book_id}\n`
          }
          booksContent += '\n'
        })

        newMessages.push({
          id: messageIdCounter.toString(),
          type: 'bot',
          content: booksContent,
          timestamp: new Date(),
          books: books,
        })
        messageIdCounter++
      }

      // 作者が見つかった場合
      if (authors.length > 0) {
        let authorsContent = `作者が見つかりました（${authors.length}件）:\n\n`
        authors.forEach((author, index) => {
          authorsContent += `${index + 1}. ${author.name}\n`
          if (author.name_yomi) {
            authorsContent += `   読み: ${author.name_yomi}\n`
          }
          authorsContent += '\n'
        })

        newMessages.push({
          id: messageIdCounter.toString(),
          type: 'bot',
          content: authorsContent,
          timestamp: new Date(),
          authors: authors,
        })
        messageIdCounter++
      }

      // 両方とも見つからなかった場合
      if (books.length === 0 && authors.length === 0) {
        newMessages.push({
          id: messageIdCounter.toString(),
          type: 'bot',
          content: '検索結果が見つかりませんでした。別のキーワードで検索してみてください。',
          timestamp: new Date(),
        })
      }

      setMessages((prev: Message[]) => [...prev, ...newMessages])
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
      <header className="bg-blue-600 text-white p-5 shadow-md">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">青空文庫検索システム</h1>
          <p className="text-blue-100 text-sm mt-1">作品や作者を検索できます</p>
        </div>
      </header>

      {/* チャットエリア */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {messages.map((message: Message) => {
            return <ChatMessage key={message.id} message={message} />;
          })}
          {isLoading && (
            <div className="flex items-end mb-4">
              <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-lg border border-gray-200">
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
      </div>

      {/* 入力エリア */}
      <div className="border-t border-gray-200 bg-white p-4 shadow-md">
        <div className="max-w-4xl mx-auto">
          <SearchInput onSearch={handleSearch} disabled={isLoading} />
        </div>
      </div>
    </div>
  )
}

export default App

