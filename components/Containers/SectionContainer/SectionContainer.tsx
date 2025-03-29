import {Stack} from "@mui/material";

function SectionContainer({children, ...props}: any) {
    return (
            <Stack {...props} maxWidth={'lg'} sx={{margin: 'auto', overflowX: 'hidden', width: '100%'}}
                   justifyContent={'center'}>
                {children}
            </Stack>
    )
}

export default SectionContainer;
