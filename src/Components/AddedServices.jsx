import React from 'react';


const AddedServices = (props) => {
  return (
    <section className="service-card">
      <div className="service-details">
        <div><strong>Service:</strong> {props.details.resource}</div>
        <div><strong>Region:</strong> {props.details.region}</div>
        <div><strong>Units:</strong> {props.details.unit}</div>
      </div>
      <button
        className="remove-button"
        onClick={props.handleclick}
        title="Remove this service"
      >
        ×
      </button>
    </section>
  );
};

export default AddedServices;
