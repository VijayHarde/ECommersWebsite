import React,{useState,useEffect} from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Base from '../core/Base';
import { getCategories,getProduct,updateProduct } from "./helper/adminapicall";

const UpdateProduct = ({match}) => {

    const {user, token} = isAuthenticated();

    const [values, setValues] = useState({
        name:"",
        description:"",
        price:"",
        stock:"",
        photo:"",
        categories:[],
        category:"",
        loading:false,
        error:"",
        createdProduct:"",
        getRedirect:false,
        formData:""
    });

    const {
        name,
        description,
        price,
        stock,
        categories,
        category,
        loading,
        error,
        createdProduct,
        getRedirect,
        formData
    } = values;

    const preload = (productId) => {
        getProduct(productId).then(data => {
            // console.log(data);
            if(data.error) {
                setValues({...values, error:data.error});
            }else{
                preloadCategories();
                setValues({
                    ...values,
                    name:data.name,
                    description:data.description,
                    price:data.price,
                    category:data.category._id,
                    stock:data.stock,
                    formData:new FormData(),
                });
            }
        });
    }

    const preloadCategories = () => {
        getCategories().then(data => {
            if(data.error) {
                setValues({...values, error:data.error});
            }else{
                setValues({
                       categories:data,
                       formData:new FormData()
                });
            }
        })
    }

    useEffect(() => {
        preload(match.params.productId);
    }, []);


    const onSubmit = (event) => {
      event.preventDefault();
      setValues({...values,error:"",loading:true});
      updateProduct(match.params.productId,user._id, token,formData).then(res => {
        if(res.error){
          setValues({...values,error:res.error});
        }else {
          setValues({
            ...values,
            name,
            description:"",
            price:"",
            photo:"",
            stock:"",
            loading:false,
            createdProduct:res.name,
      });
    }
  });
}

    const handleChange = name => event => {
        const value = name === "photo" ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues({...values, [name]:value})
    }

    const successMessage = ()  => (
      <div className="alert alert-success mt-3"
      style={{display: createdProduct ? "" : "none"}}
      >
        <h4>{createdProduct} updated successfully</h4>
      </div>
    )

    const createProductForm = () => (
        <form >
          <span>Post photo</span>
          <div className="form-group">
            <label className="btn btn-block btn-success mb-3">
              <input
                onChange={handleChange("photo")}
                type="file"
                name="photo"
                accept="image"
                placeholder="choose a file"
                className="mb-3"
              />
            </label>
          </div>
          <div className="form-group">
            <input
              onChange={handleChange("name")}
              name="photo"
              className="form-control mb-3"
              placeholder="Name"
              value={name}
            />
          </div>
          <div className="form-group">
            <textarea
              onChange={handleChange("description")}
              name="photo"
              className="form-control mb-3"
              placeholder="Description"
              value={description}
            />
          </div>
          <div className="form-group">
            <input
              onChange={handleChange("price")}
              type="number"
              className="form-control mb-3"
              placeholder="Price"
              value={price}
            />
          </div>
          <div className="form-group mb-3">
            <select
              onChange={handleChange("category")}
              className="form-control mb-3"
              placeholder="Category"
            >
              <option>Select</option>
              {categories && 
               categories.map((cate, index) => (
                   <option key={index} value={cate._id}>{cate.name}</option>
               ))
              }
            </select>
          </div>
          <div className="form-group mb-3">
            <input
              onChange={handleChange("stock")}
              type="number"
              className="form-control mb-3"
              placeholder="Quantity"
              value={stock}
            />
          </div>
          
          <button type="submit" onClick={onSubmit} className="btn btn-outline-success mb-3">
            Update Product
          </button>
        </form>
      );

    return (
        <Base
            title="Add a product here!"
            description="Welcome to product creation section"
            className="container bg-info p-4"
        >
            <Link className="btn btn-sm btn-dark mb-3" to="/admin/dashboard">Admin Home</Link>
            <div className="row bg-dark text-white rounded">
                <div className="col-md-8 offset-md-2">
                  {successMessage()}
                    {createProductForm()}
                </div>
            </div>
        </Base>
    )
}

export default UpdateProduct;