'use client';

import { useEffect, useState } from 'react';
import { Product } from '../entities/product.entity';
import { getAllProducts } from '../api/products.service';
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import SearchIcon from '@mui/icons-material/Search';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const products = await getAllProducts();
      setProducts(products);
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
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <>
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => {
                      router.push(`/products/${product._id}`);
                    }}
                  >
                    <VisibilityIcon />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <Table sx={{ marginLeft: '3rem' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>URL</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell>Reviews</TableCell>
                      <TableCell>Last update</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {product.urls?.map((url, i) => (
                      <TableRow key={`${url.url}-${i}`}>
                        <TableCell>{url.url}</TableCell>
                        <TableCell>{url.name}</TableCell>
                        <TableCell>{url.price}</TableCell>
                        <TableCell>{url.rating}</TableCell>
                        <TableCell>{url.reviews}</TableCell>
                        <TableCell>
                          {url.lastUpdate
                            ? moment(url.lastUpdate).format('YYYY-MM-DD HH:mm')
                            : '--'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
