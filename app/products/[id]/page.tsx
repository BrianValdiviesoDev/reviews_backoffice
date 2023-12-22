'use client';
import {
  Alert,
  Button,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Matches, Product, ProductType } from '../../entities/product.entity';
import {
  checkProductMatches,
  findProductInMarketplaces,
  getProduct,
  verifyProduct,
} from '../../api/products.service';
import { ApiHandlerError } from '../../api/api.handler';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Link from 'next/link';
import { toast } from 'react-toastify';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Review } from '../../entities/review.entity';
import { findReviewsByProduct } from '../../api/reviews.service';
import {
  DataGrid,
  GridCheckCircleIcon,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
  GridToolbar,
} from '@mui/x-data-grid';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

export default function Product({ params }: { params: { id: string } }) {
  const [productId, setProductId] = useState<string>(params.id);
  const [product, setProduct] = useState<Product>();
  const [matchesLoading, setMatchesLoading] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rows, setRows] = useState<GridRowsProp>([]);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const router = useRouter();

  const findInMarkets = async () => {
    try {
      await findProductInMarketplaces(productId);
      toast.success('Searching product in marketplaces...');
    } catch (e: any) {
      ApiHandlerError(e as AxiosError);
    }
  };
  const verify = async (id: string, matchId: string) => {
    try {
      const verified = await verifyProduct(id, matchId);
      setProduct(verified);
      toast.success('Product verified');
    } catch (e: any) {
      ApiHandlerError(e as AxiosError);
    }
  };

  const probabilityAvg = (percentages: number[]) => {
    if (!percentages) return '--';
    let sum = 0;
    percentages.forEach((percentage: any) => {
      let number = 0;
      try {
        number = parseInt(percentage);
      } catch (e) {
        console.error(e);
        number = 0;
      }
      sum += number;
    });
    const avg = sum / percentages.length;
    return avg.toFixed(0);
  };

  const checkMatches = async (matchId?: string) => {
    setMatchesLoading(true);
    try {
      if (!product || !product.matches) return;
      if (matchId) {
        await checkProductMatches(productId, [matchId]);
      } else {
        await checkProductMatches(
          productId,
          product.matches.map((m) => m.product._id),
        );
      }
      toast.success('Checking matches...');
    } catch (e: any) {
      ApiHandlerError(e as AxiosError);
    }
    setMatchesLoading(false);
  };

  const getProductInfo = async () => {
    if (productId !== 'new') {
      try {
        const product = await getProduct(productId);
        setProduct(product);
        if (product.matches) {
          generateRows(product.matches);
        }
      } catch (e: any) {
        ApiHandlerError(e as AxiosError);
      }
    }
  };

  const getReviews = async () => {
    try {
      const reviews = await findReviewsByProduct(productId);
      setReviews(reviews);
    } catch (e: any) {
      ApiHandlerError(e as AxiosError);
    }
  };

  const generateRows = (matches: Matches[]) => {
    if (!matches) return;
    const newRows = matches.map((item, i) => {
      return {
        ...item.product,
        percentage: item.percentage,
        id: i,
      };
    });
    setRows(newRows || []);
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200 },
    {
      field: 'percentage',
      headerName: 'Percentage',
      width: 200,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <>
            <Grid>
              <Typography>{probabilityAvg(params.value)}%</Typography>
              {params.value.length && (
                <Typography sx={{ fontSize: 'smaller' }}>
                  {params.value.join(', ')}
                </Typography>
              )}
            </Grid>
          </>
        );
      },
    },
    { field: 'price', headerName: 'Price', width: 200 },
    { field: 'rating', headerName: 'Rating', width: 200 },
    { field: 'reviews', headerName: 'Reviews', width: 200 },
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
                <Tooltip title="Compare with product">
                  <IconButton onClick={() => checkMatches(params.row._id)}>
                    <CompareArrowsIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              {params.row.percentage.length &&
                !params.row.percentage.find(
                  (p: any) => parseInt(p) === 100,
                ) && (
                  <Grid item>
                    <Tooltip title="Verify match">
                      <IconButton
                        onClick={() => {
                          verify(productId, params.row._id);
                        }}
                      >
                        <GridCheckCircleIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                )}
            </Grid>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    if (productId) {
      getProductInfo();
      getReviews();
    }
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
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={() => {
                      findInMarkets();
                    }}
                  >
                    Find in Marketplaces
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Accordion
            expanded={expanded === 'properties'}
            onChange={handleChange('properties')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id="properties-header"
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>
                Properties
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
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
                    Object.keys(product.metadata).map(
                      (meta: any, i: number) => {
                        console.log('META: ', meta);
                        let data = '';
                        try {
                          data = JSON.stringify(product.metadata[meta]);
                        } catch (e) {
                          console.error(e);
                        }
                        return (
                          <Typography key={i}>
                            {meta}: {data}
                          </Typography>
                        );
                      },
                    )}
                </Grid>
              </Grid>

              <Grid container spacing={2} mb={6}>
                <Grid item xs={12}>
                  <Typography variant="h4">Properties</Typography>
                  <Typography>{product?.properties}</Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {product.type === ProductType.MANUAL && (
            <Accordion
              expanded={expanded === 'matches'}
              onChange={handleChange('matches')}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="matches-header"
              >
                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                  Matches
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2} mb={6}>
                  <Grid item xs={12}>
                    <Button variant="contained" onClick={() => checkMatches()}>
                      Check all matches
                    </Button>
                    <DataGrid
                      rows={rows}
                      columns={columns}
                      initialState={{
                        pagination: {
                          paginationModel: {
                            pageSize: 10,
                          },
                        },
                      }}
                      pageSizeOptions={[5]}
                      slots={{ toolbar: GridToolbar }}
                      disableRowSelectionOnClick
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          )}
          <Accordion
            expanded={expanded === 'facts'}
            onChange={handleChange('facts')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} id="facts-header">
              <Typography sx={{ width: '33%', flexShrink: 0 }}>
                Facts
              </Typography>
            </AccordionSummary>
            <AccordionDetails></AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === 'reviews'}
            onChange={handleChange('reviews')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id="reviews-header"
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>
                Reviews
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {reviews?.map((review, i) => (
                <Card variant="outlined" key={i}>
                  <CardContent>
                    <Grid container>
                      {review.userAvatar && (
                        <Grid itemScope>
                          <Avatar src={review.userAvatar} />
                        </Grid>
                      )}
                      {review.username && (
                        <Grid item>
                          <Typography>{review.username}</Typography>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                  <CardContent>
                    <Typography>{review.title}</Typography>
                    <Typography>{review.description}</Typography>
                  </CardContent>
                  <CardActions>
                    {review.url && (
                      <Link href={review.url} target="_blank">
                        <Button size="small">View</Button>
                      </Link>
                    )}
                  </CardActions>
                </Card>
              ))}
            </AccordionDetails>
          </Accordion>
        </>
      ) : (
        <>
          <Alert severity="error">Product not found</Alert>
        </>
      )}
    </>
  );
}
