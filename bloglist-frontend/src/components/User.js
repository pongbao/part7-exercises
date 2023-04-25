import { Link } from "react-router-dom";

const User = ({ result, users }) => {
  if (result.isLoading) {
    return <div>loading data...</div>;
  }

  return (
    <div>
      <h1>users</h1>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={user.id}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default User;
