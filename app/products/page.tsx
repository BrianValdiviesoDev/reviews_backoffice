'use client';

import { useEffect, useState } from 'react';
import { Product } from '../entities/product.entity';
import { getAllProducts } from '../api/products.service';
import {
  Button,
  Grid,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRouter } from 'next/navigation';
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
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <>
              <TableRow key={product._id}>
                <TableCell>
                  {product.image && (
                    <img src={product.image} height="100" alt={product.name} />
                  )}
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.type}</TableCell>
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
            </>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
