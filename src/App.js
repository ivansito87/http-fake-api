// language=JSX
import React, { Component } from "react";

//=========== Toast =================================================
/*
* Toast is helping us to display errors and success we can use the colors provided
* by Bootstrap like success and warning, info and danger
* we can use it like this :TODO toast.success and toast to get all the colors
* */
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
//=========== Toast =================================================

//=========== Sentry =================================================
// we can install this package for our application in this
// https://sentry.io/j but
import * as Sentry from "@sentry/browser";
//=========== Sentry =================================================


import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./App.css";
import config from "../src/config";
class App extends Component {
  state = {
    posts: []
  };

  handleAdd = () => {
    const obj = {
      title: "a",
      body: "b"
    };

    axios.post(config.apiEndPoint, obj)
      .then(res => {
        const { data } = res;
        const posts = [data, ...this.state.posts];
        this.setState({posts});
      }).catch(err => {
        if (err) console.log("err:message", err.message);
    })

  };

  // using the async method introduced in ES6+ you might want to use the
  // standard catch and then provided by axios since they are constantly being
  // maintained
  async componentDidMount() {
    // pending > resolved (success) OR rejected > (failure)
    const {data: posts} = await axios.get(config.apiEndPoint);
    this.setState({ posts })

  }

  handleUpdate = post => {
    post.title = "UPDATED";
    axios.put(`${config.apiEndPoint}/${post.id}`, post)
      .then(res => {
        const posts = [...this.state.posts];
        const index = posts.indexOf(post);
        posts[index] = {...post};
        this.setState({posts});
        toast.success("Updating item");
        toast("Updating item");
      })
      .catch(err => err ? console.log(err.message) : "" );

  };

  handleDelete = post => {
    // we are going to use the original state in case something goes wrong in the server
    // we need to store the data in a variable to use it later
    const originalPosts = this.state.posts;

    axios.delete(`s${config.apiEndPoint}/${post.id}`)
      .then(r => {
        // We will use this line of code below to simulate that there was an error
        // while requesting the delete method,

        // throw new Error("the process failed");
        const posts = this.state.posts.filter(res => res.id !== post.id);
        this.setState({ posts });
      })
      // We can use the catch method from axios to re-render the state in case somthing happened in the
      // back end like this
      .catch(err => {
        // if we have an error that means that our promise was rejected there fore we don't update the state
        // instead we use the previous state
        /*
        * There are two kinds of errors
        * Expected (404: not found) if you are trying to delete an item that does not exists in
        * our database the server will respond with a 400 status meaning that the request was not found  // <- this errors are CLIENT ERRORS
        * Expected (400: bad request) this happens when we are trying to submit a form with invalid data // errors that the user created there for we should try to give feedback
        *
        * Unexpected (network down, server down, db down, bugs) this are errors that should not happen in any substances we need to log them
        * */
        if (err) {
          alert("There was an error while deleting the post");
          this.setState({ posts: originalPosts });

          /*
          * Sentry is a powerful Service that creates issues for you applications since when we are in production we
          * dont have access to the console.log we can see the issues coming from the users computer as they are using
          * our application  the usage is very simple and easy to install.
          *
          * */
          Sentry.captureException(err);
        }


      });

  };

  render() {
    return (
      <React.Fragment>
      <ToastContainer />
        <button className="btn btn-primary" onClick={this.handleAdd}>
          Add
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => this.handleUpdate(post)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.handleDelete(post)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default App;
