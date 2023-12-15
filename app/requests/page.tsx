'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import moment from 'moment';
import { Request, RequestStatus } from '../entities/request.entity';
import { cancelRequest, findAllRequests, removeRequest } from '../api/requests.service';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

export default function Requests() {
  const [requests, setRequests] = useState<Request[]>([]);

  const getData = async () => {
    const req = await findAllRequests();
    setRequests(req);
  };

  const remove = async (id: string) => {
    const req = await removeRequest(id);
    getData();
  }

  const cancel = async (id: string) => {
    const req = await cancelRequest(id);
    getData();
  }

  useEffect(() => {
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
                <TableCell>
                      {request.status === RequestStatus.PENDING ? (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => cancel(request._id)}
                        >
                          <RemoveCircleIcon />
                        </Button>
                       ):(
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => remove(request._id)}
                        >
                          <DeleteIcon />
                        </Button>
                       )}
                </TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
