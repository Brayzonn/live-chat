

interface Message {
    text: string;
    isAdmin: boolean;
    timestamp: Date;
}

export interface ConversationSchema{
    sessionID: string,
    messages: Message[],
}
