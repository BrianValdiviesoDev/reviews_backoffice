'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Grid,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import moment from 'moment';
import { Request, RequestStatus } from '../entities/request.entity';
import {
  cancelRequest,
  findAllRequests,
  removeRequest,
  startScrapper,
  stopScrapper,
} from '../api/requests.service';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
  GridToolbar,
} from '@mui/x-data-grid';
import LaunchIcon from '@mui/icons-material/Launch';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { toast } from 'react-toastify';

export default function Requests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [rows, setRows] = useState<GridRowsProp>([]);

  const getData = async () => {
    const req = await findAllRequests();
    setRequests(req);
    const rows = req.map((item, i) => {
      return {
        ...item,
        id: i,
      };
    });
    setRows(rows || []);
  };

  const remove = async (id: string) => {
    const req = await removeRequest(id);
    getData();
  };

  const cancel = async (id: string) => {
    const req = await cancelRequest(id);
    getData();
  };

  const stop = async () => {
    const req = await stopScrapper();
    toast.success('Product updated');
  };

  const start = async () => {
    const req = await startScrapper();
    toast.success('Scrapper started');
  };

  const columns: GridColDef[] = [
    { field: 'type', headerName: 'Type', width: 200 },
    { field: 'status', headerName: 'Status', width: 200 },
    {
      field: 'productId',
      headerName: 'Product',
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Link href={`products/${params.row.productId}`} target="_blank">
          {params.value}
        </Link>
      ),
    },
    { field: 'executionDate', headerName: 'Executed at', width: 200 },
    { field: 'updatedAt', headerName: 'Last update', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <>
            <Grid container spacing={1}>
              <Grid item>
                <Tooltip title="Duplicate request">
                  <IconButton>
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Visit url">
                  <IconButton
                    onClick={() => {
                      window.open(params.row.url, '_blank');
                    }}
                  >
                    <LaunchIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item>
                {params.row.status === RequestStatus.PENDING ? (
                  <Tooltip title="Cancel request">
                    <IconButton
                      onClick={() => {
                        cancel(params.row._id);
                      }}
                    >
                      <RemoveCircleIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Remove request">
                    <IconButton
                      onClick={() => {
                        remove(params.row._id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Grid>
            </Grid>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography variant="h2">Requests</Typography>
        </Grid>
        <Grid item xs={8}>
          <Grid container justifyContent="flex-end" spacing={1}>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => {
                  getData();
                }}
              >
                Refresh
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => {
                  start();
                }}
              >
                Start scrapper
              </Button>
            </Grid>

            <Grid item>
              <Button
                variant="contained"
                onClick={() => {
                  stop();
                }}
              >
                Stop scrapper
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 50,
            },
          },
        }}
        pageSizeOptions={[5]}
        slots={{ toolbar: GridToolbar }}
        disableRowSelectionOnClick
      />
    </>
  );
}
