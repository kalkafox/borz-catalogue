import { animated as a } from "react-spring";
import { CircularProgress } from "@mui/material";

const Load = (props) => {
  return (
    <a.div style={props.circularSpring} className="">
      <span className="text-6xl absolute m-16">🐍</span>
      <CircularProgress
        variant={props.progress > 5 ? "determinate" : "indeterminate"}
        value={props.progress}
        sx={{ color: "#b67f37ff" }}
        size={200}
        className="rounded-3xl"
      />
    </a.div>
  );
};

export default Load;
