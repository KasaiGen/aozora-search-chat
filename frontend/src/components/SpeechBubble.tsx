interface SpeechBubbleProps {
  children: React.ReactNode
  isUser?: boolean
  className?: string
}

export default function SpeechBubble({ children, isUser = false, className }: SpeechBubbleProps) {
    const classNameStr = className ?? ''
    
    return (
        <div className={`speechBubble ${isUser ? 'user' : ''} ${classNameStr}`}>
        {children}
        </div>
    )
}

