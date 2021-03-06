import React, { Component } from 'react';
import { saveWorkout } from '../../services/workoutService.js';

const BaseJoi = require('joi-browser');
const Extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(Extension);

class WorkoutNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workout: {
        date: "",
      },
      errors: {}
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  schema = {
    date: Joi.date().format('MM-DD-YYYY').label('Workout Date')
  };

  validate() {
    const { error: errors } = Joi.validate(this.state.workout, this.schema, { abortEarly: false });
    if (!errors) return null;

    const found_errors = {};
    for (let error of errors.details) {
      found_errors[error.path[0]] = error.message;
    }
    return found_errors;
  }

  validateProperty({ name, value }) {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  }

  handleChange(event) {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(event.currentTarget);
    if (errorMessage) {
      errors[event.currentTarget.name] = errorMessage;
    } else {
      delete errors[event.currentTarget.name];
    }

    const workout = { ...this.state.workout };
    workout[event.currentTarget.name] = event.currentTarget.value;

    this.setState({ workout, errors });
  }

  async handleSubmit(event) {
    event.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) { return; }

    try {
      await saveWorkout(this.state.workout);
      this.props.history.push('/workouts/index');
    } catch (exception) {
      if (exception.response && exception.response.status === 400) {
        alert(exception.response.data.errmsg);
      }
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} className="card bg-light">
          <div className="card-body">
            <h4>New Workout</h4>
            <div className="form-group">
              <label htmlFor="inlineFormInputDate">Date</label>
              <input
                name="date"
                type="text"
                className="form-control"
                id="inlineFormInputDate"
                value={this.state.workout.date}
                onChange={this.handleChange}
              />
              {this.state.errors.date && <div className="alert alert-danger">{this.state.errors.date}</div>}
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    );
  }
}

export default WorkoutNew;
