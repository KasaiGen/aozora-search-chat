import type { Message } from '../types'
import SpeechBubble from './SpeechBubble'

interface ChatMessageProps {
    message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.type === 'user'

    return (
        <div className={`flex items-end mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {/* 吹き出し */}
            <div className="relative max-w-[75%] md:max-w-md">
                <SpeechBubble isUser={isUser}>
                    {/* メッセージ内容 */}
                    <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                    
                    {/* 作品リストの表示 */}
                    {message.books && message.books.length > 0 && (
                        <div className="mt-3 space-y-2">
                            {message.books.map((book, index) => (
                                <div
                                    key={String(book.book_id || book.title || index)}
                                    className={`p-3 rounded-lg text-sm ${
                                        isUser
                                            ? 'bg-blue-400/20'
                                            : 'bg-gray-50 border border-gray-200'
                                    }`}
                                >
                                    <div className={`font-semibold mb-1 ${isUser ? 'text-white' : 'text-gray-900'}`}>
                                        {index + 1}. {book.title}
                                    </div>
                                    <div className={`text-xs ${isUser ? 'text-blue-100' : 'text-gray-600'}`}>
                                        作者: {book.author}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 作者リストの表示 */}
                    {message.authors && message.authors.length > 0 && (
                        <div className="mt-3 space-y-2">
                            {message.authors.map((author, index) => (
                                <div
                                    key={String(author.person_id || author.name || index)}
                                    className={`p-3 rounded-lg text-sm ${
                                        isUser
                                            ? 'bg-blue-400/20'
                                            : 'bg-gray-50 border border-gray-200'
                                    }`}
                                >
                                    <div className={`font-semibold mb-1 ${isUser ? 'text-white' : 'text-gray-900'}`}>
                                        {index + 1}. {author.name}
                                    </div>
                                    {author.name_yomi && (
                                        <div className={`text-xs ${isUser ? 'text-blue-100' : 'text-gray-600'}`}>
                                            読み: {author.name_yomi}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </SpeechBubble>
            </div>
        </div>
    )
}

