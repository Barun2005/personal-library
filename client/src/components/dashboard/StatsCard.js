import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const StatsCard = ({ title, value, color, subtitle, icon }) => {
  const colorMap = {
    primary: '#1976d2',
    success: '#2e7d32',
    warning: '#ed6c02',
    info: '#0288d1',
    error: '#d32f2f'
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderTop: 4,
        borderColor: colorMap[color] || colorMap.primary,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {icon && <Box sx={{ mr: 1 }}>{icon}</Box>}
        <Typography variant="h6" component="div" color="text.secondary">
          {title}
        </Typography>
      </Box>
      
      <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
        {value}
      </Typography>
      
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
};

export default StatsCard;