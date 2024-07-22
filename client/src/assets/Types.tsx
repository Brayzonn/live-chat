
interface Message {
    text: string;
    isAdmin: boolean;
    timestamp: String;
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
