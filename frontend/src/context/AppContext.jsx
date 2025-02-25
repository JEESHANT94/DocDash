import { createContext } from "react";
import { topDoctors } from "../assets/assets";


export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const currencySymbol = '$'
    const value = {
        topDoctors,
        currencySymbol
    };

    return (
        <AppContext.Provider value={value}>
            {children}

        </AppContext.Provider>
    );
};

export default AppContextProvider;
