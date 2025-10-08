import { Box, Card, CardContent, Divider, Typography, Chip, Stack, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getActivityDetail } from "../services/api";

const Section = ({ title, children }) => (
  <>
    <Divider sx={{ my: 2 }} />
    <Typography variant="h6" sx={{ fontWeight: 700 }}>{title}</Typography>
    <Box sx={{ mt: 1 }}>{children}</Box>
  </>
);

const ActivityDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => {
    try {
      const resp = await getActivityDetail(id);
      setActivity(resp.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  })(); }, [id]);

  if (loading) return <Skeleton variant="rectangular" height={160} />;
  if (!activity) return <Typography>Activity not found.</Typography>;

  const { type, duration, caloriesBurned, createdAt, recommendation, improvements = [], suggestions = [], safety = [] } = activity;

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", display: "grid", gap: 2 }}>
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{type?.replaceAll("_", " ")} Session</Typography>
            <Stack direction="row" spacing={1}>
              <Chip label={`${duration} min`} />
              <Chip label={`${caloriesBurned} cal`} />
            </Stack>
          </Stack>
          <Typography color="text.secondary">
            {createdAt ? new Date(createdAt).toLocaleString() : ""}
          </Typography>
        </CardContent>
      </Card>

      {recommendation && (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>AI Recommendation</Typography>
            <Typography paragraph>{typeof recommendation === "string" ? recommendation : recommendation?.analysis}</Typography>

            {(improvements.length || recommendation?.improvements?.length) > 0 && (
              <Section title="Improvements">
                {(improvements.length ? improvements : recommendation?.improvements || []).map((item, idx) => (
                  <Typography key={idx} paragraph>• {item}</Typography>
                ))}
              </Section>
            )}

            {(suggestions.length || recommendation?.suggestions?.length) > 0 && (
              <Section title="Suggestions">
                {(suggestions.length ? suggestions : recommendation?.suggestions || []).map((item, idx) => (
                  <Typography key={idx} paragraph>• {item}</Typography>
                ))}
              </Section>
            )}

            {(safety.length || recommendation?.safety?.length) > 0 && (
              <Section title="Safety Guidelines">
                {(safety.length ? safety : recommendation?.safety || []).map((item, idx) => (
                  <Typography key={idx} paragraph>• {item}</Typography>
                ))}
              </Section>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ActivityDetail;
