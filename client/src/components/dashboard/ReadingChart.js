import React from 'react';
import { Typography } from '@mui/material';

const ReadingChart = ({ books }) => {
  const readCount = books.filter(book => book.status === 'Read').length;
  const readingCount = books.filter(book => book.status === 'Currently Reading').length;
  const wantToReadCount = books.filter(book => book.status === 'Want to Read').length;
  const total = books.length;

  return (
    <div>
      {total === 0 ? (
        <Typography variant="body2" color="text.secondary" align="center">
          No books added yet
        </Typography>
      ) : (
        <div>
          <Typography variant="body2">
            Read: {readCount} ({total > 0 ? Math.round((readCount / total) * 100) : 0}%)
          </Typography>
          <Typography variant="body2">
            Currently Reading: {readingCount} ({total > 0 ? Math.round((readingCount / total) * 100) : 0}%)
          </Typography>
          <Typography variant="body2">
            Want to Read: {wantToReadCount} ({total > 0 ? Math.round((wantToReadCount / total) * 100) : 0}%)
          </Typography>
        </div>
      )}
    </div>
  );
};

export default ReadingChart;