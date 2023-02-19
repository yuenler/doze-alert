const format_time = (time) => {
  const date = new Date(time);
  return date.toLocaleString();
}


const Activity = ({ times }) => {
  return (
    <div style={{ margin: 20 }}>
      <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
        <h1>Driving Activity</h1>
      </div>
      <div style={{ textAlign: 'center' }}>
        <h3>Previous dozed off times</h3>
      </div>
      <div style={{ textAlign: 'center' }}>
        {times &&
          times.map((time, index) => {
            return (
              <div key={index} style={{ margin: 10, backgroundColor: "#f8bcbc", borderRadius: 10 }}>
                {format_time(time)}
              </div>
            )
          }
          )

        }
      </div>
      <div style={{ textAlign: 'center' }}>
        {times.length === 0 &&
          <div style={{ margin: 10, backgroundColor: "#f8bcbc", borderRadius: 10 }}>
            Woohoo! You have not dozed off!
          </div>
        }
      </div>
    </div>
  );
};

export default Activity;