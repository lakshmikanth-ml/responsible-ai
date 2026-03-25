import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  Autocomplete,
  Button,
  Stack,
} from "@mui/material";
import KpiGateRow from "./cards";
import TabPanel from "./Stepper";

const STORAGE_KEY = "transparency_project_context";

const getDefaultContext = () => ({
  project: "",
  modelVersion: "",
  endpoint: "",
  decisionRole: "decision_support",
});

const DECISION_ROLE_OPTIONS = [
  { value: "advisory", label: "Advisory only" },
  { value: "decision_support", label: "Decision-support" },
  { value: "decision_influencing", label: "Decision-influencing" },
];

const ProjectContextCard = ({
  context,
  onFieldChange,
  onSave,
  onReset,
  statusMessage,
  sx,
}) => (
  <Card variant="outlined" sx={{ width: "100%", ...sx }}>
    <CardContent>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Project Context
      </Typography>

      <Stack spacing={2}>
        <TextField
          size="small"
          fullWidth
          label="Project"
          placeholder="e.g., Carrier A - Claims Copilot"
          value={context.project}
          onChange={(e) => onFieldChange("project", e.target.value)}
        />
        <TextField
          size="small"
          fullWidth
          label="Model Version"
          placeholder="e.g., v1.0.3"
          value={context.modelVersion}
          onChange={(e) => onFieldChange("modelVersion", e.target.value)}
        />
        <TextField
          size="small"
          fullWidth
          label="Endpoint"
          placeholder="e.g., /claims/triage"
          value={context.endpoint}
          onChange={(e) => onFieldChange("endpoint", e.target.value)}
        />
        <FormControl fullWidth size="small">
          <Autocomplete
            fullWidth
            size="small"
            options={DECISION_ROLE_OPTIONS}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            value={DECISION_ROLE_OPTIONS.find((option) => option.value === context.decisionRole) || null}
            onChange={(_, value) => onFieldChange("decisionRole", value?.value || "")}
            renderInput={(params) => <TextField {...params} label="Decision Role" />}
          />
        </FormControl>
      </Stack>

      <Stack direction="row" spacing={1} mt={2}>
        <Button size="small" variant="outlined" onClick={onReset}>
          Reset Demo Data
        </Button>
        <Button size="small" variant="contained" onClick={onSave}>
          Save
        </Button>
      </Stack>

      {statusMessage && (
        <Typography variant="caption" color="success.main" display="block" mt={1}>
          {statusMessage}
        </Typography>
      )}

      <Typography variant="caption" color="text.secondary" mt={1} display="block">
        Data persists locally (browser localStorage) for demo realism.
      </Typography>
    </CardContent>
  </Card>
);

export default function TransparencyExplainabilityContainer() {
  const [projectContext, setProjectContext] = useState(getDefaultContext());
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProjectContext(JSON.parse(saved));
      } catch (error) {
        console.error("Unable to parse stored project context", error);
      }
    }
  }, []);

  const handleFieldChange = (field, value) => {
    setProjectContext((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveContext = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projectContext));
      setStatusMessage("✓ Project Context saved");
      window.setTimeout(() => setStatusMessage(""), 2000);
    } catch (error) {
      console.error(error);
      setStatusMessage("Unable to save project context");
    }
  };

  const handleResetDemo = () => {
    if (window.confirm("Reset demo data? This cannot be undone.")) {
      localStorage.removeItem(STORAGE_KEY);
      setProjectContext(getDefaultContext());
      setStatusMessage("✓ Demo data reset");
      window.setTimeout(() => setStatusMessage(""), 2000);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* <Card variant="outlined" sx={{ p: 2 }}>
        <KpiGateRow />
      </Card> */}
      {/* <Card variant="outlined" sx={{ p: 2 }}> */}
      <TabPanel />
      {/* </Card> */}
      <Box mt={0}>
        <ProjectContextCard
          context={projectContext}
          onFieldChange={handleFieldChange}
          onSave={handleSaveContext}
          onReset={handleResetDemo}
          statusMessage={statusMessage}
        />
      </Box>
    </Box>
  );
}
