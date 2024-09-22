import {Stack} from "@mui/material";
import {ReactNode} from "react";

interface SectionContainerProps {
    children: ReactNode;
}

function SectionContainer({children}: SectionContainerProps) {
    return (
            <Stack maxWidth={'md'} sx={{margin: 'auto', overflowX: 'hidden', width: '100%'}}
                   justifyContent={'center'}>
                {children}
            </Stack>
    )
}

export default SectionContainer;
