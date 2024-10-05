import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext<any | null>(null);

export const AppProvider = ({ children }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('info');
    const [isLoading, setIsLoading] = useState(false);
    const handleClose = () => {
        setIsOpen(false)
    }

    const handleOpenSnackbar = (message: string, type: string) => {
        setMessage(message);
        setType(type);
        setIsOpen(true);
    };

    const handleLoader = (val: boolean) => {
        setIsLoading(val);
    }

    return (
        <AppContext.Provider value={{ handleOpenSnackbar, handleLoader, handleClose, isOpen, message, type, isLoading }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext<any>(AppContext);
