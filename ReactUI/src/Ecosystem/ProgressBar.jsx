import React from "react";

const ProgressBar = (props) => {
  const { bgcolor, completed } = props;
  const containerStyles = {
    height: 23,
    width: '96%',
    backgroundColor: "#e0e0de",
    borderRadius: 50,
    margin: 12,
  }

  const fillerStyles = {
    height: '100%',
    width: `${completed}%`,
    backgroundColor: bgcolor,
    borderRadius: 'inherit',
    textAlign: 'right'
  }

  const labelStyles = {
    padding: 5,
    color: 'white',
    fontWeight: 'bold'
  }

  return (
    <div style={containerStyles} className="progressbarContainer">
      <div style={fillerStyles} className="progressbarFilter">
        <span style={labelStyles} className="progressbarContent">{`${completed}%`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;