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
import { Matches, Product, ProductType } from '../../entities/product.entity';
import { getProduct, verifyProduct } from '../../api/products.service';
import { ApiHandlerError } from '../../api/api.handler';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Link from 'next/link';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { toast } from 'react-toastify';

export default function Product({ params }: { params: { id: string } }) {
  const [productId, setProductId] = useState<string>(params.id);
  const [product, setProduct] = useState<Product>();
  const router = useRouter();

  const verify = async (id: string, matchId: string) => {
    try {
      const verified = await verifyProduct(id, matchId);
      setProduct(verified);
      toast.success('Product verified');
    } catch (e: any) {
      ApiHandlerError(e as AxiosError);
    }
  };

  const probabilityAvg = (matches: Matches) => {
    if (!matches || !matches.percentage) return '--';
    let sum = 0;
    console.log(matches);
    matches.percentage.forEach((percentage: any) => {
      let number = 0;
      try {
        number = parseInt(percentage);
      } catch (e) {
        console.error(e);
        number = 0;
      }
      sum += number;
    });
    const avg = sum / matches.percentage.length;
    return avg.toFixed(0);
  };
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
          <Grid container spacing={2} mb={6}>
            <Grid item xs={8}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <img src={product.image} style={{ width: '100%' }} />
                </Grid>
                <Grid item xs={8}>
                  <Typography>{product.name}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <Grid container justifyContent="flex-end" spacing={2}>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={() => {
                      router.push(`/products/edit/${productId}`);
                    }}
                  >
                    Edit
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" size="small">
                    <Link href={product.originUrl} target="_blank">
                      Visit
                    </Link>
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container spacing={2} mb={6}>
            <Grid item xs={12}>
              <Typography>
                Marketplace: {product?.marketplace || '--'}
              </Typography>
              <Typography>Price: {product?.price || '--'}</Typography>
              <Typography>Rating: {product?.rating || '--'}</Typography>
              <Typography>Reviews: {product?.reviews || '--'}</Typography>
              <Typography>
                Updated at:{' '}
                {product?.updatedAt
                  ? moment(product.updatedAt).format('YYYY-MM-DD HH:mm')
                  : '--'}
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2} mb={6}>
            <Grid item xs={12}>
              <Typography>Metadata</Typography>
            </Grid>
            <Grid item xs={12}>
              {product.metadata &&
                Object.keys(product.metadata).map((meta: any, i: number) => (
                  <Typography key={i}>
                    {meta}: {product.metadata[meta]}
                  </Typography>
                ))}
            </Grid>
          </Grid>

          <Grid container spacing={2} mb={6}>
            <Grid item xs={12}>
              <Typography variant="h4">Properties</Typography>
              <Typography>{product?.properties}</Typography>
            </Grid>
          </Grid>
          {product.type === ProductType.MANUAL && (
            <Grid container spacing={2} mb={6}>
              <Grid item xs={12}>
                <Typography variant="h4">Matches</Typography>{' '}
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Imgae</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Match</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell>Reviews</TableCell>
                      <TableCell>Last update</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {product.matches?.map((match, i) => (
                      <TableRow key={`${i}`}>
                        <TableCell>
                          {match.product.image && (
                            <img
                              src={match.product.image}
                              height="100"
                              alt={match.product.name}
                            />
                          )}
                        </TableCell>
                        <TableCell>{match.product.name}</TableCell>
                        <TableCell>
                          <>
                            {`${probabilityAvg(match)}%`}
                            <br />
                            {match.percentage &&
                              match.percentage.length > 1 && (
                                <Typography variant="caption">
                                  {match.percentage.join(',')}
                                </Typography>
                              )}
                          </>
                        </TableCell>
                        <TableCell>{match.product.price}</TableCell>
                        <TableCell>{match.product.rating}</TableCell>
                        <TableCell>{match.product.reviews}</TableCell>
                        <TableCell>
                          {match.product.updatedAt
                            ? moment(match.product.updatedAt).format(
                                'YYYY-MM-DD HH:mm',
                              )
                            : '--'}
                        </TableCell>
                        <TableCell>
                          <Link
                            target="_blank"
                            href={`${match.product.originUrl}`}
                          >
                            <VisibilityIcon />
                          </Link>
                          {!match.percentage && (
                            <TaskAltIcon
                              onClick={() =>
                                verify(product._id, match.product._id)
                              }
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          )}
        </>
      ) : (
        <>
          <Alert severity="error">Product not found</Alert>
        </>
      )}
    </>
  );
}
