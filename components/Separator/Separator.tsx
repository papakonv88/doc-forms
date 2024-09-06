import {Box} from "@mui/material";
import {tokens} from "../../styles/tokens";

function Separator() {
    return (
        <Box width={'100%'} sx={{ height: 10, backgroundColor: tokens.colors.border }} />
    )
}

export default Separator