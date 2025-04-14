import React, { createContext, useState, useContext } from "react";

interface UserContextType {
    user: any; // Replace 'any' with a specific type if known
    setUser: React.Dispatch<React.SetStateAction<any>>; // Replace 'any' with the same type as 'user'
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
