import React from 'react'
import type { Message } from '../types'

interface ChatMessageProps {
    message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.type === 'user'

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div
            className={`rounded-lg p-4 shadow-md max-w-md ${
            isUser
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-800'
            }`}
        >
            <div className="whitespace-pre-wrap">{message.content}</div>
            
            {/* 作品リストの表示 */}
            {message.books && message.books.length > 0 && (
            <div className="mt-4 space-y-2">
                {message.books.map((book) => (
                <div
                    key={book.book_id || book.title}
                    className="p-2 bg-gray-100 rounded text-sm"
                >
                    <div className="font-semibold">{book.title}</div>
                    <div className="text-gray-600">作者: {book.author}</div>
                </div>
                ))}
            </div>
            )}

            {/* 作者リストの表示 */}
            {message.authors && message.authors.length > 0 && (
            <div className="mt-4 space-y-2">
                {message.authors.map((author) => (
                <div
                    key={author.person_id || author.name}
                    className="p-2 bg-gray-100 rounded text-sm"
                >
                    <div className="font-semibold">{author.name}</div>
                    {author.name_yomi && (
                    <div className="text-gray-600">読み: {author.name_yomi}</div>
                    )}
                </div>
                ))}
            </div>
            )}

            <div
            className={`text-xs mt-2 ${
                isUser ? 'text-blue-100' : 'text-gray-500'
            }`}
            >
            {message.timestamp.toLocaleTimeString('ja-JP', {
                hour: '2-digit',
                minute: '2-digit',
            })}
            </div>
        </div>
        </div>
    )
}

