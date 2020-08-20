import React, {useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import {Typography, Button, Grid} from '@material-ui/core';
import {makeStyles, useTheme} from '@material-ui/core/styles';

const ParsedContentViewer = ({currentEvals}) => {

    const theme = useTheme();
    const [evaluations, setEvaluations] = useState();

    const columns = [
        { title: 'Clause', field: 'sectionName', editable: 'false', cellStyle: {width: '80%'}},
        { title: 'Total Clauses', field: 'totalClauses', type: 'numeric', editable: 'false', cellStyle: {width: '10%'} },
        { title: 'Unacceptable', field: 'unacceptable', type: 'numeric', editable: 'false', cellStyle: {width: '10%'} },
        { title: 'Clauses', field: 'clauses', editable: 'false', hidden: 'true'},
    ];

    useEffect(() => {
        setEvaluations(currentEvals);
    }, [currentEvals]);

    return (
        <MaterialTable
            title="Classified EULA Clauses"
            columns={columns}
            data={evaluations}
            options={{pageSize: 20}}
            detailPanel={rowData => {
                console.log(rowData);
                return (
                    <div>
                        {rowData.clauses.map(c => {
                            const v = c.prediction === 1 ? theme.palette.error.light : theme.palette.background.paper
                            return (
                                <Grid container>
                                    <Grid item xs={10}>
                                        <Typography variant="body2" style={{backgroundColor: v, margin: '0.5em'}}>
                                            {c.text} ({'Confidence: ' + c.acc_prob + "%"})
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Button>Dispute</Button>
                                    </Grid>
                                </Grid>
                            )
                        })}
                    </div>
                )
            }}
        />
    );
}

export default ParsedContentViewer;