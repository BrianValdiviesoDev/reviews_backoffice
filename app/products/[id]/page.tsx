'use client';
import {
  Alert,
  Button,
  Grid,
  Table,
  TableCell,
  TableHead,
  TableBody,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Product } from '../../entities/product.entity';
import { getProduct } from '../../api/products.service';
import { ApiHandlerError } from '../../api/api.handler';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Link from 'next/link';

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
          console.log(product);
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
              {product.originUrl &&(
                <Typography>URL: <Link href={product.originUrl}            
              >View</Link></Typography>
              )}
              <Typography>
                Properties: {product?.properties}
              </Typography>
              
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12}>
            <Table >
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell>Reviews</TableCell>
                      <TableCell>Last update</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {product.urls?.map((url, i) => (
                      <TableRow key={`${i}`}>
                        <TableCell>{url.title}</TableCell>
                        <TableCell>{url.price}</TableCell>
                        <TableCell>{url.rating}</TableCell>
                        <TableCell>{url.reviews}</TableCell>
                        <TableCell>
                          {url.lastUpdate
                            ? moment(url.lastUpdate).format('YYYY-MM-DD HH:mm')
                            : '--'}
                        </TableCell>
                        <TableCell>
                          <Link
                          target="_blank"
                            href={`${url.url}`}
                          >
                            <VisibilityIcon />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
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
