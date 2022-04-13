import { Box, Button, Container } from '@chakra-ui/react';
import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { Card, CardBody, CardSubtitle, CardText, CardTitle } from 'reactstrap';
import ModalAddWarehouse from '../Components/ModalAddWarehouse';
import { API_URL } from '../helper';
import { getWarehouse } from '../redux/actions';

class WarehousePage extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        ModalAddWarehouse: false,
    }

    componentDidMount() {
        console.log("cek get warehouse", this.props.warehouseList)
        this.props.getWarehouse()
    }

    printWarehouseList = () => {
        return this.props.warehouseList.map((value, index) => {
            return (
                <Box style={{ paddingTop: "10px", paddingBottom: "10px" }}>
                    <Card
                        style={{ borderColor: "#6b3c3b", borderRadius: "9px" }}
                    >
                        <CardBody>
                            <Box className='row'>
                                <CardTitle className='col-9'>
                                    <Box style={{ fontWeight: 600 }}>
                                        {value.provinsi}
                                    </Box>
                                </CardTitle>
                                <CardTitle className='col-3'>
                                    <Box style={{ fontWeight: 600 }}>
                                        {value.nama}
                                    </Box>
                                </CardTitle>
                            </Box>
                            <Box>
                                <CardSubtitle
                                    className="mb-2 text-muted"
                                >
                                    {value.kota}
                                </CardSubtitle>                                
                            </Box>
                            <Box className='row' style={{ paddingTop: "10px" }}>
                                <CardText className='col-9' style={{alignSelf:"center"}}>
                                    {value.alamat}
                                </CardText>
                                <CardText className='text-muted col-3'>
                                <p>Latitude: {value.latitude}</p>
                                    <p>Longitude: {value.longitude}</p>
                                </CardText>
                            </Box>
                            <Box className='row' style={{ width: "40%", paddingTop: "20px" }}>
                                <Box className='col-6'>
                                    <Button
                                        colorScheme={'blackAlpha'}
                                        color='#6b3c3b'
                                        variant='outline'
                                    >
                                        Edit Warehouse
                                    </Button>
                                </Box>
                                <Box className='col-6'>
                                    <Button
                                        colorScheme={'teal'}
                                    >
                                        Delete Warehouse
                                    </Button>
                                </Box>
                            </Box>
                        </CardBody>
                    </Card>
                </Box>
            )
        })
    }

    render() {
        console.log("cetak warehouselist", this.props.warehouseList)
        return (
            <Box className='container'>
                <ModalAddWarehouse
                    ModalAddWarehouse={this.state.ModalAddWarehouse}
                    btClose={() => this.setState({ ModalAddWarehouse: !this.state.ModalAddWarehouse })}
                />
                <Box style={{ padding: '50px' }}>
                    <Box style={{ textAlign: "right" }}>
                        <Button
                            colorScheme={'blackAlpha'}
                            color='#6b3c3b'
                            variant={'outline'}
                            onClick={() => this.setState({ ModalAddWarehouse: !this.state.ModalAddWarehouse })}
                        >
                            Add Warehouse
                        </Button>
                    </Box>
                    <Box>
                        {this.printWarehouseList()}
                    </Box>
                </Box>
            </Box>
        );
    }
}

const mapToProps = (state) => {
    return {
        warehouseList: state.userReducer.warehouseList,
        idwarehouse: state.userReducer.idwarehouse,
        iduser: state.userReducer.iduser
    }
}

export default connect(mapToProps, { getWarehouse })(WarehousePage);