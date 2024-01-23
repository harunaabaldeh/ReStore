import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product, ProductParams } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";
import { MetaData } from "../../app/models/pagination";

interface CatalogState {
    productsLoaded: boolean;
    filtersLoaded: boolean;
    status: string;
    brands: string[];
    types: string[];
    productParams: ProductParams;
    metaData: MetaData | null;
}

const productsAdapter = createEntityAdapter<Product>();

const getAxiosParams = (producParams: ProductParams) => {
    const params = new URLSearchParams();
    params.append("orderBy", producParams.orderBy);
    params.append("pageNumber", producParams.pageNumber.toString());
    params.append("pageSize", producParams.pageSize.toString());
    if(producParams.searchTerm) params.append("searchTerm", producParams.searchTerm);
    if(producParams.brands.length > 0) params.append("brands", producParams.brands.toString());
    if(producParams.types.length > 0) params.append("types", producParams.types.toString());
    return params;
}

export const fetchProductsAsync = createAsyncThunk<Product[], void, {state: RootState}>(
    "catalog/fetchProductsAsync",
    async (_, thinkApi) => {
        const params = getAxiosParams(thinkApi.getState().catalog.productParams);
        try {
            const response =  await agent.Catalog.list(params);
            thinkApi.dispatch(setMetaData(response.metaData));
            return response.items;
        } catch (error: any) {
            return thinkApi.rejectWithValue({error: error.data})
        }
    }
)
export const fetchProductAsync = createAsyncThunk<Product, number>(
    "catalog/fetchProductAsync",
    async (productId, thunkApi) => {
        try {
            return await agent.Catalog.details(productId)
        } catch (error : any) {
            return thunkApi.rejectWithValue({error: error.data})
        }
    }
)

export const fetchFilters = createAsyncThunk(
    "catalog/fetchFilters",
    async (_, thinkApi) => {
        try {
            return agent.Catalog.fetchFilters();
        } catch (error: any) {
            return thinkApi.rejectWithValue({error: error.data})
        }
    }
)

const initParams =() => {
    return {
        orderBy: "name",
        pageNumber: 1,
        pageSize: 6,
        brands: [],
        types: [],
    }
}

export const catalogSlice = createSlice({
    name: "catalog",
    initialState: productsAdapter.getInitialState<CatalogState>({
        productsLoaded: false,
        filtersLoaded: false,
        status: "idle",
        brands: [],
        types: [],
        productParams: initParams(),
        metaData: null
    }),
    reducers: {
        setProductParams: (state, action) => {
            state.productsLoaded = false;
            if (action.payload.pageNumber === undefined)
                state.productParams.pageNumber = 1
            state.productParams = {...state.productParams, ...action.payload};
        },
        setPageNumber: (state, action) => {
            state.productsLoaded = false;
            state.productParams.pageNumber = {...state.productParams, ...action.payload}
        },
        setMetaData: (state, action) => {
            state.metaData = action.payload;
        },
        resetProductParams: (state) => {
            state.productParams = initParams();
        }
    },
    extraReducers: (builder => {
        builder.addCase(fetchProductsAsync.pending, (state) => {
            state.status = "pendingFetchProducts";
        });
        builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
            productsAdapter.setAll(state, action.payload);
            state.status = "idle";
            state.productsLoaded = true
        });
        builder.addCase(fetchProductsAsync.rejected, (state) => {
            state.status = "idle";
        });

        builder.addCase(fetchProductAsync.pending, (state) => {
            state.status = "pendingFetchProduct";
        });
        builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
            productsAdapter.upsertOne(state, action.payload);
            state.status = "idle";
        })
        builder.addCase(fetchProductAsync.rejected, (state, action) => {
            console.log(action)
            state.status = "idle";
        })

        builder.addCase(fetchFilters.pending, (state) => {
            state.status = "pendingFetchFilters";
        });

        builder.addCase(fetchFilters.fulfilled, (state, action) => {
            state.brands = action.payload.brands;
            state.types = action.payload.types;
            state.filtersLoaded = true;
            state.status = "idle";
        });

        builder.addCase(fetchFilters.rejected, (state, action) => {
            state.status = "idle";
            console.log(action)
        })
    })
})

export const productsSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);

export const { setProductParams, resetProductParams, setMetaData, setPageNumber } = catalogSlice.actions;
