const useState  = React.useState;
const useEffect = React.useEffect;
const useRef    = React.useRef;

const icon = {
  cursor: "pointer",
};
const audioSrc =
  "";

function App() {
  const [disp, setDisp]                   = useState(25 * 60);
  const [breakLength, setBreakLength]     = useState(5  * 60);
  const [sessionLength, setSessionLength] = useState(25 * 60);
  const [timerOn, setTimerOn]             = useState(false);
  const [onBreak, setOnBreak]             = useState(false);

  let user = useRef(null);

  useEffect(() => {
    if (disp <= 0) {
      setOnBreak(true);
      breakSound();
    } else if (!timerOn && disp === breakLength) {
      setOnBreak(false);
    }
  }, [disp, onBreak, timerOn, breakLength, sessionLength]);

  const breakSound = () => {
    user.currentTime = 0;
    user.play();
  };

  const formatDispTime = (time) => {
    let mins = Math.floor(time / 60);
    let secs = time % 60;
    return (
      (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs)
    );
  };

  const formatTime = (time) => {
    return time / 60;
  };

  const updateTime = (amount, type) => {
    if (type === "break") {
      if ((breakLength <= 60 && amount < 0) || breakLength >= 60 * 60) {
        return;
      }
      setBreakLength((prev) => prev + amount);
    } else {
      if ((sessionLength <= 60 && amount < 0) || sessionLength >= 60 * 60) {
        return;
      }
      setSessionLength((prev) => prev + amount);
      if (!timerOn) {
        setDisp(sessionLength + amount);
      }
    }
  };

  const timeControl = () => {
    let sec      = 1000;
    let date     = new Date().getTime();
    let nextDate = new Date().getTime() + sec;
    let onBreakVariable = onBreak;

    if (!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setDisp((prev) => {
            if (prev <= 0 && !onBreakVariable) {
              // breakSound();
              onBreakVariable = true;
              return breakLength;
            } else if (prev <= 0 && onBreakVariable) {
              // breakSound();
              onBreakVariable = false;
              setOnBreak(false);
              return sessionLength;
            }
            return prev - 1;
          });
          nextDate += sec;
        }
      }, 30);
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }
    if (timerOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }
    setTimerOn(!timerOn);
  };

  const resetTime = () => {
    clearInterval(localStorage.getItem("interval-id"));
    setDisp(25 * 60);
    setBreakLength(5 * 60);
    setSessionLength(25 * 60);
    user.pause();
    user.currentTime = 0;
    setTimerOn(false);
    setOnBreak(false);
  };

  return (
    <div className="container App">
      <div className="row">
        <h1 className="title display-3 mb-5 col-md-12 text-center">
          25 + 5 Clock
        </h1>
      </div>

      <div className="row double d-flex">
        <ControlComponent
          title={"Break Length"}
          updateTime={updateTime}
          time={breakLength}
          formatTime={formatTime}
          type={"break"}
          formatDisplayTime={formatDispTime}
        />
        <ControlComponent
          title      = {"Session Length"}
          updateTime = {updateTime}
          time       = {sessionLength}
          formatTime = {formatTime}
          type       = {"session"}
          formatDisplayTime = {formatDispTime}
        />
      </div>
      <div className="row">
        <div className="clock col-md-12 d-flex justify-content-center">
          <div className={timerOn ? "mt-5" : "null mt-5"}>
            <span className={timerOn ? null : "box2"}></span>
            <h2 className="text-center display-4" id="timer-label">
              {onBreak ? "Break" : "Session"}
            </h2>
            <h1 className="timer display-1 text-center" id="time-left">
              {formatDispTime(disp)}
            </h1>
          </div>
        </div>
        <div className="col-md-12">
          <div className="buttons d-flex justify-content-center align-content-center mt-3">
            <span id="start_stop" onClick={timeControl}>
              {timerOn ? (
                <i className="fas fa-pause fa-4x m-3" style={icon}></i>
              ) : (
                <i
                  className="fas fa-play fa-4x m-3"
                  style={icon}
                  id="start_stop"
                ></i>
              )}
            </span>
            <i
              className="fas fa-sync-alt fa-4x m-3"
              style={icon}
              id="reset"
              onClick={resetTime}
            ></i>
          </div>
        </div>
      </div>
      <audio ref={(t) => (user = t)} src={audioSrc} id="beep" />
    </div>
  );
}

function ControlComponent({
  title,
  updateTime,
  type,
  time,
  formatTime
}) {
  return (
    <div className="col-md-6">
      <h1
        className="text-center"
        id={type === "break" ? "break-label" : "session-label"}
      >
        {title}
      </h1>
      <div className="d-flex justify-content-center align-items-center">
        <div className="arrow">
          <i
            className="fas fa-arrow-circle-up fa-4x"
            id={type === "break" ? "break-increment" : "session-increment"}
            style={icon}
            onClick={() => updateTime(60, type)}
          ></i>
        </div>
        <h3
          className="m-5 display-4"
          id={type === "break" ? "break-length" : "session-length"}
        >
          {formatTime(time)}
        </h3>
        <div className="arrow">
          <i
            className="fas fa-arrow-circle-down fa-4x"
            id={type === "break" ? "break-decrement" : "session-decrement"}
            style={icon}
            onClick={() => updateTime(-60, type)}
          ></i>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
