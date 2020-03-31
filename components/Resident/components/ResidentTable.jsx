import React, { useState, useEffect} from 'react';
import { connect } from 'react-redux';
import Link from 'next/link'
import API from '../../../api'
import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Table, Typography, Divider, Pagination, Modal, Select, Input, Button } from 'antd';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import _isEmpty from 'lodash/isEmpty'
import _forEach from 'lodash/forEach'
import isEmpty from 'lodash/isEmpty';

const { Option } = Select;
const { Search } = Input;
const { Title } = Typography;
const { confirm } = Modal;

function mapStateToProps(state) {
  return {
    barangays: state.resident.barangays,
    residents: state.resident.residents,
    pagination: state.resident.tablePagination,
    searchData: state.resident.searchData,
  };
}

const ResidentTable = (props) => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getResidents();
    loadBarangays();
  }, []);

  const loadBarangays = () => {
    if(isEmpty(props.barangays)){
      getBarangays();
    }
  }

  const getResidents = (page = 1) => {
    setLoading(true);
    let filterOptions = {
      page: page,
      ...props.searchData
    }
    API.Resident.all(filterOptions)
    .then((res) => {
      let result = res.data.residents.data;
      let resultPagination = res.data.residents.meta.pagination;
      setLoading(false);
      props.dispatch({
        type: "SET_RESIDENTS",
        data: result
      })
      props.dispatch({
        type: "SET_RESIDENTS_PAGINATION",
        data: resultPagination
      })
    })
    .catch((err) => {
      setLoading(false);
    })
    .then((res) => {
      setLoading(false);
    })
  }

  const getBarangays = () => {
    API.Resident.getBarangay()
    .then(res => {
      let barangayList = res.data.options[0].cities[0].barangays;
      props.dispatch({
        type: "SET_BARANGAY",
        data: barangayList
      })
    })
    .catch(err => {
      
    })
    .then(res => {
      
    })
    ;
  }

  const populateBarangaySelection = (barangays) => {
    let items = [];
    items.push(<Option value="all" key="all" >All Barangay</Option>);   
    _forEach(barangays, function(value, key) {
      items.push(<Option value={value.id} key={value.id} >{value.name}</Option>);   
    });
    return items;
  }

  const setBarangayFilter = (value) => {
    props.dispatch({
      type: "SET_RESIDENTS_SEARCH_DATA",
      data: {...props.searchData,psgc_id:value}
    })
  }
  const setSearchString = (e) => {
    let string = e.target.value;
    props.dispatch({
      type: "SET_RESIDENTS_SEARCH_DATA",
      data: {...props.searchData,query:string}
    })
  }
  const setVotersRegistrationFilter = (value) => {
    props.dispatch({
      type: "SET_RESIDENTS_SEARCH_DATA",
      data: {...props.searchData,is_registered_voter:value}
    })
  }

  const deleteResident = (resident) => {
    API.Resident.delete(resident.id)
    .then(res => {
      getResidents();
    })
    .catch(res => {
      Swal.fire({
        title: 'Error',
        text: 'The system cannot find what you are looking for. It may not have existed or it has been removed.',
        icon: 'error',
        confirmButtonText: 'Ok',
        onClose: () => {}
      })
    })
    .then(res => {})
    ;
  }
  const confirmDeleteResident = (resident) => {
    confirm({
      title: 'Are you sure remove this resident?',
      icon: <ExclamationCircleOutlined />,
      content: `This will permanently remove ${resident.full_name_last} from the list.`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteResident(resident);
      },
      onCancel() {
      },
    });
  }

  const dataSource = props.residents;
  
  const columns = [
    {
      title: 'Name',
      dataIndex: 'full_name_last',
      key: 'full_name_last',
    },
    {
      title: 'Adress',
      key: 'address',
      render: (text, record) => (
        <span>
          { `${record.purok_sitio} ${record.street_address}, ${record.psgc.brgy_name}, ${record.psgc.city_name} ${record.psgc.province_name}` }
        </span>
      ),
    },
    {
      title: 'Voter Status',
      dataIndex: 'is_registered_voter',
      key: 'is_registered_voter',
    },
    {
      title: 'Contact Number',
      dataIndex: 'contact_number_1',
      key: 'contact_number_1',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <Link href={{ pathname: '/resident', query: { id: record.id } }}>
            <a>Edit</a>
          </Link>
          &nbsp;|&nbsp;
          <a href="#!" onClick={ () => confirmDeleteResident(record) }>
            Delete
          </a>
        </span>
      ),
    }
  ];

  const paginationConfig = {
    defaultCurrent: !_isEmpty(props.pagination) ? props.pagination.current_page : 0,
    total: !_isEmpty(props.pagination) ? props.pagination.total : 0,
    pageSize: !_isEmpty(props.pagination) ? props.pagination.per_page : 0,
  };

  const handleResidentPage = (val) => {
    getResidents(val);
  }
  

  return (
    <div>
      <Title style={{textAlign: "center"}}>
        RESIDENTS
      </Title>
      <Divider />
      <Search
        allowClear
        placeholder="input search text"
        onChange={value => setSearchString(value)}
        style={{ width: 200 }}
        onSearch={getResidents}
        defaultValue={props.searchData.query}
      />
      <Select
        showSearch
        allowClear
        style={{ width: 200 }}
        placeholder="Select a Barangay"
        optionFilterProp="children"
        onChange={setBarangayFilter}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        defaultValue={props.searchData.psgc_id}
      >
        {populateBarangaySelection(props.barangays)}
      </Select>
      <Select
        allowClear
        placeholder="Select Voters Registration Status"
        style={{ width: 200 }}
        onChange={setVotersRegistrationFilter}
        defaultValue={props.searchData.is_registered_voter}
      >
        <Option value="1">Registered</Option>
        <Option value="0">Not Registered</Option>
      </Select>
      <Button type="primary" icon={<SearchOutlined />} onClick={getResidents}>
        Search
      </Button>
      <Table dataSource={dataSource} columns={columns} pagination={false} loading={loading} />
      <Divider />

      {!_isEmpty(props.residents) ? (<Pagination {...paginationConfig} onChange={handleResidentPage} />): ""}

    </div>
  );
}


export default connect(
  mapStateToProps,
)(ResidentTable);