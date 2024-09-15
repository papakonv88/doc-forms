import {Box} from "@mui/material";
import {createContext, ReactNode, useState} from "react";
import InfoMessages from "../../General/InfoMessages/InfoMessages";
import Loader from "../../General/Loader/Loader";
import {useAppContext} from "../../../context";

interface PageContainerProps {
    children: ReactNode;
}


export const AppContext = createContext(null);

function PageContainer({children}: PageContainerProps) {
    const { handleClose, isOpen, message, type, isLoading } = useAppContext();

    return (
            <Box display={'flex'} flexDirection={'column'} maxWidth={'md'} sx={{margin: 'auto', overflowX: 'hidden'}}
                 justifyContent={'center'}>
                {children}
                <InfoMessages isOpen={isOpen} message={message} type={type} handleClose={handleClose}/>
                <Loader open={isLoading}/>
            </Box>
    )
}

export default PageContainer;
