import { TextField, debounce } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore"
import { setProductParams } from "./catalogSlice";
import { useState } from "react";

const ProductSearch = () => {
    const {productParams} = useAppSelector(state => state.catalog)
    const [searchTerm, setSearchTerm] = useState(productParams.searchTerm)
    const dispatch = useAppDispatch();
    
    const debounceSearch = debounce((e: any) => {
        dispatch(setProductParams({searchTerm: e.target.value}))
    }, 1000)

  return (
    <TextField
    fullWidth
    label="Search products"
    variant="outlined"
    value={searchTerm || ""}
    onChange={(e : any) => {
        setSearchTerm(e.target.value)
        debounceSearch(e)
    }}
  />
  )
}

export default ProductSearch