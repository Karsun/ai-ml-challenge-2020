import React, {useEffect, useState} from 'react';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    headerRoot: {
        backgroundColor: theme.palette.primary.main,
        zIndex: 1,
        color: theme.palette.background.default,
        paddingTop: '0.5em',
        flexGrow: 1
    },
    profileArea: {
        width: '100%',
        float: 'right',
        textAlign: 'right',
        '& > *': {
            marginRight: '0.5em'
        },
    },
    profileAreaMd: {
        width: '100%',
        float: 'right',
        textAlign: 'right',
        '& > *': {
            marginRight: '0.5em',
        },
    },
    fabButtons: {
        background: theme.palette.primary.main,
        color: theme.palette.background.default
    }
}));

const Header = ({name}) => {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = useState(null);

    const showProfile = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <div id="header" name="header" className={classes.headerRoot}>
            <Grid container spacing={1}>
                <Grid item xs={1}>
                    <img id="logo" style={{'width': '8em'}} src={"/logo.png"} alt="Logo" />
                </Grid>
                <Grid item xs={9}>
                    <div style={{textAlign:"center"}}>
                        <Typography variant={"h6"} style={{paddingTop: '0.5em'}}>
                            EULA T&C Classifier
                        </Typography>
                    </div>
                </Grid>

                <Grid item xs={2} >
                    <div className={classes.profileArea}>
                        <Typography variant="overline" style={{overflow: 'wrap'}}>
                            Welcome, {name}
                        </Typography>
                        <Fab id="profileCard" onClick={showProfile} className={classes.fabButtons}>
                            <Avatar alt={name} >
                            </Avatar>
                        </Fab>
                    </div>
                </Grid>
            </Grid>
        </div>
    );

}

export default Header;