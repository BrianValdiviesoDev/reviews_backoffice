'use client';
import {
  Alert,
  Button,
  Grid,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { PostProduct, Product } from '../../entities/product.entity';
import { getProduct } from '../../api/products.service';
import { ApiHandlerError } from '../../api/api.handler';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

export default function Product({ params }: { params: { id: string } }) {
  const [productId, setProductId] = useState<string>(params.id);
  const [product, setProduct] = useState<Product>();
  const router = useRouter();
  useEffect(() => {
    const getData = async () => {
      if (productId !== 'new') {
        try {
          const product = await getProduct(productId);
          setProduct(product);
        } catch (e: any) {
          ApiHandlerError(e as AxiosError);
        }
      }
    };
    getData();
  }, [productId]);
  return (
    <>
      {product ? (
        <>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography variant="h2">{product.name}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Grid container justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={() => {
                    router.push(`/products/edit/${productId}`);
                  }}
                >
                  Edit
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography>SKU: {product.sku}</Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>URL</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <Alert severity="error">Product not found</Alert>
        </>
      )}
    </>
  );
}
