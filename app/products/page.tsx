'use client';

import { useEffect, useState } from 'react';
import { Product } from '../entities/product.entity';
import { getAllProducts } from '../api/products.service';
import { Button, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRouter } from 'next/navigation';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
  GridToolbar,
} from '@mui/x-data-grid';
import LaunchIcon from '@mui/icons-material/Launch';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [rows, setRows] = useState<GridRowsProp>([]);

  const router = useRouter();

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'type', headerName: 'Type', width: 200 },
    { field: 'price', headerName: 'Price', width: 200 },
    { field: 'marketplace', headerName: 'Market place', width: 200 },
    { field: 'reviews', headerName: 'Reviews', width: 200 },
    { field: 'scrappedReviews', headerName: 'Scrapped reviews', width: 200 },
    { field: 'generatedReviews', headerName: 'Generated reviews', width: 200 },
    { field: 'rating', headerName: 'Rating', width: 200 },
    {
      field: 'matches',
      headerName: 'Matches',
      width: 200,
      renderCell: (params: GridRenderCellParams) =>
        params.row.matches.length || 0,
    },
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
                <Tooltip title="View product">
                  <IconButton
                    onClick={() => {
                      router.push(`/products/${params.row._id}`);
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Visit website">
                  <IconButton
                    onClick={() => {
                      window.open(params.row.originUrl, '_blank');
                    }}
                  >
                    <LaunchIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    const getData = async () => {
      const products = await getAllProducts();
      setProducts(products);
      const newRows = products.map((item, i) => {
        return {
          ...item,
          id: i,
        };
      });
      setRows(newRows || []);
    };
    getData();
  }, []);
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Typography variant="h2">Products</Typography>
        </Grid>
        <Grid item xs={4}>
          <Grid container justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={() => {
                router.push('/products/edit/new');
              }}
            >
              Add product
            </Button>
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
