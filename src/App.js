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
    console.log("Delete", post);
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
