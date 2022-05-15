import { Badge, Box, Button, Center, FormControl, FormLabel, Heading, Icon, Image, Input, InputGroup, InputLeftAddon, InputRightAddon, InputRightElement, Select, Text } from '@chakra-ui/react'
import { Pagination } from '@mantine/core'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import MenuManagement from '../Components/MenuManagement'
import { API_URL } from '../helper'
import { getRequest, outgoingRequest } from '../redux/actions'
import { IoSearch } from 'react-icons/io5'
import { BsCalendar2Week } from 'react-icons/bs'
import moment from 'moment'

const OutgoingRequest = (props) => {
    const dispatch = useDispatch()
    const [status, setStatus] = useState([{ id: null, status: 'Semua' }, { id: 7, status: 'Antrian' }, { id: 8, status: 'On Process' }, { id: 9, status: 'Diterima' }, { id: 10, status: 'Rejected' }])
    const [page, setPage] = useState(1)
    const [limitData, setLimitData] = useState(5)
    const [activeIdx, setActiveIdx] = useState(0)
    const [filter, setFilter] = useState({ idstatus: null, fromDate: '', toDate: '' })
    const [loading, setLoading] = useState(true)
    const [outgoingList, setoutgoingList] = useState([])


    // const { requestList } = useSelector((state) => {
    //     return {
    //         requestList: state.transactionAdminReducer.requestList
    //     }
    // })

    useEffect(() => {
        // dispatch(getRequest())
        getData()
    }, [])

    const getData = async () => {
        try {
            let res = await dispatch(outgoingRequest())
            if(res.success) {
                setoutgoingList(res.data)
            }
        } catch (error) {
            
        }
    }

    const { idrole } = useSelector((state) => {
        return {
            idrole: state.userReducer.idrole
        }
    })

    const btfilterStatus = async (index = 0, idstatus = null) => {
        setActiveIdx(index)
        try {
            let res = await dispatch(outgoingRequest({ idstatus: idstatus }))
            if (res.success) {
                setoutgoingList(res.data)                
                setFilter({ idstatus: null, fromDate: '', toDate: '' })
                setPage(1)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const filterTanggal = async () => {        
        try {
            setLoading(true)
            let res = await dispatch(outgoingRequest(filter))
            if (res.success) {
                setoutgoingList(res.data)                
                setLoading(false)
                setActiveIdx(0)
                setPage(1)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const btResetFilter = async () => {
        try {
            let res = await dispatch(outgoingRequest())
            if (res.success) {                
                setoutgoingList(res.data)                
                setFilter({ idstatus: null, fromDate: '', toDate: '' })
                setActiveIdx(0)
                setPage(1)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const printStatus = () => {
        return status.map((item, index) => {
            return (
                <>
                    <Box mx='5px'>
                        <Button size='xs' colorScheme='blackAlpha' bgColor={activeIdx == index ? '#6B3C3B' : ''} borderRadius='full' fontSize='13px' onClick={() => btfilterStatus(index, item.id)} >{item.status}</Button>
                    </Box>
                </>
            )
        })
    }    

    const btDiterima = async (idtransaksi_warehouse, idproduct, idstock, index) => {
        try {
            let date = moment().format().slice(0, 19).replace('T', ' ');
            let token = localStorage.getItem('data')
            // let temp = [...outgoingList]            
            let data = {
                idstatus: 9,
                date,
                qty: outgoingList[index].stock
            }
            Swal.fire({
                title: 'Request Sudah Diterima?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Pesanan Sudah Diterima!'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    Swal.fire(
                        'Berhasil!',
                        'Barang Sudah Diterima.',
                        'success',
                        await axios.patch(`${API_URL}/transactionwarehouse/diterima/${idtransaksi_warehouse}/${idproduct}/${idstock}`, data, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        }),
                        dispatch(getData())
                    )
                }
            })
                // .then(res => {
                //     console.log("cek res.data", res.data)
                //     Swal.fire({
                //         position: 'center',
                //         icon: 'success',
                //         title: 'Barang Diterima',
                //         showConfirmButton: false,
                //         timer: 1500
                //     })
                // })
                .catch((err) => {
                    console.log(err)
                })

            // dispatch(getData())
        } catch (error) {
            console.log(error)
        }
    }

    const btBatal = async (idtransaksi_warehouse) => {
        try {
            let date = moment().format().slice(0, 19).replace('T', ' ');
            let token = localStorage.getItem('data')
            let data = {
                idstatus: 10,
                date
            }
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Batalkan Transaksi!'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    Swal.fire(
                        'Rejected!',
                        'Request Dibatalkan',
                        'success',
                        await axios.patch(`${API_URL}/transactionwarehouse/reject/${idtransaksi_warehouse}`, data, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        }),
                        dispatch(getData())
                    )
                }
            })
                // .then(res => {
                //     console.log("cek res.data", res.data)
                //     Swal.fire({
                //         position: 'center',
                //         icon: 'success',
                //         title: 'Batalkan Request',
                //         showConfirmButton: false,
                //         timer: 1500
                //     })
                // })
                .catch((err) => {
                    console.log(err)
                })

            // dispatch(getData())
        } catch (error) {
            console.log(error)
        }
    }

    const printRequest = () => {
        if (outgoingList.length > 0) {
            return outgoingList.slice(page > 1 ? (page - 1) * limitData : page - 1, page * limitData).map((item, index) => {
                let newAddedDate = moment(item.added_date).locale('id').format('LL')
                let newUpdatedDate = moment(item.updated_date).locale('id').format('LLL')
                return (
                    <>
                        <Box mt='20px' p='4' border='2px solid #F3F4F5' borderRadius='10px'>
                            <Box display='flex'>
                                <Text>Request {newAddedDate}</Text>                                
                                {item.idstatus === 10 && idrole === 2 && <Badge colorScheme='red' variant={'subtle'} ml='2'>Rejected</Badge>}
                                {item.idstatus === 8 && idrole === 2 && <Badge colorScheme='green' variant={'subtle'} ml='2'>On Process</Badge>}
                                {item.idstatus === 7 && idrole === 2 && <Badge colorScheme='purple' variant={'subtle'} ml='2'>Antrian</Badge>}
                                {item.idstatus === 9 && idrole === 2 && <Badge colorScheme='messenger' variant={'subtle'} ml='2'>Diterima</Badge>}
                                <Text fontWeight='semibold' ml='2' mr='2'>{item.invoice}</Text>
                                {
                                    item.updated_date &&
                                    <Text marginLeft={'auto'}>Updated: {newUpdatedDate}</Text>
                                }
                            </Box>
                            <Box mt='10px'>
                                <Text fontWeight='semibold'>{item.warehouse}</Text>
                                <Text fontWeight='semibold'>Warehouse : {item.nama_pengirim}</Text>
                            </Box>
                            <Box display='flex' justifyContent='space-between'>
                                <Box mt='10px' display='flex'>
                                    <Image src={`${API_URL}/${item.images[0].url}`} w='80px' borderRadius='10px' />
                                    <Center>
                                        <Box mx='15px'>
                                            <Text>{item.nama_product}</Text>
                                            <Text>{item.stock} item</Text>
                                            <Text>Rp.{(item.ongkir).toLocaleString()}</Text>
                                        </Box>
                                    </Center>
                                </Box>
                                <Box mr='50px' borderLeft='1px solid gray'>
                                    <Box ml='20px' my='20px'>
                                        <Text fontWeight='semibold'>Total Ongkir</Text>
                                        <Text>Rp.{(item.ongkir).toLocaleString()}</Text>
                                    </Box>
                                </Box>
                            </Box>
                            <Box mt='15px' display='flex' justifyContent='end'>
                                {item.idstatus === 7 && idrole === 2 && <Button size='xs' colorScheme='blackAlpha' onClick={() => btBatal(item.idtransaksi_warehouse)} bgColor='red'>Batalkan</Button>}                                
                                {item.idstatus === 8 && idrole === 2 && <Button size='xs' colorScheme='blackAlpha' onClick={() => btDiterima(item.idtransaksi_warehouse, item.idproduct, item.idstock, index)} bgColor='green'>Barang Diterima</Button>}                                
                            </Box>
                        </Box>
                    </>
                )
            })
        } else {
            return (
                <>
                    <Box display='flex' justifyContent='center' my='20vh'>
                        <Heading as='h3' size='lg'>Belum ada transaksi</Heading>
                    </Box>
                </>
            )
        }
    }

    console.log(`outgoingList`, outgoingList)
    // console.log(`outgoingList.Stock Njeng`, outgoingList.stock[0])
    return (
        <>
            <Box>
                <Box mx='6%' my='2%'>
                    <Box display='flex' w={'105%'}>
                        <MenuManagement />
                        <Box ml='2%'>
                            <Heading as='h3' size='lg'>
                                List Request
                            </Heading>
                            <Box display='flex' justifyContent='end'>
                                <Box display='flex'>
                                    <FormControl>
                                        <FormLabel>Cari Tanggal Transaksi</FormLabel>
                                        <InputGroup>
                                            <InputLeftAddon children={<Icon as={BsCalendar2Week} />} />
                                            <Input type='date' value={filter.fromDate} onChange={(event) => setFilter({ ...filter, fromDate: event.target.value })} />
                                            <Input type='date' value={filter.toDate} onChange={(event) => setFilter({ ...filter, toDate: event.target.value })} disabled={filter.fromDate ? false : true} />
                                            <InputRightElement>
                                                <Button onClick={filterTanggal} disabled={filter.toDate ? false : true} colorScheme='blackAlpha' bgColor='#6B3C3B'><Icon as={IoSearch} /></Button>
                                            </InputRightElement>
                                        </InputGroup>
                                    </FormControl>
                                    <FormControl ml='15px' mt='31px'>
                                        <Button size='md' onClick={btResetFilter} colorScheme='blue'>Reset</Button>
                                    </FormControl>
                                </Box>
                            </Box>
                            <Box mt='4%' display='flex' justifyContent=''>
                                <Text fontWeight='semibold'>Status :</Text>
                                {printStatus()}
                            </Box>
                            <Box my='4%' p='6' borderRadius='15px' border={'2px solid #F3F4F5'}>
                                {printRequest()}
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Center>
                    <Pagination total={Math.ceil(outgoingList.length / limitData)} page={page} onChange={(event) => setPage(event)} size='lg' radius='xl' color='dark' />
                </Center>
            </Box>
        </>
    )
}

export default OutgoingRequest