
interface Message {
    text: string;
    isAdmin: boolean;
    timestamp: string;
}

export interface ConversationSchema{
    sessionID: string,
    messages: Message[],
}

export interface MessageFormat {
    text: string;
    isAdmin: boolean;
    timestamp: Date;

    
} 

export interface UserMessageSchema {
    usertext: string,
}

export interface ChatboxProps {
    updateMessageBoxActive: React.Dispatch<React.SetStateAction<boolean>>,
    conversation: ConversationSchema,
    sendMessage: (message: string) => void,
}
