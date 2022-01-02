import React,{useState, useEffect} from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { isAuthenticated } from "../auth/helper";
import Base from '../core/Base';
import { getCategories, updateCategory, deleteCategory } from "./helper/adminapicall";

const ManageCategories = () => {

    const [categories , setCategories] = useState([]);

    const {user, token} = isAuthenticated();

    const preload = () => {
        getCategories().then(data => {
            if(data.error) {
                console.log(data.error);
            } else {
                setCategories(data);
            }
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect (() => {
        preload();
    }, []);

    const deleteThisCategory = (categoryId) => {
        deleteCategory(categoryId, user._id, token).then(data => {
            if(data.error) {
                console.log(data.error);
            } else {
                preload();
            }
        })
    }

    return (
            <Base title="Welcome admin" description="Manage categories here">
                <h2 className="mb-4">All products:</h2>
                <Link className="btn btn-info" to={`/admin/dashboard`}>
                    <span className="">Admin Home</span>
                </Link>
                <div className="row">
                    <div className="col-12">
                        <h2 className="text-center text-white my-3">Total 3 products</h2>

                        {categories.map((categories, index) => {
                        return (
                        <div key={index} className="row text-center mb-2 ">
                            <div className="col-4">
                                <h3 className="text-white text-left">{categories.name}</h3>
                            </div>
                            <div className="col-4">
                                <Link
                                    className="btn btn-success"
                                    to={`/admin/categories/update/${categories._id}`}
                                >
                                    <span className="">Update</span>
                                </Link>
                            </div>
                            <div className="col-4">
                                <button onClick={() => {
                                    deleteThisCategory(categories._id)
                                 }} className="btn btn-danger">
                                    Delete
                                </button>
                            </div>
                        </div>);
                    })}

                        {/* <div className="row text-center mb-2 ">
                            <div className="col-4">
                                <h3 className="text-white text-left">I write code</h3>
                            </div>
                            <div className="col-4">
                                <Link
                                    className="btn btn-success"
                                    to={`/admin/product/update/productId`}
                                >
                                    <span className="">Update</span>
                                </Link>
                            </div>
                            <div className="col-4">
                                <button onClick={() => { }} className="btn btn-danger">
                                    Delete
                                </button>
                            </div>
                        </div> */}
                    </div>
                </div>
            </Base>
    )
}

export default ManageCategories;