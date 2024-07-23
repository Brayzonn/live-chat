// import { MessageFormat } from "./Types";

export const formatMessageTimestamp = (timestamp: string): string => {
    const messageDate = new Date(timestamp);
    return messageDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
};


export const formatDateHeader = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { 
        weekday: 'short', 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
};


export const getDateHeader = (currentDate: string, lastDate: string): boolean => {
    return currentDate !== lastDate;
};