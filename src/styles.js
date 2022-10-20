import { makeStyles } from "@mui/styles";

export default makeStyles(() => ({
  root: {
    display: "flex",
    height: "100%",
    width: "100%",
  },
  content: {
    flexGrow: 1,
    padding: "2em",
    width: "100vw",
  },
  toolbar: {
    height: "70px",
  },
}));
