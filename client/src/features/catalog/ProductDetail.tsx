import {
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync } from "../basket/basketSlice";
import { fetchProductAsync, productsSelectors } from "./catalogSlice";

const ProductDetail = () => {
  const { basket, status} = useAppSelector(state => state.basket);
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: any }>();
  const product = useAppSelector(state => productsSelectors.selectById(state, id));
  const {status: productStatus} = useAppSelector(state => state.catalog)
  const [quantity, setQuantity] = useState(0);
  const item = basket?.items.find((i) => i.productId === product?.id);

  useEffect(() => {
    if (item) setQuantity(item.qunatity);
    if (!product && id) dispatch(fetchProductAsync(parseInt(id)))
  }, [id, item, dispatch, product]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (parseInt(event.currentTarget.value) >= 0) {
      setQuantity(parseInt(event.currentTarget.value));
    }
  }

  const handleUpdateCart = () => {
    if (!item || quantity > item.qunatity) {
      const updatedQuantity = item ? quantity - item.qunatity : quantity;
      dispatch(addBasketItemAsync({productId: product?.id!, quantity: updatedQuantity}))
    } else {
      const updatedQuantity = item.qunatity - quantity;
      dispatch(removeBasketItemAsync({productId: product?.id!, quantity: updatedQuantity}))
    }
  }

  if (productStatus.includes("pending")) return <LoadingComponent message="Loading product.." />;

  if (!product) return <NotFound />;

  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <img
          src={product.pictureUrl}
          alt={product.name}
          style={{ width: "100%" }}
        />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h6">{product.name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h4" color="secondary">
          ${(product.price / 100).toFixed(2)}
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{product.name}</TableCell>
              </TableRow>
            </TableBody>
            <TableBody>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{product.description}</TableCell>
              </TableRow>
            </TableBody>
            <TableBody>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>{product.type}</TableCell>
              </TableRow>
            </TableBody>
            <TableBody>
              <TableRow>
                <TableCell>Brand</TableCell>
                <TableCell>{product.brand}</TableCell>
              </TableRow>
            </TableBody>
            <TableBody>
              <TableRow>
                <TableCell>Quantity in stock</TableCell>
                <TableCell>{product.quantityInStock}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              onChange={handleInputChange}
              variant="outlined"
              type="number"
              label="Quantity in Cart"
              fullWidth
              value={quantity}
            />
          </Grid>
          <Grid item xs={6}>
            <LoadingButton
              disabled={item?.qunatity === quantity || !item && quantity === 0}
              loading={status.includes("pending")}
              onClick={handleUpdateCart}
              sx={{ height: "55px" }}
              color="primary"
              size="large"
              variant="contained"
              fullWidth
            >
              {item ? "Update Quanity " : "Add to Cart"}
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ProductDetail;
