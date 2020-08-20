import React, {useEffect, useState} from 'react';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    headerRoot: {
        backgroundColor: theme.palette.background.paper,
        zIndex: 1,
        color: theme.palette.background.default,
        paddingTop: '0.5em',
        flexGrow: 1,
    },
    fabButtons: {
        background: theme.palette.primary.main,
        color: theme.palette.background.default
    }
}));

const FileUploader = ({onFileUpload}) => {
    const classes = useStyles();
    const [file, setFile] = useState(null)

    const handleFile = (e) => {
        const { target: { value, files } } = e;
        const file = files[0];
        setFile({name: file.name});
        onFileUpload(e);
    }

    return (
        <div id="FileUploader" name="FileUploader" className={classes.headerRoot}>
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <div style={{padding: '0.5em'}}>
                        {!file && (
                            <Typography variant="subtitle1" color="textPrimary">
                                Upload a EULA file to process it's contents and identify sections that may be unacceptable for the Government.
                            </Typography>
                        )}
                        {file && (
                            <Typography variant="subtitle1" color="textPrimary">
                                Current file: {file.name}
                            </Typography>
                        )}
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <div style={{paddingBottom: '0.5em'}}>

                        <input
                            className={classes.input}
                            style={{display: 'none'}}
                            id="raised-button-file"
                            multiple
                            type="file"
                            accept=".doc,.docx,application/pdf"
                            onChange={(e) => handleFile(e)}
                        />
                        <label htmlFor="raised-button-file">
                            <Button variant="contained" component="span" className={classes.button} color="secondary">
                                Browse & Upload
                            </Button>
                        </label>
                    </div>
                </Grid>

            </Grid>
        </div>
    );

}

export default FileUploader;