import React, { Component} from 'react';
import { Link } from 'react-router-dom';
import { getUser } from '../../services/userService.js';
import { getWorkouts } from '../../services/workoutService.js';
import Spinner from '../reusable/spinner';

class UserShow extends Component {
  state = {
    user: {},
    workouts: [],
    api_response: false
  };

  async componentDidMount() {
    const { data: user } = await getUser();
    const { data: workouts } = await getWorkouts();
    this.setState({ user, workouts, api_response: true });
  }

  render() {
    return (
      <Spinner ready={this.state.api_response}>
        <div className="card">
          <div className="card-header bg-light">
            <h4 className="card-title">Profile</h4>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <span className="card-text font-weight-bold">Name: </span>
              {this.state.user.name}
            </li>
            <li className="list-group-item">
              <span className="card-text font-weight-bold">Email: </span>
              {this.state.user.email}
            </li>
            <li className="list-group-item">
              <span className="font-weight-bold">Workouts: </span>
              {this.state.workouts.length}
            </li>
          </ul>
          <div className="card-body">
            <Link
              to="/users/me/edit" className="btn btn-info">
              Edit User
            </Link>
          </div>
        </div>
      </Spinner>
    );
  }
}

export default UserShow;
