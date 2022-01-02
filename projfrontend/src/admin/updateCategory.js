import React,{useState,useEffect} from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";
import {updateCategory,getCategory } from "./helper/adminapicall";


const UpdateCategory = ({match}) => {

    const [name, setName] = useState("");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const {user, token} = isAuthenticated();
    // const [values, setValues] = useState({
    //     name:"",
    //     formData:""
    // });


    const preload = (categoryId) => {
        getCategory(categoryId).then(data => {
            // console.log(data);
            if(data.error) {
                setError(data.error);
                // setValues({...values, error:data.error});
            }else{
                setName(data.name);
                // setValues({
                //     ...values,
                //     name:data.name,
                //     formData:new FormData(),
                // });
            }
        });
    }

    useEffect(() => {
        preload(match.params.categoryId);
    }, []);

    const goBack = () => (
        <div>
            <Link className="btn btn-sm btn-info mb-3" to="/admin/dashboard">Admin Home</Link>
        </div>
    );
    
    const handleChange = event => {
        setError("");
        setName(event.target.value);
    }

    const onsubmit = (event) => {
        event.preventDefault();
    //   setValues({...values,error:"",loading:true});
        // backen request
        updateCategory(match.params.categoryId,user._id, token,{name}).then(res => {
            if(res.error){
                setError(res.error)
            //   setValues({...values,error:res.error});
            }else {
                setName(name);
                setSuccess(true);
        //       setValues({
        //         ...values,
        //         name,
        //   });
        }
      });
    };

    const successMessage = () => {
        if(success) {
            return <h4 className="text-success">Category updated Succesfullly</h4>;
        }
    }

    const warningMessage = () => {
        if(error) {
            return <h4 className="text-success">Failed to update category</h4>
        }
    }

    const categoryForm = () => (
        <form>
            <div className="form-group">
                <p className="lead">
                    Enter the category
                </p>
                <input
                    type="text"
                    className="form-control my-3"
                    onChange={handleChange}
                    value={name}
                    autoFocus
                    required
                    placeholder="For Ex. Summer"
                />
                <button onClick={onsubmit} className="btn btn-outline-info my-3">
                    update Category
                </button>
            </div>
        </form>
    );

    return (
        <Base
            title="Create a category here"
            description="Add a new category for new tshirts"
            className="container bg-info p-4"
        >
            <div className="row bg-white rounded">
                <div className="col-md-8 offset-md-2">
                    {successMessage()}
                    {warningMessage()}
                   {categoryForm()}
                   {goBack()}
                </div>
            </div>
        </Base>
    )
}

export default UpdateCategory;