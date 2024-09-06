import {Stack} from "@mui/material";
import {ReactNode} from "react";

interface SectionContainerProps {
    children: ReactNode;
}

function SectionContainer({children}: SectionContainerProps) {
    return (
            <Stack mt={5} mb={15}>
                {children}
            </Stack>
    )
}

export default SectionContainer;