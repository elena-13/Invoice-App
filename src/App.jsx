import React, { Fragment } from 'react';

import Header from './components/header/header';
import { Grid, Row, Col } from 'react-bootstrap';

const App = ({ children }) => (
    <Grid>
        <Row>
            <Col md={12}>
                <Header/>
            </Col>
        </Row>
        <Row>
            {children}
        </Row>
    </Grid>
)

export default App;