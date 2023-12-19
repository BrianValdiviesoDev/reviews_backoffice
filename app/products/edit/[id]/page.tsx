'use client';
import { useEffect, useRef, useState } from 'react';
import { PostProduct, ProductType } from '../../../entities/product.entity';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  TextareaAutosize as BaseTextareaAutosize,
  FormControl,
  styled,
} from '@mui/material';
import {
  Field,
  FieldArray,
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
} from 'formik';
import * as yup from 'yup';
import {
  createProduct,
  getProduct,
  updateProduct,
} from '../../../api/products.service';
import { AxiosError } from 'axios';
import { ApiHandlerError } from '../../../api/api.handler';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function ProductForm({ params }: { params: { id: string } }) {
  const [productId, setProductId] = useState<string>(params.id);
  const [product, setProduct] = useState<PostProduct>({
    type: ProductType.MANUAL,
    name: '',
    originUrl: '',
  });
  const formikRef = useRef<FormikHelpers<PostProduct> | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      if (productId !== 'new') {
        try {
          const product = await getProduct(productId);
          setProduct(product);
          if (formikRef.current) {
            formikRef.current.setValues(product);
          }
        } catch (e: any) {
          ApiHandlerError(e as AxiosError);
        }
      }
    };
    getData();
  }, [productId]);

  const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    originUrl: yup.string().required('Origin URL is required'),
  });

  const handleSubmit = async (values: PostProduct) => {
    try {
      console.log(productId);
      if (productId && productId !== 'new') {
        await updateProduct(productId, values);
        toast.success('Product updated');
        router.push('/products');
      } else {
        await createProduct(values);
        toast.success('Product created');
        router.push('/products');
      }
    } catch (e: any) {
      ApiHandlerError(e as AxiosError);
    }
  };

  const Textarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
    width: 100%;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 12px;
    border-radius: 5px;
    background-color: transparent;


    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
  );

  return (
    <>
      <Container maxWidth="sm">
        <Typography variant="h5" align="center" gutterBottom>
          Create product
        </Typography>
        <Formik
          innerRef={formikRef as React.Ref<FormikProps<PostProduct>>}
          initialValues={product}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            handleChange,
            handleBlur,
            touched,
            errors,
            setValues,
          }) => (
            <Form>
              <TextField
                label="Name"
                fullWidth
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                margin="normal"
              />
              <TextField
                label="URL"
                fullWidth
                name="originUrl"
                value={values.originUrl}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.originUrl && Boolean(errors.originUrl)}
                helperText={touched.originUrl && errors.originUrl}
                margin="normal"
              />

              <Box>
                <Typography>Properties</Typography>
              </Box>
              <Field
                name="properties"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.properties}
                as={Textarea}
                placeholder="Your product properties"
              />
              <Button type="submit" variant="contained" color="primary">
                Enviar
              </Button>
            </Form>
          )}
        </Formik>
      </Container>
    </>
  );
}
