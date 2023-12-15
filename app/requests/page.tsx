'use client';

import { useEffect, useState } from 'react';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import moment from 'moment';
import { Request } from '../entities/request.entity';
import { findAllRequests } from '../api/requests.service';

export default function Requests() {
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const getData = async () => {
      const req = await findAllRequests();
      setRequests(req);
    };
    getData();
  }, []);
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Typography variant="h2">Requests</Typography>
        </Grid>
      </Grid>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>URL</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Executed</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request) => (
            <>
              <TableRow key={request._id}>
                <TableCell>{request.url}</TableCell>
                <TableCell>{request.type}</TableCell>
                <TableCell>{request.status}</TableCell>
                <TableCell>{request.productId}</TableCell>
                <TableCell>
                  {request.executionDate
                    ? moment(request.executionDate).format(
                        'YYYY-MM-DD HH:mm:ss',
                      )
                    : '--'}
                </TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
