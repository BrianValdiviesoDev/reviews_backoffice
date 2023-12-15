'use client';
import { useEffect, useRef, useState } from 'react';
import { PostProduct } from '../../../entities/product.entity';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { FieldArray, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';
import { createProduct, getProduct } from '../../../api/products.service';
import { AxiosError } from 'axios';
import { ApiHandlerError } from '../../../api/api.handler';
import { toast } from 'react-toastify';

export default function ProductForm({ params }: { params: { id: string } }) {
  const [productId, setProductId] = useState<string>(params.id);
  const [product, setProduct] = useState<PostProduct>({
    name: '',
    sku: '',
    urls: [],
  });
  const formikRef = useRef<FormikHelpers<PostProduct> | null>(null);

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
    urls: yup.array().of(
      yup.object().shape({
        url: yup.string().required('URL is required'),
      }),
    ),
  });

  useEffect(() => {
    console.log(product);
  }, [product]);

  const handleSubmit = async (values: PostProduct) => {
    try {
      await createProduct(values);
      toast.success('Product created');
    } catch (e: any) {
      ApiHandlerError(e as AxiosError);
    }
  };

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
                label="SKU"
                fullWidth
                name="sku"
                value={values.sku}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.sku && Boolean(errors.sku)}
                helperText={touched.sku && errors.sku}
                margin="normal"
              />
              <FieldArray
                name="urls"
                render={(arrayHelpers) => (
                  <>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => arrayHelpers.push({ url: '' })}
                    >
                      Add url
                    </Button>
                    {values.urls &&
                      values.urls.map((url, index) => (
                        <Box key={index}>
                          <TextField
                            label="URL"
                            fullWidth
                            name={`urls[${index}].url`}
                            value={url.url}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched.urls && Boolean(errors.urls?.[index])
                            }
                            helperText={touched.urls && errors.urls?.[index]}
                            margin="normal"
                          />
                          <Button
                            variant="outlined"
                            color="warning"
                            onClick={() => arrayHelpers.remove(index)}
                          >
                            Remove
                          </Button>
                        </Box>
                      ))}
                  </>
                )}
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