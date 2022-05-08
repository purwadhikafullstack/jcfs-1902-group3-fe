import { Badge, Box, Button, Center, FormControl, FormLabel, Heading, Icon, Image, Input, InputGroup, InputLeftAddon, InputRightAddon, InputRightElement, Select, Text } from '@chakra-ui/react'
import { Pagination } from '@mantine/core'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import MenuManagement from '../Components/MenuManagement'
import { API_URL } from '../helper'
import { getRequest } from '../redux/actions'

const ManagementRequest = (props) => {
    const dispatch = useDispatch()
    const [page, setPage] = useState(1)
    const [limitData, setLimitData] = useState(6)

    const { requestList } = useSelector((state) => {
        return {
            requestList: state.transactionAdminReducer.requestList
        }
    })

    useEffect(() => {
        dispatch(getRequest())
    }, [])

    const { idrole } = useSelector((state) => {
        return {
            idrole: state.userReducer.idrole
        }
    })

    const btProcess = async (idtransaksi_warehouse) => {
        try {
            let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            let token = localStorage.getItem('data')
            let data = {
                idstatus: 8,
                date                
            }
            Swal.fire({
                title: 'Proses Request?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Proses!'
              }).then(async(result) => {
                if (result.isConfirmed) {
                  Swal.fire(
                    'Proses Berhasil!',
                    'Request Sedang Dalam Proses.',
                    'success',
                    await axios.patch(`${API_URL}/transactionwarehouse/konfirmasi/${idtransaksi_warehouse}`, data, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }),
                    dispatch(getRequest())
                  )
                }
              })
            .then(res => {
                console.log("cek res.data", res.data)
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Process Request',
                    showConfirmButton: false,
                    timer: 1500
                })
            })
            .catch((err) => {
                console.log(err)
            })

            dispatch(getRequest())
        } catch (error) {
            console.log(error)
        }
    }

    const btReject = async (idtransaksi_warehouse) => {
        try {
            let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
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
                confirmButtonText: 'Yes, reject it!'
              }).then(async(result) => {
                if (result.isConfirmed) {
                  Swal.fire(
                    'Rejected!',
                    'Request has been rejected',
                    'success',
                    await axios.patch(`${API_URL}/transactionwarehouse/reject/${idtransaksi_warehouse}`, data, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }),
                    dispatch(getRequest())
                  )
                }
              })
            .then(res => {
                console.log("cek res.data", res.data)
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Reject Request',
                    showConfirmButton: false,
                    timer: 1500
                })
            })
            .catch((err) => {
                console.log(err)
            })

            dispatch(getRequest())
        } catch (error) {
            console.log(error)
        }
    }

    const printRequest = () => {
        if (requestList.length > 0) {
            return requestList.slice(page > 1 ? (page - 1) * limitData : page - 1, page * limitData).map((item, index) => {
                return (
                    <>
                        <Box mt='20px' p='4' border='2px solid #F3F4F5' borderRadius='10px'>
                            <Box display='flex'>
                                <Text>Request {item.added_date.substr(0, 10)}</Text>                                
                                {item.idstatus === 10 && idrole === 2 && <Badge colorScheme='red' ml='2'>Rejected</Badge>}
                                {item.idstatus === 8 && idrole === 2 && <Badge colorScheme='green' ml='2'>On Process</Badge>}
                                <Text fontWeight='semibold' ml='2'>{item.invoice}</Text>
                                {
                                    item.updated_date &&
                                    <Text marginLeft={'auto'}>Updated: {item.updated_date.slice(0, 19).replace('T', ' ')}</Text>
                                }
                            </Box>
                            <Box mt='10px'>
                                <Text fontWeight='semibold'>{item.warehouse}</Text>
                                <Text fontWeight='semibold'>Warehouse : {item.nama}</Text>
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
                                {item.idstatus === 7 && idrole === 2 && <Button size='xs' colorScheme='blackAlpha' onClick={()=>btReject(item.idtransaksi_warehouse)} bgColor='red'>Reject</Button>}
                                {item.idstatus === 7 && idrole === 2 && <Button ml='10px' size='xs' colorScheme='green' onClick={()=>btProcess(item.idtransaksi_warehouse)}>Process Request</Button>}                                
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

    console.log(`requestList`, requestList)
    return (
        <>
            <Box>
                <Box mx='6%' my='2%'>
                    <Box display='flex'>
                        <MenuManagement />
                        <Box ml='2%'>
                            <Heading as='h3' size='lg'>
                                List Request
                            </Heading>
                            <Box w='120%' my='4%' p='6' borderRadius='15px' border={'2px solid #F3F4F5'}>
                                {printRequest()}
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Center>
                    <Pagination total={Math.ceil(requestList.length / limitData)} page={page} onChange={(event) => setPage(event)} size='lg' radius='xl' color='dark' />
                </Center>
            </Box>
        </>
    )
}

export default ManagementRequest