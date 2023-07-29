import {
  NoSsr,
  TableCell,
  Button,
  Tooltip,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@material-ui/icons/Delete";
import MUIDataTable from "mui-datatables";
import { withSnackbar } from "notistack";
import React, { useState } from "react";
import Moment from "react-moment";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateProgress } from "../../lib/store";
import { iconMedium } from "../../css/icons.styles";
import { Avatar, Chip, FormControl, MenuItem } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ExploreIcon from '@mui/icons-material/Explore';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import classNames from "classnames";
import Select from '@mui/material/Select';

const styles = (theme) => ({
  grid : { padding : theme.spacing(2) },
  tableHeader : {
    fontWeight : "bolder",
    fontSize : 18,
  },
  muiRow : {
    "& .MuiTableRow-root" : {
      cursor : "pointer",
    },
  },
  createButton : {
    display : "flex",
    justifyContent : "flex-start",
    alignItems : "center",
    whiteSpace : "nowrap",
  },
  topToolbar : {
    margin : "2rem auto",
    display : "flex",
    justifyContent : "space-between",
    paddingLeft : "1rem",
  },
  viewSwitchButton : {
    justifySelf : "flex-end",
    marginLeft : "auto",
    paddingLeft : "1rem",
  },
  statusCip : {
    "& .MuiChip-label" : {
      paddingTop : "3px",
      fontWeight : "400",
    },
    borderRadius : "3px !important",
    display : "flex",
    width : "117px",
    padding : "6px 8px",
    alignItems : "center",
    gap : "5px",
  },
  ignored : {
    "& .MuiChip-label" : {
      color : "#51636B",
    },
    background : "#51636B15 !important"
  },
  connected : {
    "& .MuiChip-label" : {
      color : "#00B39F",
    },
    background : "#00B39F15 !important"
  },
  registered : {
    "& .MuiChip-label" : {
      color : "#477E96 !important",
    },
    background : "#477E9615 !important"
  },
  discovered : {
    "& .MuiChip-label" : {
      color : "#EBC017",
    },
    background : "#EBC01715 !important"
  },
});

function Connections({ classes }) {
  const [page] = useState(0);
  const [count] = useState(0);
  const [pageSize] = useState(10);
  const [connections] = useState([
    {
      id : "681946c4-8136-4348-bdaf-c9d50ffb47a8",
      element : "Prometheus-2",
      cluster : "cluster-name",
      environment : "environment 1",
      updated_at : "2023-04-25T18:30:29.337724Z",
      discovered_at : "2023-04-14T20:09:00.556036Z",
      asdf : "100",
      status : "Ignored"
    },
    {
      id : "681946c4-8136-4348-bdaf-c9d50ffb47a8",
      element : "Prometheus-1",
      cluster : "cluster-name",
      environment : "environment 1",
      updated_at : "2023-04-25T18:30:29.337724Z",
      discovered_at : "2023-04-14T20:09:00.556036Z",
      asdf : "100",
      status : "Connected"
    }
  ]);


  const status = (value) => {
    switch (value) {
      case 'Ignored':
        return <Chip className={classNames(classes.statusCip, classes.ignored)} avatar={<RemoveCircleIcon style={{ color : "#51636B" }} />} label={value} />
      case 'Connected':
        return <Chip className={classNames(classes.statusCip, classes.connected)} avatar={<CheckCircleIcon style={{ color : "#00B39F" }}/>} label={value} />
      case 'Registered':
        return <Chip className={classNames(classes.statusCip, classes.registered)} avatar={<AssignmentTurnedInIcon style={{ color : "#477E96" }} />} label={value} />
      case 'Discovered':
        return <Chip className={classNames(classes.statusCip, classes.discovered)} avatar={<ExploreIcon style={{ color : "#EBC017" }} />} label={value} />
      default:
        return "-"
    }
  }

  const columns = [
    {
      name : "element",
      label : "Element",
      options : {
        customHeadRender : function CustomHead({ index, ...column }) {
          return (
            <TableCell key={index}>
              <b>{column.label}</b>
            </TableCell>
          );
        },
      },
    },
    {
      name : "cluster",
      label : "Cluster",
      options : {
        customHeadRender : function CustomHead({ index, ...column }) {
          return (
            <TableCell key={index}>
              <b>{column.label}</b>
            </TableCell>
          );
        },
        customBodyRender : function CustomBody(/* value */) {
          return <Chip avatar={<Avatar>M</Avatar>} label={'value'} />;
        },
      },
    },
    {
      name : "environment",
      label : "Environment",
      options : {
        customHeadRender : function CustomHead({ index, ...column }) {
          return (
            <TableCell key={index}>
              <b>{column.label}</b>
            </TableCell>
          );
        },
        customBodyRender : function CustomBody(value) {
          return (
            <FormControl sx={{ m : 1, minWidth : 120 }} size="small">
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={value}
                label="Environment"
                onChange={handleChange}
              >
                <MenuItem value={"environment 1"}>environment 1</MenuItem>
                <MenuItem value={"environment 2"}>environment 2</MenuItem>
              </Select>
            </FormControl>
          );
        },
      },
    },
    {
      name : "updated_at",
      label : "Update At",
      options : {
        customHeadRender : function CustomHead({ index, ...column }) {
          return (
            <TableCell key={index}>
              <b>{column.label}</b>
            </TableCell>
          );
        },
        customBodyRender : function CustomBody(value) {
          return (
            <Tooltip title={<Moment startOf="day" format="LLL">{value}</Moment>} placement="top" arrow interactive >
              <Moment format="LL">{value}</Moment>
            </Tooltip>
          );
        },
      },
    },
    {
      name : "discoverd_at",
      label : "Discoverd At",
      options : {
        customHeadRender : function CustomHead({ index, ...column }) {
          return (
            <TableCell key={index}>
              <b>{column.label}</b>
            </TableCell>
          );
        },
        customBodyRender : function CustomBody(value) {
          return (
            <Tooltip title={<Moment startOf="day" format="LLL">{value}</Moment>} placement="top" arrow interactive >
              <Moment format="LL">{value}</Moment>
            </Tooltip>
          );
        },
      },
    },
    {
      name : "asdf",
      label : "asdf",
      options : {
        customHeadRender : function CustomHead({ index, ...column }) {
          return (
            <TableCell key={index}>
              <b>{column.label}</b>
            </TableCell>
          );
        },
      },
    },
    {
      name : "status",
      label : "Status",
      options : {
        customHeadRender : function CustomHead({ index, ...column }) {
          return (
            <TableCell key={index}>
              <b>{column.label}</b>
            </TableCell>
          );
        },
        customBodyRender : function CustomBody(value) {
          return (
            status(value)
          );
        },
      },
    },
  ];

  const handleChange = () => {
    // Select change
  }

  const options = {
    filter : false,
    responsive : "standard",
    resizableColumns : true,
    serverSide : true,
    count,
    rowsPerPage : pageSize,
    rowsPerPageOptions : [10, 20, 25],
    fixedHeader : true,
    page,
    print : false,
    download : false,
    textLabels : {
      selectedRows : {
        text : "connection(s) selected",
      },
    }
  };

  return (
    <>
      <NoSsr>
        <div className={classes.topToolbar}>
          <div className={classes.createButton}>
            <div>
              <Button
                aria-label="Rediscover"
                variant="contained"
                color="primary"
                size="large"
                // @ts-ignore
                onClick={() => {}}
                style={{ marginRight : "2rem" }}
              >
                <SearchIcon style={iconMedium} />
                Rediscover
              </Button>
            </div>
          </div>
          <div
            className={classes.searchAndView}
            style={{
              display : "flex",
              alignItems : "center",
              justifyContent : "flex-end",
              height : "5ch",
            }}
          >
            <Button
              aria-label="Edit"
              variant="contained"
              color="primary"
              size="large"
              // @ts-ignore
              onClick={() => {}}
              style={{ marginRight : "0.5rem" }}
            >
              <EditIcon style={iconMedium} />
            </Button>
            <Button
              aria-label="Delete"
              variant="contained"
              color="primary"
              size="large"
              // @ts-ignore
              onClick={() => {}}
              style={{ background : "#8F1F00" }}
            >
              <DeleteIcon style={iconMedium} />
              Delete
            </Button>
          </div>
        </div>
        <MUIDataTable
          data={connections}
          columns={columns}
          // @ts-ignore
          options={options}
          className={classes.muiRow}
        />
      </NoSsr>
    </>
  );
}

const mapDispatchToProps = (dispatch) => ({ updateProgress : bindActionCreators(updateProgress, dispatch) });

const mapStateToProps = (state) => {
  return { user : state.get("user")?.toObject(), selectedK8sContexts : state.get("selectedK8sContexts") };
};

// @ts-ignore
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(withSnackbar(Connections)));

