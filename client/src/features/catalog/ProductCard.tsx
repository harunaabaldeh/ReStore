import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import { Product } from "../../app/models/product";

interface Props {
  product: Product;
}

function ProductCard({ product }: Props) {
  return (
    <>
      <Card>
        <CardHeader
          avatar={
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            {product.name.charAt(0)}
            </Avatar>
        }
          title={product.name}
          titleTypographyProps={{
            sx : { fontWeight : 'bold', color : 'primary.main'}
          }}
        />
        <CardMedia
          sx={{ height: 140, backgroundSize: "contain", bgcolor: 'primary.light' }}
          image={product.pictureUrl}
          title={product.name}
        />
        <CardContent>
          <Typography gutterBottom color="secondary" variant="h5">
            ${(product.price / 100).toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.brand} / {product.type}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Add to cart</Button>
          <Button size="small">View</Button>
        </CardActions>
      </Card>
    </>
  );
}

export default ProductCard;
