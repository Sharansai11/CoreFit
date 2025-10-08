import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card, CardActionArea, CardContent, Chip, Grid, Typography, Box, Skeleton, Alert
} from "@mui/material";
import { getActivities } from "../services/api";

const SkeletonGrid = () => (
  <Grid container spacing={2}>
    {Array.from({ length: 6 }).map((_, i) => (
      <Grid item xs={12} sm={6} md={4} key={i}>
        <Card><CardContent>
          <Skeleton width="60%" /><Skeleton width="40%" />
          <Skeleton variant="rectangular" height={22} sx={{ mt: 1 }}/>
        </CardContent></Card>
      </Grid>
    ))}
  </Grid>
);

const ActivityList = () => {
  const [activities, setActivities] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchActivities = async () => {
    try {
      const response = await getActivities();
      setActivities(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load activities.");
      setActivities([]);
    }
  };

  useEffect(() => { fetchActivities(); }, []);

  if (!activities && !error) return <SkeletonGrid />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (activities.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography variant="h6" gutterBottom>No activities yet</Typography>
        <Typography color="text.secondary">Add your first workout above.</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {activities.map((activity) => (
        <Grid item xs={12} sm={6} md={4} key={activity.id}>
          <Card sx={{ height: "100%" }}>
            <CardActionArea onClick={() => navigate(`/activities/${activity.id}`)} sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: .5 }}>
                  {activity.type?.replaceAll("_", " ")}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {activity.createdAt ? new Date(activity.createdAt).toLocaleString() : ""}
                </Typography>
                <Chip label={`Duration: ${activity.duration} min`} sx={{ mr: 1 }} />
                <Chip color="secondary" label={`Calories: ${activity.caloriesBurned}`} />
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ActivityList;
