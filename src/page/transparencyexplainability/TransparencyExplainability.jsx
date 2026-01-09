import * as React from "react";
import {
  Box,
} from "@mui/material";
import KpiGateRow from "./cards";
import TabPanel from "./Stepper";

export default function TransparencyExplainabilityContainer() {


  return (
    <>


      <Box>
        <KpiGateRow />
        <TabPanel />
      </Box>


    </>
  );
}




