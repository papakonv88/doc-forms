import {Box} from "@mui/material";
import {ReactNode} from "react";

interface PageContainerProps {
    children: ReactNode;
}

function PageContainer({children}: PageContainerProps) {
    return (
        <Box display={'flex'} flexDirection={'column'} maxWidth={'xl'} sx={{ margin: 'auto', overflowX: 'hidden' }} justifyContent={'center'}>
            {children}
        </Box>
    )
}

export default PageContainer;