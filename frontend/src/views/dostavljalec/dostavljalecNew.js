import React, { useEffect, useState } from "react";
import ScheduleSelector from 'react-schedule-selector'
import {
    Container,
    Grid,
    Typography,
    Button,
    CircularProgress,
    makeStyles,
    TextField,
    Divider,
    Box,
    IconButton,
    Hidden,
    Tooltip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Dialog,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Avatar,
    Paper,
    ListItemAvatar
} from "@material-ui/core";
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import endpoints from '../../endpoints';
import * as Yup from 'yup';
import { Formik } from 'formik';
import DeleteIcon from '@material-ui/icons/Delete';
import FolderIcon from '@material-ui/icons/Folder';
import ReceiptIcon from '@material-ui/icons/Receipt';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
    container: {
        backgroundColor: 'white',
    },
    potrdi: {
        "&:hover": {
            color: "green"
        }
    }
}));

class Dostavljalec extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = {
          redirect: false,
          showError: false,
          showSuccess: false,
          schedule : []
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addNew = this.addNew.bind(this);
        //this.handleClose = this.handleClose.bind(this);
        this.onClick = this.onClick.bind(this);
      }
      onClick() {
        console.log("HELLO");
      }

      handleSubmit(event) {
        event.preventDefault();
        var packageNum = event.target.packageNum.value;
        console.log(packageNum);
        var time = this.state.schedule[0];
        var timeFormated = time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate()+'T'+time.getHours()+':'+time.getMinutes()+':'+time.getSeconds()+'.000'
        this.addNew(packageNum, timeFormated);
      }

      async addNew(packageNum, time){
        this.setState({
            redirect: true,
            showSuccess: true
          });
          this.props.navigate("/app/dashboard");
      }
    
      handleClose(event, reason) {
        if (reason === 'clickaway') {
          return;
        }
        this.setState({
          showError: false
        })
      };

    calChange = newSchedule => {
            if (this.state.schedule.length === 0){
                this.setState({ schedule: newSchedule.slice(0, 1) })
            }
            else{
                if(newSchedule.length > 1){
                    this.setState({ schedule: newSchedule.slice(1, 2) })
                }
            }
    }

 
  render() {
    return (
        <div>
            <Container>
                <Grid container>
                    <Grid item xs={12} style={{ textAlign: "center" }}>
                        <br />
                        <Typography variant="h1" >
                            Dodajanje narocil
                        </Typography>
                    </Grid>
                </Grid>
                <Formik
            initialValues={{
              packageNum: ''
            }}
            validationSchema={
              Yup.object().shape({
                packageNum: Yup.string().required().matches(/^[0-9]+$/, "Must be only digits").min(4, 'Must be exactly 4 digits').max(4, 'Must be exactly 4 digits')
              })
            }
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={this.handleSubmit}>
                <TextField
                  error={Boolean(touched.packageNum && errors.packageNum)}
                  fullWidth
                  helperText={touched.packageNum && errors.packageNum}
                  label="package Number"
                  margin="normal"
                  name="packageNum"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.packageNum}
                  variant="outlined"
                />
                <ScheduleSelector
                    selection={this.state.schedule}
                    name="timePicker"
                    numDays={7}
                    minTime={7}
                    maxTime={15}
                    hourlyChunks={2}
                    timeFormat={"HH:mm"}
                    dateFormat={"DD MMM"}
                    onChange={this.calChange}
                />
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Potrdi
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
            </Container>
        </div>
    )
  }
}

/*function Dostavljalec() {
    const navigate = useNavigate();
    const classes = useStyles();
    const [narocila, setNarocila] = useState([]);
    const [isNarocilaLoaded, setIsNarocilaLoaded] = useState(false);
    
    var state = { "schedule" : [] }
    
    var handleChange = newSchedule => {
        { state.schedule = newSchedule}
    }
    useEffect(() => {
        const naloziNarocila = async () => {
            fetch(endpoints.narocila + "/packages/listPackages", {
                method: 'get'
            })
                .then(res => {
                    return res.json();
                })
                .then(response => {
                    console.log(response);
                    if (response !== null) {
                        setNarocila(response);
                        setIsNarocilaLoaded(true);
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        };
        naloziNarocila();
    }, []);
    var loadingIndicator = (<div style={{textAlign: 'center', marginTop: '100px'}}><CircularProgress /></div>);
    if(isNarocilaLoaded){
        loadingIndicator = ('');
    }

    return (
        <div>
            <Container>
                <Grid container>
                    <Grid item xs={12} style={{ textAlign: "center" }}>
                        <br />
                        <Typography variant="h1" >
                            Dodajanje narocil
                        </Typography>
                    </Grid>
                </Grid>
                <Formik
            initialValues={{
              email: '',
              firstName: '',
              lastName: '',
              password: '',
              policy: false
            }}
            validationSchema={
              Yup.object().shape({
                packageNum: Yup.string().max(255).required('Package number is required'),
                lastName: Yup.string().max(255).required('Last name is required'),
              })
            }
            onSubmit={() => {
              navigate('/app/dashboard', { replace: true });
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <TextField
                  error={Boolean(touched.packageNum && errors.packageNum)}
                  fullWidth
                  helperText={touched.packageNum && errors.packageNum}
                  label="package Number"
                  margin="normal"
                  name="firstName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.packageNum}
                  variant="outlined"
                />
                <ScheduleSelector
        selection={this.state.schedule}
        numDays={5}
        minTime={7}
        maxTime={15}
        hourlyChunks={2}
        timeFormat={"HH:mm"}
        dateFormat={"DD MMM"}
        onChange={this.handleChange}
      />
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Potrdi
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
            </Container>
        </div>
    );
}*/
export default Dostavljalec;