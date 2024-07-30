import { Box, Stack,Typography } from "@mui/material";

const items = ['tomato', 'balls', 'dollars', 'cheeks','tomato', 'balls', 'dollars']
export default function Home() {
  return (
    <Box
      height="100vh"
      width= "100vw"
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      flexDirection={"column"}
      gap={4}
      
    >
      <Box
        sx={{ border: '2px solid black' }}>
        <Box width="600px" height="70px">
          <Typography variant="h2" bgcolor={"#ADD8E6"} textAlign={"center"}>Pantry items</Typography>
        </Box>
        <Stack width="600px" height="200px" spacing={2} overflow={'auto'}>
          {items.map((i) => (
            <Box 
              key={1}
              width="100%"
              height="200px"
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              bgcolor={"#f0f0f0"}>
                <Typography variant="h3">{i.charAt(0).toUpperCase() + i.slice(1)}</Typography> 
            </Box>)
          )}
        </Stack>
      </Box>    
    </Box>
  );
}
