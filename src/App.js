// language=JSX
import React, { Component } from "react";
import axios from "axios";
import "./App.css";

const apiEndPoint = "https://jsonplaceholder.typicode.com/posts";
class App extends Component {
  state = {
    posts: []
  };

  handleAdd = () => {
    const obj = {
      title: "a",
      body: "b"
    };

    axios.post(apiEndPoint, obj)
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
    const {data: posts} = await axios.get(apiEndPoint);
    this.setState({ posts })

  }

  handleUpdate = post => {
    post.title = "UPDATED";
    axios.put(`${apiEndPoint}/${post.id}`, post)
      .then(res => {
        const posts = [...this.state.posts];
        const index = posts.indexOf(post);
        posts[index] = {...post};
        this.setState({posts});
      })
      .catch(err => err ? console.log(err.message) : "" );

  };

  handleDelete = post => {
    // we are going to use the original state in case something goes wrong in the server
    // we need to store the data in a variable to use it later
    const originalPosts = this.state.posts;

    axios.delete(`${apiEndPoint}/${post.id}`)
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
          console.log(err.message);
        }


      });

  };

  render() {
    return (
      <React.Fragment>
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
