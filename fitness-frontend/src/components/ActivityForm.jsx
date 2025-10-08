import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Paper, Stack, Snackbar, Alert } from "@mui/material";
import React, { useState } from "react";
import { addActivity } from "../services/api";

const TYPES = [
  "RUNNING","WALKING","CYCLING","SWIMMING","WEIGHT_TRAINING",
  "YOGA","HIIT","CARDIO","STRETCHING","OTHER"
];

const ActivityForm = ({ onActivityAdded }) => {
  const [activity, setActivity] = useState({ type: "RUNNING", duration: "", caloriesBurned: "", additionalMetrics: {} });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ open: false, msg: "", sev: "success" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activity.duration || !activity.caloriesBurned)
      return setToast({ open: true, msg: "Enter duration & calories", sev: "warning" });

    setSaving(true);
    try {
      await addActivity({ ...activity, duration: +activity.duration, caloriesBurned: +activity.caloriesBurned });
      onActivityAdded && onActivityAdded();
      setActivity({ type: "RUNNING", duration: "", caloriesBurned: "", additionalMetrics: {} });
      setToast({ open: true, msg: "Activity added!", sev: "success" });
    } catch (error) {
      console.error(error);
      setToast({ open: true, msg: "Failed to add activity.", sev: "error" });
    } finally { setSaving(false); }
  };

  return (
    <>
      <Paper sx={{ p: 2, border: "1px solid #eee", background: "white" }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControl sx={{ minWidth: 200 }} required>
              <InputLabel>Activity Type</InputLabel>
              <Select
                label="Activity Type"
                value={activity.type}
                onChange={(e) => setActivity({ ...activity, type: e.target.value })}
              >
                {TYPES.map((t) => <MenuItem key={t} value={t}>{t.replaceAll("_", " ")}</MenuItem>)}
              </Select>
            </FormControl>

            <TextField
              label="Duration (minutes)"
              type="number"
              value={activity.duration}
              onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
              required sx={{ flex: 1 }}
            />
            <TextField
              label="Calories Burned"
              type="number"
              value={activity.caloriesBurned}
              onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
              required sx={{ flex: 1 }}
            />
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mt: 2 }} justifyContent="flex-end">
            <Button color="inherit" variant="outlined"
              onClick={() => setActivity({ type: "RUNNING", duration: "", caloriesBurned: "", additionalMetrics: {} })}>
              Clear
            </Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? "Saving..." : "Add Activity"}
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Snackbar open={toast.open} autoHideDuration={2200} onClose={() => setToast(t => ({ ...t, open: false }))}>
        <Alert severity={toast.sev} onClose={() => setToast(t => ({ ...t, open: false }))}>{toast.msg}</Alert>
      </Snackbar>
    </>
  );
};

export default ActivityForm;
